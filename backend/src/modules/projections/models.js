import mongoose from 'mongoose';

/**
 * Daily Donation Projection
 * Pre-aggregated daily donation totals per event.
 * Updated on: donation.recorded, donation.cancelled
 */
const dailyDonationSchema = new mongoose.Schema({
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  date: { type: Date, required: true },
  // Totals
  totalAmount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  donationCount: { type: Number, default: 0 },
  // By method
  byMethod: {
    cash: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    upi: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    bank_transfer: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    cheque: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    online: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    qr: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  },
  // Running cumulative
  cumulativeTotal: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

dailyDonationSchema.index({ organisation: 1, event: 1, date: 1 }, { unique: true });
dailyDonationSchema.index({ event: 1, date: 1 });

/**
 * Campaign Summary Projection
 * Pre-aggregated campaign performance metrics.
 * Updated on: donation.recorded, campaign.updated
 */
const campaignSummarySchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, unique: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  name: { type: String },
  target: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  collected: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  donationCount: { type: Number, default: 0 },
  uniqueDonors: { type: Number, default: 0 },
  averageDonation: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  completionPercentage: { type: Number, default: 0 },
  // Volunteer performance
  volunteerCount: { type: Number, default: 0 },
  topVolunteer: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    amount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  },
  // By method
  byMethod: {
    cash: { type: Number, default: 0 },
    upi: { type: Number, default: 0 },
    bank_transfer: { type: Number, default: 0 },
    cheque: { type: Number, default: 0 },
    online: { type: Number, default: 0 },
    qr: { type: Number, default: 0 },
  },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

campaignSummarySchema.index({ event: 1 });
campaignSummarySchema.index({ organisation: 1 });

/**
 * Financial Summary Projection
 * Organisation-level financial snapshot.
 * Updated on: ledger.posted, ledger.entry.voided
 */
const financialSummarySchema = new mongoose.Schema({
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true, unique: true },
  // Current balances
  cashBalance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  bankBalance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  // Totals (current financial year)
  totalIncome: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  totalExpenses: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  totalDonations: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  // By category
  expensesByCategory: {
    decoration: { type: Number, default: 0 },
    venue: { type: Number, default: 0 },
    sound_lighting: { type: Number, default: 0 },
    prasad: { type: Number, default: 0 },
    committee: { type: Number, default: 0 },
    volunteer: { type: Number, default: 0 },
    misc: { type: Number, default: 0 },
  },
  // Recent activity
  lastDonationAt: { type: Date },
  lastExpenseAt: { type: Date },
  lastEntryNumber: { type: String },
  // Counts
  activeEvents: { type: Number, default: 0 },
  totalDonors: { type: Number, default: 0 },
  pendingSettlements: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

/**
 * Volunteer Performance Projection
 * Per-volunteer collection metrics.
 * Updated on: donation.recorded
 */
const volunteerPerformanceSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  totalCollected: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  donationCount: { type: Number, default: 0 },
  uniqueDonors: { type: Number, default: 0 },
  averageDonation: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  routesCompleted: { type: Number, default: 0 },
  routesAssigned: { type: Number, default: 0 },
  lastDonationAt: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

volunteerPerformanceSchema.index({ volunteer: 1, event: 1 }, { unique: true });
volunteerPerformanceSchema.index({ event: 1, totalCollected: -1 });

/**
 * Donor Retention Projection
 * Tracks repeat donors across events.
 * Updated on: donation.recorded
 */
const donorRetentionSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  eventsAttended: { type: Number, default: 0 },
  totalDonated: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  firstDonationDate: { type: Date },
  lastDonationDate: { type: Date },
  averageDonation: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  isReturning: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

donorRetentionSchema.index({ donor: 1, organisation: 1 }, { unique: true });
donorRetentionSchema.index({ organisation: 1, isReturning: 1 });

/**
 * Event Overview Projection
 * Summary card for events — used on dashboards and event list.
 * Updated on: donation.recorded, expense.created, campaign.created, event.updated
 */
const eventOverviewSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  name: { type: String },
  type: { type: String },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  // Financial
  totalDonations: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  totalExpenses: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  balance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  // Counts
  campaignCount: { type: Number, default: 0 },
  committeeSize: { type: Number, default: 0 },
  donorCount: { type: Number, default: 0 },
  volunteerCount: { type: Number, default: 0 },
  // Budget
  budgetAllocated: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  budgetUtilisation: { type: Number, default: 0 }, // percentage
  // Completion
  donationTarget: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  donationCompletion: { type: Number, default: 0 }, // percentage
  // Metadata
  _projection: {
    version: { type: Number, default: 1 },
    lastProcessedEvent: { type: String },
    lastProcessedAt: { type: Date },
    processedCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    rebuiltAt: { type: Date },
  },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

eventOverviewSchema.index({ organisation: 1, status: 1 });
eventOverviewSchema.index({ organisation: 1, startDate: -1 });

export const DailyDonation = mongoose.model('DailyDonation', dailyDonationSchema);
export const CampaignSummary = mongoose.model('CampaignSummary', campaignSummarySchema);
export const FinancialSummary = mongoose.model('FinancialSummary', financialSummarySchema);
export const VolunteerPerformance = mongoose.model('VolunteerPerformance', volunteerPerformanceSchema);
export const DonorRetention = mongoose.model('DonorRetention', donorRetentionSchema);
export const EventOverview = mongoose.model('EventOverview', eventOverviewSchema);
