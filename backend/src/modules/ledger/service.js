import mongoose from 'mongoose';
import { ledgerRepo, accountRepo } from './repository.js';
import * as journalBuilder from './journalBuilder.js';
import { emit } from '../shared/eventBus.js';
import { FinancialError, NotFoundError } from '../../utils/errors.js';
import logger from '../../utils/logger.js';

/**
 * Ledger Application Service
 * 
 * Coordinates the workflow of posting journal entries.
 * Uses Journal Builder for business logic.
 * Uses Repository for data access.
 * Publishes domain events AFTER commit.
 */

/**
 * Post a journal entry from a business event.
 * This is the main entry point for all financial operations.
 * 
 * @param {string} entryType - Type of entry (donation, expense, etc.)
 * @param {object} data - Business data for the entry
 * @param {object} options - { session, userId, orgId, eventId }
 */
export const postEntry = async (entryType, data, options) => {
  const { session, userId, orgId, eventId } = options;

  // 1. Build the journal entry using pure business logic
  const entrySpec = journalBuilder[`${entryType}Entry`](data);
  if (!entrySpec) {
    throw new FinancialError(`Unknown entry type: ${entryType}`, 'journal.unknown_type');
  }

  // 2. Resolve account keys to actual account IDs
  const [debitAccount, creditAccount] = await Promise.all([
    accountRepo.findByCode(getAccountCode(entrySpec.debitAccountKey), orgId),
    accountRepo.findByCode(getAccountCode(entrySpec.creditAccountKey), orgId),
  ]);

  if (!debitAccount) {
    throw new FinancialError(`Account not found: ${entrySpec.debitAccountKey}`, 'journal.account_missing');
  }
  if (!creditAccount) {
    throw new FinancialError(`Account not found: ${entrySpec.creditAccountKey}`, 'journal.account_missing');
  }

  // 3. Build journal lines
  const lines = [
    {
      account: debitAccount._id,
      type: 'debit',
      amount: mongoose.Types.Decimal128.fromString(String(entrySpec.amount)),
      description: entrySpec.lineDescriptions.debit,
    },
    {
      account: creditAccount._id,
      type: 'credit',
      amount: mongoose.Types.Decimal128.fromString(String(entrySpec.amount)),
      description: entrySpec.lineDescriptions.credit,
    },
  ];

  // 4. Validate balance (safety check)
  const balanceCheck = journalBuilder.validateBalance(lines);
  if (!balanceCheck.balanced) {
    throw new FinancialError(
      `Journal entry not balanced: debits=${balanceCheck.debits}, credits=${balanceCheck.credits}`,
      'journal.unbalanced'
    );
  }

  // 5. Get next entry number
  const entryNumber = await ledgerRepo.getNextEntryNumber(orgId);

  // 6. Create the ledger entry within the provided session
  const entry = await ledgerRepo.create({
    entryNumber,
    date: entrySpec.date || new Date(),
    description: entrySpec.description,
    organisation: orgId,
    event: eventId || null,
    sourceType: entryType === 'openingBalance' ? 'opening_balance' : entryType,
    sourceId: data.sourceId || null,
    lines,
    status: 'posted',
    createdBy: userId,
  }, { session });

  // 7. Update account cached balances
  await Promise.all([
    accountRepo.updateBalance(debitAccount._id, entrySpec.amount, 'debit', session),
    accountRepo.updateBalance(creditAccount._id, entrySpec.amount, 'credit', session),
  ]);

  logger.info({
    entryNumber: entry.entryNumber,
    entryType,
    amount: entrySpec.amount,
    orgId,
    eventId,
  }, 'Journal entry posted');

  return entry;
};

/**
 * Void a posted entry by creating a reverse entry.
 * Original entry is marked as void. Both entries remain in the ledger.
 */
