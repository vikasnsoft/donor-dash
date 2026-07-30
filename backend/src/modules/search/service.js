/**
 * Unified Search Service
 * 
 * Searches across all modules from a single endpoint.
 * Returns results grouped by entity type.
 * 
 * Uses MongoDB text search and regex for flexibility.
 */

import mongoose from 'mongoose';

// Lazy-load models to avoid circular imports
const getModel = (name) => mongoose.model(name);

/**
 * Search across all entities for an organisation.
 */
export const search = async (orgId, query, options = {}) => {
  if (!query || query.length < 2) {
    return { results: [], total: 0 };
  }

  const limit = Math.min(options.limit || 5, 20);
  const regex = { $regex: query, $options: 'i' };

  const [donors, events, campaigns, donations, groups, expenses] = await Promise.allSettled([
    searchDonors(orgId, regex, limit),
    searchEvents(orgId, regex, limit),
    searchCampaigns(orgId, regex, limit),
    searchDonations(orgId, regex, limit),
    searchGroups(orgId, regex, limit),
    searchExpenses(orgId, regex, limit),
  ]);

  const results = [
    ...formatResults('donor', donors, '/donors'),
    ...formatResults('event', events, '/events'),
    ...formatResults('campaign', campaigns, '/campaigns'),
    ...formatResults('donation', donations, '/donations'),
    ...formatResults('group', groups, '/groups'),
    ...formatResults('expense', expenses, '/expenses'),
  ];

  // Sort by relevance (exact name match first, then by date)
  results.sort((a, b) => {
    const aExact = a.title.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1;
    const bExact = b.title.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return {
    results: results.slice(0, limit * 3), // Return up to 15 results
    total: results.length,
    query,
  };
};

async function searchDonors(orgId, regex, limit) {
  const Donor = getModel('Donor');
  return await Donor.find({
    organisation: orgId,
    $or: [
      { name: regex },
      { phone: regex },
      { email: regex },
    ],
  })
    .select('name type phone email stats.totalDonated updatedAt')
    .limit(limit)
    .lean();
}

async function searchEvents(orgId, regex, limit) {
  const Event = getModel('Event');
  return await Event.find({
    organisation: orgId,
    archivedAt: null,
    $or: [
      { name: regex },
      { description: regex },
    ],
  })
    .select('name type status startDate endDate updatedAt')
    .limit(limit)
    .lean();
}

async function searchCampaigns(orgId, regex, limit) {
  const Campaign = getModel('Campaign');
  return await Campaign.find({
    organisation: orgId,
    archivedAt: null,
    $or: [
      { name: regex },
      { description: regex },
    ],
  })
    .select('name type status target collected updatedAt')
    .limit(limit)
    .lean();
}

async function searchDonations(orgId, regex, limit) {
  const Donation = getModel('Donation');
  return await Donation.find({
    organisation: orgId,
    $or: [
      { receiptNumber: regex },
      { reference: regex },
      { notes: regex },
    ],
  })
    .select('receiptNumber amount method status date donor')
    .populate('donor', 'name')
    .limit(limit)
    .lean();
}

async function searchGroups(orgId, regex, limit) {
  const Group = getModel('Group');
  return await Group.find({
    organisation: orgId,
    isArchived: false,
    $or: [
      { name: regex },
      { description: regex },
    ],
  })
    .select('name type description members updatedAt')
    .limit(limit)
    .lean();
}

async function searchExpenses(orgId, regex, limit) {
  const Expense = getModel('Expense');
  return await Expense.find({
    isDeleted: false,
    $or: [
      { description: regex },
      { category: regex },
      { notes: regex },
    ],
  })
    .select('description amount category date paidBy group')
    .populate('paidBy', 'name')
    .populate('group', 'name')
    .limit(limit)
    .lean();
}

function formatResults(type, result, basePath) {
  if (result.status !== 'fulfilled' || !result.value) return [];

  return result.value.map((item) => {
    const formatted = {
      type,
      id: item._id.toString(),
      title: '',
      subtitle: '',
      path: `${basePath}/${item._id}`,
      updatedAt: item.updatedAt || item.date || new Date(),
    };

    switch (type) {
      case 'donor':
        formatted.title = item.name;
        formatted.subtitle = `${item.type} · ${item.phone || item.email || 'No contact'}`;
        break;
      case 'event':
        formatted.title = item.name;
        formatted.subtitle = `${item.type} · ${item.status}`;
        break;
      case 'campaign':
        formatted.title = item.name;
        formatted.subtitle = `${item.type} · ${item.status}`;
        break;
      case 'donation':
        formatted.title = `₹${parseFloat(item.amount?.toString() || '0').toLocaleString('en-IN')}`;
        formatted.subtitle = `${item.receiptNumber || ''} · ${item.donor?.name || 'Unknown'} · ${item.method}`;
        break;
      case 'group':
        formatted.title = item.name;
        formatted.subtitle = `${item.type} · ${item.members?.length || 0} members`;
        break;
      case 'expense':
        formatted.title = item.description;
        formatted.subtitle = `₹${parseFloat(item.amount?.toString() || '0').toLocaleString('en-IN')} · ${item.category || 'General'}`;
        break;
    }

    return formatted;
  });
}
