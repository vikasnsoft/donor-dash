import donorRepo from './repository.js';
import orgRepo from '../organisations/repository.js';
import { emit } from '../shared/eventBus.js';
import { NotFoundError, ConflictError, AuthorizationError } from '../../utils/errors.js';

export const create = async (data, orgId, userId) => {
  const org = await orgRepo.findById(orgId);
  if (!org) throw new NotFoundError('Organisation', orgId);

  // Duplicate detection
  if (data.phone || data.email) {
    const duplicates = await donorRepo.findDuplicates(orgId, {
      phone: data.phone,
      email: data.email,
    });
    if (duplicates.length > 0) {
      const existing = duplicates[0];
      throw new ConflictError(
        `Similar donor found: ${existing.name} (${existing.phone || existing.email}). Use a different phone/email or update the existing donor.`
      );
    }
  }

  const donor = await donorRepo.create({
    ...data,
    organisation: orgId,
    createdBy: userId,
  });

  await emit('donor.created', {
    donorId: donor._id,
    orgId,
    name: donor.name,
    type: donor.type,
    createdBy: userId,
  });

  return donor;
};

export const getAll = async (orgId, userId, query) => {
  const filters = {};
  if (query.type) filters.type = query.type;
  if (query.tag) filters.tags = query.tag;
  if (query.city) filters['address.city'] = { $regex: query.city, $options: 'i' };

  return await donorRepo.findByOrganisation(orgId, filters, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || '-createdAt',
  });
};

export const search = async (orgId, query, options) => {
  if (!query || query.length < 2) {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
  return await donorRepo.search(orgId, query, options);
};

export const getById = async (donorId, userId) => {
  const donor = await donorRepo.findById(donorId, {
    populate: { path: 'createdBy', select: 'name email' },
  });
  if (!donor) throw new NotFoundError('Donor', donorId);
  return donor;
};

export const update = async (donorId, data, userId) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new NotFoundError('Donor', donorId);

  // Check for duplicate phone/email if changing
  if (data.phone && data.phone !== donor.phone) {
    const duplicates = await donorRepo.findDuplicates(donor.organisation, { phone: data.phone });
    const conflict = duplicates.find(d => d._id.toString() !== donorId);
    if (conflict) {
      throw new ConflictError(`Phone number already belongs to: ${conflict.name}`);
    }
  }
  if (data.email && data.email !== donor.email) {
    const duplicates = await donorRepo.findDuplicates(donor.organisation, { email: data.email });
    const conflict = duplicates.find(d => d._id.toString() !== donorId);
    if (conflict) {
      throw new ConflictError(`Email already belongs to: ${conflict.name}`);
    }
  }

  // Prevent updating stats directly
  delete data.stats;
  delete data.organisation;
  delete data.createdBy;

  const updated = await donorRepo.updateById(donorId, data);

  await emit('donor.updated', { donorId, orgId: donor.organisation, updatedBy: userId });

  return updated;
};

export const remove = async (donorId, userId) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new NotFoundError('Donor', donorId);

  if (donor.stats.donationCount > 0) {
    throw new ConflictError(
      `Cannot delete donor with ${donor.stats.donationCount} existing donations. Consider archiving instead.`
    );
  }

  await donorRepo.deleteOne({ _id: donorId });

  await emit('donor.deleted', { donorId, orgId: donor.organisation, deletedBy: userId });

  return { message: 'Donor removed' };
};

export const getTopDonors = async (orgId, limit = 10) => {
  return await donorRepo.find(
    { organisation: orgId },
    {
      select: 'name type phone stats.totalDonated stats.donationCount stats.lastDonationDate',
      sort: '-stats.totalDonated',
      limit,
    }
  );
};