export const voidEntry = async (entryId, userId, reason) => {
  const original = await ledgerRepo.findById(entryId);
  if (!original) throw new NotFoundError('Ledger Entry', entryId);
  if (original.status !== 'posted') {
    throw new FinancialError(`Cannot void entry with status '${original.status}'`, 'journal.void_status');
  }
  if (original.voidOf) {
    throw new FinancialError('Entry is already a reversal', 'journal.already_reversal');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create reverse entry (swap debits and credits)
    const entryNumber = await ledgerRepo.getNextEntryNumber(original.organisation);
    const reverseLines = original.lines.map(line => ({
      account: line.account,
      type: line.type === 'debit' ? 'credit' : 'debit',
      amount: line.amount,
      description: `Reversal: ${line.description}`,
    }));

    const reverseEntry = await ledgerRepo.create({
      entryNumber,
      date: new Date(),
      description: `VOID of ${original.entryNumber}: ${reason || 'No reason provided'}`,
      organisation: original.organisation,
      event: original.event,
      sourceType: 'adjustment',
      sourceId: original._id,
      lines: reverseLines,
      status: 'posted',
      voidOf: original._id,
      createdBy: userId,
    }, { session });

    // Mark original as void
    await ledgerRepo.updateById(entryId, {
      status: 'void',
      verifiedBy: userId,
    }, { session });

    // Update account balances (reverse the original)
    for (const line of original.lines) {
      await accountRepo.updateBalance(
        line.account,
        parseFloat(line.amount.toString()),
        line.type === 'debit' ? 'credit' : 'debit', // Reverse
        session
      );
    }

    await session.commitTransaction();

    await emit('ledger.entry.voided', {
      entryId,
      reverseEntryId: reverseEntry._id,
      orgId: original.organisation,
      reason,
      voidedBy: userId,
    });

    return reverseEntry;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Get trial balance for an organisation.
 */
export const getTrialBalance = async (orgId, upToDate) => {
  const entries = await ledgerRepo.getTrialBalance(orgId, upToDate);

  let totalDebits = 0;
  let totalCredits = 0;

  const formatted = entries.map(e => {
    totalDebits += e.debits;
    totalCredits += e.credits;
    return {
      account: { _id: e.accountId, name: e.accountName, code: e.accountCode, type: e.accountType },
      debits: Math.round(e.debits * 100) / 100,
      credits: Math.round(e.credits * 100) / 100,
      balance: Math.round(e.balance * 100) / 100,
    };
  });

  return {
    entries: formatted,
    totalDebits: Math.round(totalDebits * 100) / 100,
    totalCredits: Math.round(totalCredits * 100) / 100,
    balanced: Math.abs(totalDebits - totalCredits) < 0.01,
  };
};

/**
 * Get cash book for a period.
 */
export const getCashBook = async (orgId, startDate, endDate) => {
  return await ledgerRepo.getCashBook(orgId, startDate, endDate);
};

/**
 * Get event financial summary from ledger.
 */
export const getEventSummary = async (eventId) => {
  return await ledgerRepo.getEventSummary(eventId);
};

/**
 * Get all ledger entries with filters.
 */
export const getEntries = async (orgId, query) => {
  const filters = {};
  if (query.sourceType) filters.sourceType = query.sourceType;
  if (query.status) filters.status = query.status;
  if (query.event) filters.event = query.event;
  if (query.from || query.to) {
    filters.date = {};
    if (query.from) filters.date.$gte = new Date(query.from);
    if (query.to) filters.date.$lte = new Date(query.to);
  }

  return await ledgerRepo.findByOrganisation(orgId, filters, {
    page: query.page,
    limit: query.limit,
  });
};

/**
 * Get entry by ID.
 */
export const getEntryById = async (entryId) => {
  const entry = await ledgerRepo.findById(entryId, {
    populate: [
      { path: 'lines.account', select: 'name code type' },
      { path: 'createdBy', select: 'name' },
      { path: 'verifiedBy', select: 'name' },
      { path: 'voidOf', select: 'entryNumber' },
    ],
  });
  if (!entry) throw new NotFoundError('Ledger Entry', entryId);
  return entry;
};

// Account code mapping
function getAccountCode(key) {
  const map = {
    cash: '1000',
    bank: '1010',
    upi_wallet: '1020',
    receivables: '1030',
    inventory: '1040',
    payables: '2000',
    outstanding_settlements: '2010',
    donation_income: '3000',
    collection_income: '3010',
    other_income: '3020',
    decoration_expense: '4000',
    venue_expense: '4010',
    sound_lighting_expense: '4020',
    prasad_expense: '4030',
    committee_expense: '4040',
    volunteer_expense: '4050',
    misc_expense: '4060',
    opening_balance: '5000',
    retained_earnings: '5010',
  };
  return map[key] || key;
}
