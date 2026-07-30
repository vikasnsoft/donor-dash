import asyncHandler from '../../middleware/asyncHandler.js';
import { DailyDonation, CampaignSummary, VolunteerPerformance, DonorRetention, FinancialSummary, EventOverview } from './models.js';
import { registry } from './engine.js';
import mongoose from 'mongoose';

/**
 * Get daily donations for an event.
 */
const getDailyDonations = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { from, to } = req.query;

  const filter = { event: eventId };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const data = await DailyDonation.find(filter).sort('date');

  // Calculate running cumulative
  let cumulative = 0;
  const enriched = data.map(d => {
    cumulative += parseFloat(d.totalAmount?.toString() || '0');
    return {
      date: d.date,
      totalAmount: parseFloat(d.totalAmount?.toString() || '0'),
      donationCount: d.donationCount,
      cumulativeTotal: cumulative,
      byMethod: d.byMethod,
    };
  });

  res.json({ success: true, data: enriched });
});

/**
 * Get campaign summaries for an event.
 */
const getCampaignSummaries = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const data = await CampaignSummary.find({ event: eventId })
    .populate('topVolunteer.userId', 'name')
    .sort('-collected');

  res.json({ success: true, data });
});

/**
 * Get volunteer performance for an event.
 */
const getVolunteerPerformance = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const data = await VolunteerPerformance.find({ event: eventId })
    .populate('volunteer', 'name avatar')
    .sort('-totalCollected');

  res.json({ success: true, data });
});

/**
 * Get donor retention stats for an organisation.
 */
const getDonorRetention = asyncHandler(async (req, res) => {
  const { orgId } = req.params;

  const [total, returning] = await Promise.all([
    DonorRetention.countDocuments({ organisation: orgId }),
    DonorRetention.countDocuments({ organisation: orgId, isReturning: true }),
  ]);

  const retentionRate = total > 0 ? Math.round((returning / total) * 100) : 0;

  // Top donors by total donated
  const topDonors = await DonorRetention.find({ organisation: orgId })
    .populate('donor', 'name phone')
    .sort('-totalDonated')
    .limit(10);

  res.json({
    success: true,
    data: {
      totalDonors: total,
      returningDonors: returning,
      retentionRate,
      topDonors,
    },
  });
});

/**
 * Get organisation dashboard (uses FinancialSummary + projections).
 */
const getOrganisationDashboard = asyncHandler(async (req, res) => {
  const { orgId } = req.params;

  // Get active events count
  const Event = mongoose.model('Event');
  const activeEvents = await Event.countDocuments({ organisation: orgId, status: 'active' });

  // Get total donors
  const Donor = mongoose.model('Donor');
  const totalDonors = await Donor.countDocuments({ organisation: orgId });

  // Get recent daily donations across all events
  const recentDonations = await DailyDonation.find({ organisation: orgId })
    .sort('-date')
    .limit(7);

  // Get top campaigns
  const topCampaigns = await CampaignSummary.find({ organisation: orgId })
    .sort('-collected')
    .limit(5);

  res.json({
    success: true,
    data: {
      activeEvents,
      totalDonors,
      recentDonations,
      topCampaigns,
    },
  });
});

/**
 * Get projector health status.
 */
const getProjectionStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, data: registry.getHealth() });
});

/**
 * Get financial summary projection for an organisation.
 */
const getFinancialSummary = asyncHandler(async (req, res) => {
  const { orgId } = req.params;

  let summary = await FinancialSummary.findOne({ organisation: orgId });
  if (!summary) {
    summary = { organisation: orgId, totalDonations: 0, totalExpenses: 0, cashBalance: 0, bankBalance: 0 };
  }

  res.json({ success: true, data: summary });
});

/**
 * Get event overviews for an organisation.
 */
const getEventOverviews = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { status } = req.query;

  const filter = { organisation: orgId };
  if (status) filter.status = status;

  const data = await EventOverview.find(filter).sort('-startDate');

  res.json({ success: true, data });
});

/**
 * Get a single event overview.
 */
const getEventOverview = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const data = await EventOverview.findOne({ event: eventId });
  if (!data) {
    return res.json({ success: true, data: null });
  }

  res.json({ success: true, data });
});

export {
  getDailyDonations,
  getCampaignSummaries,
  getVolunteerPerformance,
  getDonorRetention,
  getOrganisationDashboard,
  getProjectionStatus,
  getFinancialSummary,
  getEventOverviews,
  getEventOverview,
};
