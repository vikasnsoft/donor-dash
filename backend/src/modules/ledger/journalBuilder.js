/**
 * Journal Builder — Pure business logic for converting financial operations
 * into balanced accounting entries.
 * 
 * This module has NO database dependency. It receives account references
 * and returns balanced journal line arrays.
 * 
 * Every method returns { description, lines } where lines is an array of
 * { account, type, amount, description }.
 * 
 * INVARIANT: sum(debits) === sum(credits) for every entry.
 */

import mongoose from 'mongoose';

/**
 * Create a balanced journal entry for a donation.
 * 
 * Cash donation:
 *   Debit:  Cash (Asset)
 *   Credit: Donation Income (Income)
 * 
 * UPI/Bank donation:
 *   Debit:  Bank (Asset)
 *   Credit: Donation Income (Income)
 */
export const donationEntry = ({ amount, method, donorName, eventName, receiptNumber }) => {
  const amt = parseFloat(String(amount));

  // Determine debit account based on payment method
  let debitAccountKey;
  switch (method) {
    case 'cash':
      debitAccountKey = 'cash';
      break;
    case 'upi':
    case 'bank_transfer':
    case 'qr':
      debitAccountKey = 'bank';
      break;
    case 'cheque':
      debitAccountKey = 'bank'; // Cheques go to bank
      break;
    case 'online':
      debitAccountKey = 'bank';
      break;
    default:
      debitAccountKey = 'cash';
  }

  const description = `Donation from ${donorName} — ${eventName} (${receiptNumber})`;

  return {
    description,
    debitAccountKey,
    creditAccountKey: 'donation_income',
    amount: amt,
    lineDescriptions: {
      debit: `Received via ${method} — ${donorName}`,
      credit: `Donation — ${receiptNumber}`,
    },
  };
};

/**
 * Create a balanced journal entry for a donation refund.
 */
export const refundEntry = ({ amount, donorName, eventName, originalReceipt }) => {
  const amt = parseFloat(String(amount));

  return {
    description: `Refund to ${donorName} — ${eventName} (${originalReceipt})`,
    debitAccountKey: 'donation_income',
    creditAccountKey: 'cash',
    amount: amt,
    lineDescriptions: {
      debit: `Refund reversal — ${originalReceipt}`,
      credit: `Refund paid to ${donorName}`,
    },
  };
};

/**
 * Create a balanced journal entry for an expense.
 */
export const expenseEntry = ({ amount, category, eventName, vendorName, notes }) => {
  const amt = parseFloat(String(amount));

  // Map category to expense account
  const expenseAccountMap = {
    decoration: 'decoration_expense',
    venue: 'venue_expense',
    sound: 'sound_lighting_expense',
    lighting: 'sound_lighting_expense',
    prasad: 'prasad_expense',
    food: 'prasad_expense',
    security: 'misc_expense',
    marketing: 'misc_expense',
    transport: 'misc_expense',
    misc: 'misc_expense',
    committee: 'committee_expense',
    volunteer: 'volunteer_expense',
  };

  const expenseAccountKey = expenseAccountMap[category] || 'misc_expense';

  return {
    description: `${vendorName || category} — ${eventName}${notes ? ` (${notes})` : ''}`,
    debitAccountKey: expenseAccountKey,
    creditAccountKey: 'cash',
    amount: amt,
    lineDescriptions: {
      debit: `${category} — ${vendorName || eventName}`,
      credit: `Payment for ${category}`,
    },
  };
};

/**
 * Create a balanced journal entry for a settlement.
 */
export const settlementEntry = ({ amount, fromName, toName, groupName }) => {
  const amt = parseFloat(String(amount));

  return {
    description: `Settlement: ${fromName} → ${toName} — ${groupName}`,
    debitAccountKey: 'outstanding_settlements',
    creditAccountKey: 'cash',
    amount: amt,
    lineDescriptions: {
      debit: `Settlement cleared: ${fromName}`,
      credit: `Received by ${toName}`,
    },
  };
};

/**
 * Create a balanced journal entry for a cash-to-bank transfer.
 */
export const transferEntry = ({ amount, fromAccount, toAccount, notes }) => {
  const amt = parseFloat(String(amount));

  return {
    description: `Transfer: ${fromAccount} → ${toAccount}${notes ? ` (${notes})` : ''}`,
    debitAccountKey: toAccount === 'bank' ? 'bank' : 'cash',
    creditAccountKey: fromAccount === 'cash' ? 'cash' : 'bank',
    amount: amt,
    lineDescriptions: {
      debit: `Transfer in from ${fromAccount}`,
      credit: `Transfer out to ${toAccount}`,
    },
  };
};

/**
 * Create a balanced journal entry for an opening balance.
 */
export const openingBalanceEntry = ({ amount, date, notes }) => {
  const amt = parseFloat(String(amount));

  return {
    description: `Opening balance${notes ? ` — ${notes}` : ''}`,
    debitAccountKey: 'cash',
    creditAccountKey: 'opening_balance',
    amount: amt,
    date: date || new Date(),
    lineDescriptions: {
      debit: 'Opening cash balance',
      credit: 'Opening balance equity',
    },
  };
};

/**
 * Validate that a set of journal lines is balanced.
 * Returns { balanced, debits, credits, difference }.
 */
export const validateBalance = (lines) => {
  let debits = 0;
  let credits = 0;

  for (const line of lines) {
    const amount = parseFloat(String(line.amount));
    if (line.type === 'debit') debits += amount;
    else credits += amount;
  }

  return {
    balanced: Math.abs(debits - credits) < 0.01,
    debits: Math.round(debits * 100) / 100,
    credits: Math.round(credits * 100) / 100,
    difference: Math.round((debits - credits) * 100) / 100,
  };
};
