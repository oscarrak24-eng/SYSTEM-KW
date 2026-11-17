import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PLANS,
  WHATSAPP_E164,
  buildWhatsAppUrl,
  calculateFolioSavings,
  formatMxn,
  validateLeadForm,
} from './conversion';

test('PLANS expose exact required pricing for Esencial ($2,690) and Corporativo ($3,990)', () => {
  assert.equal(PLANS.esencial.priceMxn, 2690);
  assert.equal(PLANS.esencial.priceFormatted, '$2,690');
  assert.equal(PLANS.corporativo.priceMxn, 3990);
  assert.equal(PLANS.corporativo.priceFormatted, '$3,990');
});

test('calculateFolioSavings computes annual savings and payback accurately', () => {
  const result = calculateFolioSavings(200, 3.5, 'esencial');
  // 200 * 12 * 3.5 = 8400; 8400 - 2690 = 5710
  assert.equal(result.annualInvoices, 2400);
  assert.equal(result.currentAnnualCost, 8400);
  assert.equal(result.planCost, 2690);
  assert.equal(result.annualSavings, 5710);
  assert.equal(result.paybackMonths, 3.8);
  assert.equal(result.recommendedPlan, 'esencial');
});

test('calculateFolioSavings recommends Plan Corporativo for high-volume issuers (>= 400/mes)', () => {
  const result = calculateFolioSavings(450, 3, 'corporativo');
  assert.equal(result.recommendedPlan, 'corporativo');
  assert.equal(result.annualSavings, 450 * 12 * 3 - 3990);
});

test('calculateFolioSavings handles zero monthly volume safely', () => {
  const result = calculateFolioSavings(-20, 4, 'esencial');
  assert.equal(result.monthlyInvoices, 0);
  assert.equal(result.currentAnnualCost, 0);
  assert.equal(result.paybackMonths, 0);
});

test('buildWhatsAppUrl targets exact number 525535660861 with encoded plan context', () => {
  const url = buildWhatsAppUrl({
    planId: 'corporativo',
    companyName: 'Aceros del Norte SA',
    monthlyInvoices: 600,
  });
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_E164}?text=`));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.match(decoded, /Plan Corporativo/);
  assert.match(decoded, /\$3,990/);
  assert.match(decoded, /Aceros del Norte SA/);
  assert.match(decoded, /600/);
});

test('formatMxn formats positive and negative currency cleanly', () => {
  assert.equal(formatMxn(5710), '$5,710');
  assert.equal(formatMxn(-450), '-$450');
});

test('validateLeadForm catches missing business name and invalid phone/email', () => {
  const invalid = validateLeadForm({
    companyName: 'A',
    contactValue: '12345',
    monthlyInvoices: '0',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.companyName);
  assert.ok(invalid.errors.contactValue);
  assert.ok(invalid.errors.monthlyInvoices);

  const validPhone = validateLeadForm({
    companyName: 'Distribuidora Azteca',
    contactValue: '55 3566 0861',
    monthlyInvoices: '250',
  });
  assert.equal(validPhone.valid, true);

  const validEmail = validateLeadForm({
    companyName: 'Logística Bajío',
    contactValue: 'ventas@logisticabajio.mx',
    monthlyInvoices: '',
  });
  assert.equal(validEmail.valid, true);
});
