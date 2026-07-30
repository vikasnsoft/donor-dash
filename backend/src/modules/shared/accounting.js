/**
 * Accounting Facade
 * 
 * Single integration point for all financial workflows.
 * Every module that needs to post to the ledger goes through this facade.
 * 
 * This replaces direct calls to ledgerService.postEntry() from business modules.
 * 
 * Usage:
 *   import { accounting } from '../shared/accounting.js';
 *   await accounting.recordDonation(data, options);
 *   await accounting.recordExpense(data, options);
 */

import * as ledgerService from '../ledger/service.js';

export const accounting = {
  /**
   * Record a donation — posts journal entry for donation income.
   * 
   * Journal:
   *   Debit:  Cash/Bank (based on method)
   *   Credit: Donation Income
   */
  async recordDonation({ amount, method, donorName, eventName, receiptNumber, sourceId }, options) {
    return await ledgerService.postEntry('donation', {
      amount,
      method,
      donorName,
      eventName,
      receiptNumber,
      sourceId,
    }, options);
  },

  /**
   * Record a refund — reverses donation income.
   * 
   * Journal:
   *   Debit:  Donation Income
   *   Credit: Cash/Bank
   */
  async recordRefund({ amount, donorName, eventName, originalReceipt, sourceId }, options) {
    return await ledgerService.postEntry('refund', {
      amount,
      donorName,
      eventName,
      originalReceipt,
      sourceId,
    }, options);
  },

  /**
   * Record an expense — posts journal entry for expense.
   * 
   * Journal:
   *   Debit:  Expense Category
   *   Credit: Cash/Bank
   */
  async recordExpense({ amount, category, eventName, vendorName, notes, sourceId }, options) {
    return await ledgerService.postEntry('expense', {
      amount,
      category,
      eventName,
      vendorName,
      notes,
      sourceId,
    }, options);
  },

  /**
   * Record a settlement — posts journal entry for settlement between members.
   * 
   * Journal:
   *   Debit:  Outstanding Settlements
   *   Credit: Cash
   */
  async recordSettlement({ amount, fromName, toName, groupName, sourceId }, options) {
    return await ledgerService.postEntry('settlement', {
      amount,
      fromName,
      toName,
      groupName,
      sourceId,
    }, options);
  },

  /**
   * Record a cash-to-bank transfer.
   * 
   * Journal:
   *   Debit:  Bank
   *   Credit: Cash
   */
  async recordTransfer({ amount, fromAccount, toAccount, notes, sourceId }, options) {
    return await ledgerService.postEntry('transfer', {
      amount,
      fromAccount,
      toAccount,
      notes,
      sourceId,
    }, options);
  },

  /**
   * Record an opening balance.
   * 
   * Journal:
   *   Debit:  Cash
   *   Credit: Opening Balance (Equity)
   */
  async recordOpeningBalance({ amount, date, notes, sourceId }, options) {
    return await ledgerService.postEntry('openingBalance', {
      amount,
      date,
      notes,
      sourceId,
    }, options);
  },

  /**
   * Void a posted ledger entry.
   */
  async voidEntry(entryId, userId, reason) {
    return await ledgerService.voidEntry(entryId, userId, reason);
  },

  /**
   * Get trial balance.
   */
  async getTrialBalance(orgId, upToDate) {
    return await ledgerService.getTrialBalance(orgId, upToDate);
  },

  /**
   * Get cash book.
   */
  async getCashBook(orgId, startDate, endDate) {
    return await ledgerService.getCashBook(orgId, startDate, endDate);
  },

  /**
   * Get event financial summary from ledger.
   */
  async getEventSummary(eventId) {
    return await ledgerService.getEventSummary(eventId);
  },
};

export default accounting;
