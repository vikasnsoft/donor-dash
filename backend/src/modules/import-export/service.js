/**
 * Import/Export Service
 * 
 * Handles CSV import for donors, donations, and expenses.
 * Handles CSV export for reports and data backup.
 */

import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Parse CSV buffer into array of objects.
 */
export const parseCsv = (buffer, options = {}) => {
  const content = buffer.toString('utf-8');
  return parse(content, {
    columns: true, // Use first row as headers
    skip_empty_lines: true,
    trim: true,
    ...options,
  });
};

/**
 * Convert array of objects to CSV string.
 */
export const toCsv = (data, columns) => {
  return stringify(data, {
    header: true,
    columns,
  });
};

/**
 * Map CSV row to donor data.
 */
export const mapDonorRow = (row) => ({
  name: row.name || row.Name || row['Donor Name'] || '',
  phone: row.phone || row.Phone || row['Phone Number'] || null,
  email: row.email || row.Email || null,
  type: row.type || row.Type || 'individual',
  address: {
    line1: row.address || row.Address || '',
    city: row.city || row.City || '',
    state: row.state || row.State || '',
    pincode: row.pincode || row.Pincode || row['PIN Code'] || '',
  },
  tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
  notes: row.notes || row.Notes || '',
});

/**
 * Map CSV row to donation data.
 */
export const mapDonationRow = (row) => ({
  donorName: row.donor || row['Donor Name'] || row.name || '',
  donorPhone: row.phone || row.Phone || null,
  amount: parseFloat(row.amount || row.Amount || '0'),
  method: (row.method || row.Method || row['Payment Method'] || 'cash').toLowerCase(),
  reference: row.reference || row.Reference || row['Transaction ID'] || '',
  date: row.date || row.Date || new Date().toISOString(),
  notes: row.notes || row.Notes || '',
});

/**
 * Export donors to CSV format.
 */
export const exportDonors = (donors) => {
  const columns = [
    'name', 'type', 'phone', 'email',
    'city', 'state', 'pincode',
    'totalDonated', 'donationCount', 'lastDonationDate',
    'tags', 'notes',
  ];

  const data = donors.map(d => ({
    name: d.name,
    type: d.type,
    phone: d.phone || '',
    email: d.email || '',
    city: d.address?.city || '',
    state: d.address?.state || '',
    pincode: d.address?.pincode || '',
    totalDonated: d.stats?.totalDonated ? parseFloat(d.stats.totalDonated.toString()) : 0,
    donationCount: d.stats?.donationCount || 0,
    lastDonationDate: d.stats?.lastDonationDate ? new Date(d.stats.lastDonationDate).toISOString().split('T')[0] : '',
    tags: (d.tags || []).join(', '),
    notes: d.notes || '',
  }));

  return toCsv(data, columns);
};

/**
 * Export donations to CSV format.
 */
export const exportDonations = (donations) => {
  const columns = [
    'receiptNumber', 'donorName', 'amount', 'method', 'reference',
    'status', 'date', 'eventName', 'campaignName', 'collectedBy', 'notes',
  ];

  const data = donations.map(d => ({
    receiptNumber: d.receiptNumber || '',
    donorName: d.donor?.name || '',
    amount: parseFloat(d.amount?.toString() || '0'),
    method: d.method || '',
    reference: d.reference || '',
    status: d.status || '',
    date: d.date ? new Date(d.date).toISOString().split('T')[0] : '',
    eventName: d.event?.name || '',
    campaignName: d.campaign?.name || '',
    collectedBy: d.collectedBy?.name || '',
    notes: d.notes || '',
  }));

  return toCsv(data, columns);
};

/**
 * Export expenses to CSV format.
 */
export const exportExpenses = (expenses) => {
  const columns = [
    'description', 'amount', 'paidBy', 'category', 'splitType',
    'date', 'groupName', 'notes',
  ];

  const data = expenses.map(e => ({
    description: e.description || '',
    amount: parseFloat(e.amount?.toString() || '0'),
    paidBy: e.paidBy?.name || '',
    category: e.category || '',
    splitType: e.splitType || '',
    date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
    groupName: e.group?.name || '',
    notes: e.notes || '',
  }));

  return toCsv(data, columns);
};

/**
 * Export ledger entries to CSV format.
 */
export const exportLedgerEntries = (entries) => {
  const columns = [
    'entryNumber', 'date', 'description', 'sourceType', 'status',
    'debitAccount', 'debitAmount', 'creditAccount', 'creditAmount',
  ];

  const data = entries.flatMap(e => {
    const debitLine = e.lines?.find(l => l.type === 'debit');
    const creditLine = e.lines?.find(l => l.type === 'credit');

    return [{
      entryNumber: e.entryNumber || '',
      date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
      description: e.description || '',
      sourceType: e.sourceType || '',
      status: e.status || '',
      debitAccount: debitLine?.account?.name || '',
      debitAmount: debitLine ? parseFloat(debitLine.amount.toString()) : 0,
      creditAccount: creditLine?.account?.name || '',
      creditAmount: creditLine ? parseFloat(creditLine.amount.toString()) : 0,
    }];
  });

  return toCsv(data, columns);
};
