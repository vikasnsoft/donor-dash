import mongoose from 'mongoose';
import { expenseRepo, balanceRepo } from './repository.js';
import groupRepo from '../groups/repository.js';
import accounting from '../shared/accounting.js';
import { emit } from '../shared/eventBus.js';
import { NotFoundError, BusinessRuleError, AuthorizationError } from '../../utils/errors.js';

/**
 * Calculate splits based on split type.
 */
function calculateSplits(totalAmount, splitType, splits, members) {
  const amount = parseFloat(String(totalAmount));
  const memberCount = splits?.length || members.length;

  switch (splitType) {
    case 'equal': {
      const perPerson = Math.floor((amount / memberCount) * 100) / 100;
      const remainder = Math.round((amount - perPerson * memberCount) * 100) / 100;
      return (splits || members.map(m => ({ user: m.user }))).map((s, i) => ({
        user: s.user || s,
        amount: i === memberCount - 1 ? perPerson + remainder : perPerson,
      }));
    }
    case 'exact':
      return splits; // Already provided
    case 'percentage':
      return splits.map(s => ({
        user: s.user,
        amount: Math.round((amount * s.percentage / 100) * 100) / 100,
      }));
    case 'shares': {
      const totalShares = splits.reduce((sum, s) => sum + s.shares, 0);
      return splits.map(s => ({
        user: s.user,
        amount: Math.round((amount * s.shares / totalShares) * 100) / 100,
      }));
    }
    default:
      throw new BusinessRuleError(`Unknown split type: ${splitType}`, 'expense.split_type');
  }
}

export const create = async (data, userId) => {
  const group = await groupRepo.findByIdWithMembers(data.group);
  if (!group) throw new NotFoundError('Group', data.group);
  if (group.isArchived) throw new BusinessRuleError('Cannot add expenses to archived group', 'group.archived');

  // Verify paidBy is a group member
  const isMember = group.members.some(m => m.user._id.toString() === (data.paidBy || userId).toString());
  if (!isMember) throw new AuthorizationError('Payer must be a group member');

  // Calculate splits
  const splits = calculateSplits(data.amount, data.splitType || 'equal', data.splits, group.members);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create expense
    const [expense] = await expenseRepo.create({
      ...data,
      splits,
      paidBy: data.paidBy || userId,
      createdBy: userId,
    }, { session });

    // Update balances: everyone in splits owes their share to paidBy
    const paidById = (data.paidBy || userId).toString();
    for (const split of splits) {
      const splitUserId = split.user.toString();
      if (splitUserId !== paidById) {
        await balanceRepo.updateBetween(
          data.group,
          splitUserId, // from: person who owes
          paidById,     // to: person who paid
          parseFloat(String(split.amount)),
          session
        );
      }
    }

    // Update group total
    await groupRepo.updateById(data.group, {
      $inc: { totalExpenses: mongoose.Types.Decimal128.fromString(String(data.amount)) },
    }, { session });

    // Post ledger entry if organisation is linked
    if (group.organisation) {
      await accounting.recordExpense({
        amount: data.amount,
        category: data.category || 'general',
        eventName: group.name,
        vendorName: data.description,
        notes: data.notes,
        sourceId: expense._id,
      }, { session, userId, orgId: group.organisation, eventId: group.event });
    }

    await session.commitTransaction();

    await emit('expense.created', {
      expenseId: expense._id,
      groupId: data.group,
      amount: data.amount,
      paidBy: paidById,
      splitType: data.splitType || 'equal',
      createdBy: userId,
    });

    return expense;
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

  const filters = {};
  if (query.category) filters.category = query.category;
  if (query.paidBy) filters.paidBy = query.paidBy;

  return await expenseRepo.findByGroup(groupId, filters, {
    page: query.page,
    limit: query.limit,
  });
};

export const getById = async (expenseId, userId) => {
  const expense = await expenseRepo.findById(expenseId, {
    populate: [
      { path: 'paidBy', select: 'name avatar' },
      { path: 'splits.user', select: 'name avatar' },
      { path: 'group', select: 'name' },
    ],
  });
  if (!expense || expense.isDeleted) throw new NotFoundError('Expense', expenseId);
  return expense;
};

export const getGroupBalances = async (groupId, userId) => {
  const isMember = await groupRepo.isMember(groupId, userId);
  if (!isMember) throw new AuthorizationError('Not a member of this group');

  return await balanceRepo.getGroupBalances(groupId);
};

export const getSimplifiedDebts = async (groupId, userId) => {
  const isMember = await groupRepo.isMember(groupId, userId);
  if (!isMember) throw new AuthorizationError('Not a member of this group');

  return await balanceRepo.simplifyDebts(groupId);
};

export const getUserBalanceSummary = async (userId) => {
  return await balanceRepo.getUserSummary(userId);
};
