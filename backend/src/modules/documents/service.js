/**
 * Document Generation Service
 * 
 * Generates receipts, vouchers, and reports.
 * Uses HTML templates that can be rendered as PDF (via Puppeteer) or printed directly.
 * 
 * Phase 2.4: HTML templates
 * Future: PDF generation with Puppeteer or pdfkit
 */

import { organisationRepo } from '../organisations/repository.js';

/**
 * Generate a donation receipt HTML.
 */
export const generateDonationReceipt = async (donation, donor, event, organisation) => {
  const org = organisation || {};
  const branding = org.branding || {};
  const receiptSettings = org.receipt || {};

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Donation Receipt — ${donation.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; }
    .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .header { background: ${branding.primaryColor || '#f97316'}; color: white; padding: 24px; text-align: center; }
    .header h1 { font-size: 24px; margin-bottom: 4px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .body { padding: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .row:last-child { border-bottom: none; }
    .label { color: #666; font-size: 14px; }
    .value { font-weight: 600; font-size: 14px; }
    .amount { font-size: 28px; font-weight: 700; color: ${branding.primaryColor || '#f97316'}; text-align: center; padding: 20px 0; }
    .footer { background: #f9f9f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #999; }
    .receipt-number { font-size: 12px; color: #999; text-align: center; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${org.name || 'Donor Dash'}</h1>
      <p>Donation Receipt</p>
    </div>
    <div class="body">
      <div class="receipt-number">${donation.receiptNumber || ''}</div>
      <div class="amount">₹${parseFloat(donation.amount?.toString() || '0').toLocaleString('en-IN')}</div>
      <div class="row">
        <span class="label">Donor</span>
        <span class="value">${donor?.name || 'Anonymous'}</span>
      </div>
      <div class="row">
        <span class="label">Event</span>
        <span class="value">${event?.name || '—'}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${new Date(donation.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
      <div class="row">
        <span class="label">Payment Method</span>
        <span class="value">${(donation.method || '').toUpperCase()}</span>
      </div>
      ${donation.reference ? `<div class="row">
        <span class="label">Reference</span>
        <span class="value">${donation.reference}</span>
      </div>` : ''}
      ${donor?.phone ? `<div class="row">
        <span class="label">Phone</span>
        <span class="value">${donor.phone}</span>
      </div>` : ''}
    </div>
    <div class="footer">
      <p>${receiptSettings.footer || 'Thank you for your generous contribution!'}</p>
      ${org.phone ? `<p>Contact: ${org.phone}</p>` : ''}
      ${org.email ? `<p>Email: ${org.email}</p>` : ''}
    </div>
  </div>
</body>
</html>`;

  return html;
};

/**
 * Generate a settlement confirmation HTML.
 */
export const generateSettlementConfirmation = async (settlement, paidBy, paidTo, group) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Settlement Confirmation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; }
    .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .header { background: #059669; color: white; padding: 24px; text-align: center; }
    .body { padding: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .label { color: #666; font-size: 14px; }
    .value { font-weight: 600; font-size: 14px; }
    .amount { font-size: 28px; font-weight: 700; color: #059669; text-align: center; padding: 20px 0; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Settlement Confirmation</h1>
      <p>${group?.name || ''}</p>
    </div>
    <div class="body">
      <div class="amount">₹${parseFloat(settlement.amount?.toString() || '0').toLocaleString('en-IN')}</div>
      <div class="row">
        <span class="label">Paid By</span>
        <span class="value">${paidBy?.name || '—'}</span>
      </div>
      <div class="row">
        <span class="label">Paid To</span>
        <span class="value">${paidTo?.name || '—'}</span>
      </div>
      <div class="row">
        <span class="label">Method</span>
        <span class="value">${(settlement.method || 'cash').toUpperCase()}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${new Date(settlement.createdAt).toLocaleDateString('en-IN')}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="value">${settlement.status.toUpperCase()}</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
};

/**
 * Generate expense voucher HTML.
 */
export const generateExpenseVoucher = async (expense, paidBy, group) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Expense Voucher</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; }
    .voucher { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .header { background: #dc2626; color: white; padding: 24px; text-align: center; }
    .body { padding: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .label { color: #666; font-size: 14px; }
    .value { font-weight: 600; font-size: 14px; }
    .amount { font-size: 28px; font-weight: 700; color: #dc2626; text-align: center; padding: 20px 0; }
    .splits { margin-top: 16px; }
    .splits h3 { font-size: 14px; color: #666; margin-bottom: 8px; }
    .split-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="voucher">
    <div class="header">
      <h1>Expense Voucher</h1>
      <p>${group?.name || ''}</p>
    </div>
    <div class="body">
      <div class="amount">₹${parseFloat(expense.amount?.toString() || '0').toLocaleString('en-IN')}</div>
      <div class="row">
        <span class="label">Description</span>
        <span class="value">${expense.description}</span>
      </div>
      <div class="row">
        <span class="label">Paid By</span>
        <span class="value">${paidBy?.name || '—'}</span>
      </div>
      <div class="row">
        <span class="label">Category</span>
        <span class="value">${expense.category || 'General'}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${new Date(expense.date).toLocaleDateString('en-IN')}</span>
      </div>
      <div class="row">
        <span class="label">Split Type</span>
        <span class="value">${expense.splitType || 'equal'}</span>
      </div>
      ${expense.splits?.length ? `
      <div class="splits">
        <h3>Split Details</h3>
        ${expense.splits.map(s => `
          <div class="split-row">
            <span>${s.user?.name || 'User'}</span>
            <span>₹${parseFloat(s.amount?.toString() || '0').toLocaleString('en-IN')}</span>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  </div>
</body>
</html>`;

  return html;
};
