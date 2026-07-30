/**
 * Feature flags for Donor Dash.
 * Toggle features without code changes.
 */

const flags = {
  // Phase 2.1 — Donor Platform
  organisations: true,
  events: true,
  campaigns: true,
  donors: true,
  donations: true,
  collections: false,

  // Phase 2.2 — Accounting
  ledger: true,
  reports: true,

  // Phase 2.3 — Shared Expenses
  groups: true,
  expenses: true,
  settlements: true,

  // Phase 2.4 — Automation
  ocr: false,
  notifications: true,
  recurring: false,

  // Phase 2.5 — Analytics & Projections
  projections: true,
  search: false,
  analytics: true,

  // Phase 2.6 — Personal Finance
  budgets: false,
  bankSync: false,

  // Phase 2.7 — AI
  ai: false,

  // Infrastructure
  redis: false,
  sentry: false,
};

export const isEnabled = (feature) => flags[feature] === true;
export const getAllFlags = () => ({ ...flags });
export const enable = (feature) => { if (feature in flags) flags[feature] = true; };
export const disable = (feature) => { if (feature in flags) flags[feature] = false; };

export const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!isEnabled(feature)) {
      return res.status(404).json({
        success: false,
        data: null,
        meta: {},
        error: { code: 'FEATURE_DISABLED', message: `Feature '${feature}' is not yet enabled` },
      });
    }
    next();
  };
};

export default { isEnabled, getAllFlags, enable, disable, requireFeature };
