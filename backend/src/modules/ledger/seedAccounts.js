/**
 * Default Chart of Accounts for Indian community organisations.
 * Seeds accounts for assets, liabilities, income, expenses, and equity.
 */

export const defaultAccounts = [
  // Assets
  { code: '1000', name: 'Cash', type: 'asset', normalBalance: 'debit', description: 'Physical cash on hand' },
  { code: '1010', name: 'Bank Account', type: 'asset', normalBalance: 'debit', description: 'Main bank account' },
  { code: '1020', name: 'UPI Wallet', type: 'asset', normalBalance: 'debit', description: 'Digital wallet balance' },
  { code: '1030', name: 'Receivables', type: 'asset', normalBalance: 'debit', description: 'Money owed to us (pledges)' },
  { code: '1040', name: 'Inventory', type: 'asset', normalBalance: 'debit', description: 'Event assets and equipment' },

  // Liabilities
  { code: '2000', name: 'Payables', type: 'liability', normalBalance: 'credit', description: 'Money we owe (vendor payments)' },
  { code: '2010', name: 'Outstanding Settlements', type: 'liability', normalBalance: 'credit', description: 'Pending settlements between members' },

  // Income
  { code: '3000', name: 'Donation Income', type: 'income', normalBalance: 'credit', description: 'All donations received' },
  { code: '3010', name: 'Collection Income', type: 'income', normalBalance: 'credit', description: 'Door-to-door and campaign collections' },
  { code: '3020', name: 'Other Income', type: 'income', normalBalance: 'credit', description: 'Interest, miscellaneous income' },

  // Expenses
  { code: '4000', name: 'Decoration Expense', type: 'expense', normalBalance: 'debit', description: 'Event decorations' },
  { code: '4010', name: 'Venue Expense', type: 'expense', normalBalance: 'debit', description: 'Hall rental, pandal construction' },
  { code: '4020', name: 'Sound & Lighting', type: 'expense', normalBalance: 'debit', description: 'Audio/visual equipment' },
  { code: '4030', name: 'Prasad Expense', type: 'expense', normalBalance: 'debit', description: 'Food offerings' },
  { code: '4040', name: 'Committee Expense', type: 'expense', normalBalance: 'debit', description: 'Administrative costs' },
  { code: '4050', name: 'Volunteer Expense', type: 'expense', normalBalance: 'debit', description: 'Volunteer reimbursements' },
  { code: '4060', name: 'Miscellaneous Expense', type: 'expense', normalBalance: 'debit', description: 'Other expenses' },

  // Equity
  { code: '5000', name: 'Opening Balance', type: 'equity', normalBalance: 'credit', description: 'Starting balance' },
  { code: '5010', name: 'Retained Earnings', type: 'equity', normalBalance: 'credit', description: 'Accumulated surplus/deficit' },
];
