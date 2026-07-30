import asyncHandler from '../../middleware/asyncHandler.js';
import { ledgerRepo, accountRepo } from '../ledger/repository.js';
import eventRepo from '../events/repository.js';
import donationRepo from '../donations/repository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Income Statement (Income & Expenditure Account)
 */
const getIncomeStatement = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { from, to } = req.query;

  const startDate = from ? new Date(from) : new Date(new Date().getFullYear(), 3, 1); // Indian FY start
  const endDate = to ? new Date(to) : new Date();

  // Get all income and expense accounts
  const [incomeAccounts, expenseAccounts] = await Promise.all([
    accountRepo.findByType('income', orgId),
    accountRepo.findByType('expense', orgId),
  ]);

  // Get balances for each account in the period
  const income = [];
  let totalIncome = 0;

  for (const account of incomeAccounts) {
    const balance = await ledgerRepo.getAccountBalance(account._id, orgId, endDate);
    const amount = balance.credits - balance.debits;
    if (amount > 0) {
      income.push({ account: { name: account.name, code: account.code }, amount: Math.round(amount * 100) / 100 });
      totalIncome += amount;
    }
  }

  const expenses = [];
  let totalExpenses = 0;

  for (const account of expenseAccounts) {
    const balance = await ledgerRepo.getAccountBalance(account._id, orgId, endDate);
    const amount = balance.debits - balance.credits;
    if (amount > 0) {
      expenses.push({ account: { name: account.name, code: account.code }, amount: Math.round(amount * 100) / 100 });
      totalExpenses += amount;
    }
  }

  res.json({
    success: true,
    data: {
      period: { from: startDate, to: endDate },
      income: { items: income, total: Math.round(totalIncome * 100) / 100 },
      expenses: { items: expenses, total: Math.round(totalExpenses * 100) / 100 },
      surplus: Math.round((totalIncome - totalExpenses) * 100) / 100,
    },
  });
});

/**
 * Event Financial Summary
 */
const getEventReport = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await eventRepo.findById(eventId);
  if (!event) throw new NotFoundError('Event', eventId);

  // Get ledger summary for event
  const ledgerSummary = await ledgerRepo.getEventSummary(eventId);

  // Get donation stats
  const donationStats = await donationRepo.getDonationStats(event.organisation, eventId);

  res.json({
    success: true,
    data: {
      event: {
        _id: event._id,
        name: event.name,
        status: event.status,
        startDate: event.startDate,
        endDate: event.endDate,
      },
      financial: {
        totalDonations: event.totalDonations,
        totalExpenses: event.totalExpenses,
        balance: parseFloat(event.totalDonations?.toString() || '0') - parseFloat(event.totalExpenses?.toString() || '0'),
      },
      ledger: ledgerSummary,
      donations: donationStats,
    },
  });
});

/**
 * Donation Report by Method
 */
const getDonationReport = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { eventId, from, to } = req.query;

  let eventIdFilter = eventId;
  if (!eventIdFilter) {
    // If no event specified, get current active event
    const events = await eventRepo.findByOrganisation(orgId, { status: 'active' }, { limit: 1 });
    if (events.data?.length > 0) eventIdFilter = events.data[0]._id;
  }

  if (!eventIdFilter) {
    return res.json({ success: true, data: { byMethod: [], byStatus: [], daily: [] } });
  }

  const [byMethod, byStatus, daily] = await Promise.all([
    donationRepo.getMethodBreakdown(eventIdFilter),
    donationRepo.getDonationStats(orgId, eventIdFilter),
    donationRepo.getDailyDonations(eventIdFilter, from ? new Date(from) : new Date(0), to ? new Date(to) : new Date()),
  ]);

  res.json({
    success: true,
    data: { byMethod, byStatus, daily },
  });
});

/**
 * Volunteer Collection Report
 */
const getVolunteerReport = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Get all donations for the event grouped by collector
  const result = await donationRepo.model.aggregate([
    { $match: { event: eventId, status: 'received', collectedBy: { $ne: null } } },
    {
      $group: {
        _id: '$collectedBy',
        totalAmount: { $sum: { $toDouble: '$amount' } },
        donationCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'volunteer',
      },
    },
    { $unwind: '$volunteer' },
    {
      $project: {
        volunteerId: '$_id',
        volunteerName: '$volunteer.name',
        totalAmount: 1,
        donationCount: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  res.json({ success: true, data: result });
});

export { getIncomeStatement, getEventReport, getDonationReport, getVolunteerReport };
