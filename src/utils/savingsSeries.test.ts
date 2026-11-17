import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMonthlyComparisonSeries } from './savingsSeries';

test('generateMonthlyComparisonSeries generates 12 months with exact cumulative totals and break-even', () => {
  const result = generateMonthlyComparisonSeries({
    monthlyInvoices: 250,
    costPerFolioMxn: 3.5,
    planId: 'esencial',
  });

  assert.equal(result.points.length, 12);
  // 250 * 3.5 = 875 MXN/mes -> 10,500 MXN/año vs $2,690 SystemKW Esencial -> $7,810 ahorro
  assert.equal(result.totalTraditionalAnnual, 10500);
  assert.equal(result.totalSystemKwAnnual, 2690);
  assert.equal(result.netAnnualSavings, 7810);
  // Break-even: 2690 / 875 = 3.07 -> whole month 4 (4*875 = 3500 >= 2690)
  assert.equal(result.breakEvenMonthWhole, 4);
  assert.equal(result.breakEvenMonthExact, 3.1);
  assert.equal(result.points[3].isBreakEvenMonth, true);
  assert.equal(result.points[11].cumulativeInvoices, 3000);
  assert.equal(result.effectiveAnnualCostPerCfdi, 0.9);
  assert.equal(result.recommendedPlan, 'esencial');
});

test('generateMonthlyComparisonSeries switches recommendation to Corporativo at >= 400 invoices/month', () => {
  const result = generateMonthlyComparisonSeries({
    monthlyInvoices: 600,
    costPerFolioMxn: 4.0,
    planId: 'corporativo',
  });

  // 600 * 4 * 12 = 28,800 vs 3,990 = 24,810 net savings
  assert.equal(result.totalTraditionalAnnual, 28800);
  assert.equal(result.totalSystemKwAnnual, 3990);
  assert.equal(result.netAnnualSavings, 24810);
  assert.equal(result.breakEvenMonthWhole, 2);
  assert.equal(result.recommendedPlan, 'corporativo');
  assert.equal(result.roiPercent, Math.round((24810 / 3990) * 100));
});

test('generateMonthlyComparisonSeries handles zero volume safely without NaN', () => {
  const result = generateMonthlyComparisonSeries({
    monthlyInvoices: 0,
    costPerFolioMxn: 3.5,
    planId: 'esencial',
  });

  assert.equal(result.totalTraditionalAnnual, 0);
  assert.equal(result.netAnnualSavings, -2690);
  assert.equal(result.breakEvenMonthWhole, null);
  assert.equal(result.breakEvenMonthExact, null);
  assert.equal(result.effectiveAnnualCostPerCfdi, 0);
});
