import asyncHandler from '../../middleware/asyncHandler.js';
import * as csvService from './service.js';
import donorRepo from '../donors/repository.js';
import donationRepo from '../donations/repository.js';
import { expenseRepo } from '../expenses/repository.js';
import { ledgerRepo } from '../ledger/repository.js';
import donorService from '../donors/service.js';
import * as donationService from '../donations/service.js';

/**
 * Import donors from CSV.
 */
const importDonors = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'CSV file is required' } });

  const rows = csvService.parseCsv(req.file.buffer);
  const results = { total: rows.length, created: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    try {
      const data = csvService.mapDonorRow(rows[i]);
      if (!data.name) {
        results.errors.push({ row: i + 1, error: 'Name is required' });
        continue;
      }
      await donorService.create(data, req.params.orgId, req.user._id);
      results.created++;
    } catch (err) {
      results.errors.push({ row: i + 1, error: err.message });
    }
  }

  res.json({ success: true, data: results });
});

/**
 * Export donors to CSV.
 */
const exportDonors = asyncHandler(async (req, res) => {
  const result = await donorRepo.findByOrganisation(req.params.orgId, {}, { limit: 10000 });
  const csv = csvService.exportDonors(result.data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="donors-${req.params.orgId}.csv"`);
  res.send(csv);
});

/**
 * Export donations to CSV.
 */
const exportDonations = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.eventId) {
    const result = await donationRepo.findByEvent(req.query.eventId, {}, { limit: 10000 });
    const csv = csvService.exportDonations(result.data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="donations.csv"`);
    return res.send(csv);
  }

  const result = await donationRepo.findByOrganisation(req.params.orgId, {}, { limit: 10000 });
  const csv = csvService.exportDonations(result.data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="donations-${req.params.orgId}.csv"`);
  res.send(csv);
});

/**
 * Export ledger entries to CSV.
 */
const exportLedger = asyncHandler(async (req, res) => {
  const result = await ledgerRepo.findByOrganisation(req.params.orgId, {}, { limit: 10000 });
  const csv = csvService.exportLedgerEntries(result.data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="ledger-${req.params.orgId}.csv"`);
  res.send(csv);
});

export { importDonors, exportDonors, exportDonations, exportLedger };
