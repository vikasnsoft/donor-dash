import mongoose from 'mongoose';
import Settlement from './model.js';
import { balanceRepo } from '../expenses/repository.js';
import groupRepo from '../groups/repository.js';
import accounting from '../shared/accounting.js';
import { emit } from '../shared/eventBus.js';
import { NotFoundError, BusinessRuleError, AuthorizationError } from '../../utils/errors.js';
import { BaseRepository } from '../shared/repository.js';

class SettlementRepository extends BaseRepository {
  constructor() { super(Settlement); }

  async findByGroup(groupId, filters = {}, options = {}) {
    const filter = { group: groupId, ...filters };
    return await this.paginate(filter, {
      populate: [
        { path: 'paidBy', select: 'name avatar' },
        { path: 'paidTo', select: 'name avatar' },
      ],
      sort: '-createdAt',
      ...options,
    });
  }
}

const settlementRepo = new SettlementRepository();

export const create = async (data, userId) => {
  const group = await groupRepo.findByIdWithMembers(data.group);
  if (!group) throw new NotFoundError('Group', data.group);

  // Verify both parties are group members
  const isPayer = group.members.some(m => m.user._id.toString() === data.paidBy);
  const isPayee = group.members.some(m => m.user._id.toString() === data.paidTo);
  if (!isPayer || !isPayee) throw new AuthorizationError('Both parties must be group members');
  if (data.paidBy === data.paidTo) throw new BusinessRuleError('Cannot settle with yourself', 'settlement.self');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create settlement
    const [settlement] = await settlementRepo.create({
      ...data,
      status: 'confirmed',
      confirmedBy: userId,
      createdBy: userId,
    }, { session });

    // Update balance: reduce what paidBy owes to paidTo
    await balanceRepo.updateBetween(
      data.group,
      data.paidBy,    // from: person paying
      data.paidTo,    // to: person receiving
      -parseFloat(String(data.amount)), // Negative to reduce balance
      session
    );

    // Post ledger entry if organisation is linked
    if (group.organisation) {
      const paidByUser = group.members.find(m => m.user._id.toString() === data.paidBy);
      const paidToUser = group.members.find(m => m.user._id.toString() === data.paidTo);

      await accounting.recordSettlement({
        amount: parseFloat(String(data.amount)),
        fromName: paidByUser?.user?.name || 'Unknown',
        toName: paidToUser?.user?.name || 'Unknown',
        groupName: group.name,
        sourceId: settlement._id,
      }, { session, userId, orgId: group.organisation });
    }

    await session.commitTransaction();

    await emit('settlement.confirmed', {
      settlementId: settlement._id,
      groupId: data.group,
      paidBy: data.paidBy,
      paidTo: data.paidTo,
      amount: parseFloat(String(data.amount)),
      confirmedBy: userId,
    });

    return settlement;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const getByGroup = async (groupId, userId, query) => {
  const isMember = await groupRepo.isMember(groupId, userId);
  if (!isMember) throw new AuthorizationError('Not a member of this group');

  return await settlementRepo.findByGroup(groupId, {}, {
    page: query.page,
    limit: query.limit,
  });
};

export const getById = async (id, userId) => {
  const settlement = await settlementRepo.findById(id, {
    populate: [
      { path: 'paidBy', select: 'name avatar' },
      { path: 'paidTo', select: 'name avatar' },
      { path: 'group', select: 'name' },
    ],
  });
  if (!settlement) throw new NotFoundError('Settlement', id);
  return settlement;
};

export { settlementRepo };
