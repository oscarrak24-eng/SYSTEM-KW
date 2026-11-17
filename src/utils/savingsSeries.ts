import { PLANS, PlanId } from './conversion';

export interface MonthlyComparisonPoint {
  month: number;
  label: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  monthlyInvoices: number;
  cumulativeInvoices: number;
  traditionalMonthlyCost: number;
  traditionalCumulative: number;
  systemKwCumulative: number;
  cumulativeSavings: number;
  effectiveCostPerCfdi: number;
  isBreakEvenMonth: boolean;
}

export interface ComparisonSeriesResult {
  points: MonthlyComparisonPoint[];
  monthlyInvoices: number;
  costPerFolioMxn: number;
  planId: PlanId;
  planName: string;
  totalTraditionalAnnual: number;
  totalSystemKwAnnual: number;
  netAnnualSavings: number;
  breakEvenMonthExact: number | null;
  breakEvenMonthWhole: number | null;
  roiPercent: number;
  effectiveAnnualCostPerCfdi: number;
  recommendedPlan: PlanId;
}

const MONTH_NAMES_ES = [
  'Mes 1',
  'Mes 2',
  'Mes 3',
  'Mes 4',
  'Mes 5',
  'Mes 6',
  'Mes 7',
  'Mes 8',
  'Mes 9',
  'Mes 10',
  'Mes 11',
  'Mes 12',
];

function getQuarterForMonth(month: number): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
}

export function generateMonthlyComparisonSeries(params: {
  monthlyInvoices: number;
  costPerFolioMxn: number;
  planId: PlanId;
  horizonMonths?: number;
}): ComparisonSeriesResult {
  const safeMonthly = Math.max(0, Math.round(params.monthlyInvoices));
  const safeFolioCost = Math.max(
    0,
    Number.isFinite(params.costPerFolioMxn) ? params.costPerFolioMxn : 0
  );
  const horizonMonths = Math.max(1, Math.min(24, Math.round(params.horizonMonths ?? 12)));
  const plan = PLANS[params.planId];
  const monthlyTraditional = safeMonthly * safeFolioCost;

  let breakEvenWhole: number | null = null;
  const breakEvenExact =
    monthlyTraditional > 0
      ? Number((plan.priceMxn / monthlyTraditional).toFixed(1))
      : null;

  const points: MonthlyComparisonPoint[] = [];

  for (let month = 1; month <= horizonMonths; month += 1) {
    const traditionalCumulative = Math.round(monthlyTraditional * month);
    const systemKwCumulative = plan.priceMxn * Math.ceil(month / 12);
    const cumulativeSavings = traditionalCumulative - systemKwCumulative;
    const cumulativeInvoices = safeMonthly * month;
    const effectiveCostPerCfdi =
      cumulativeInvoices > 0
        ? Number((systemKwCumulative / cumulativeInvoices).toFixed(2))
        : 0;

    let isBreakEvenMonth = false;
    if (breakEvenWhole === null && traditionalCumulative >= systemKwCumulative && monthlyTraditional > 0) {
      breakEvenWhole = month;
      isBreakEvenMonth = true;
    }

    points.push({
      month,
      label: MONTH_NAMES_ES[month - 1] ?? `Mes ${month}`,
      quarter: getQuarterForMonth(((month - 1) % 12) + 1),
      monthlyInvoices: safeMonthly,
      cumulativeInvoices,
      traditionalMonthlyCost: Math.round(monthlyTraditional),
      traditionalCumulative,
      systemKwCumulative,
      cumulativeSavings,
      effectiveCostPerCfdi,
      isBreakEvenMonth,
    });
  }

  const lastPoint = points[points.length - 1];
  const totalTraditionalAnnual = lastPoint?.traditionalCumulative ?? 0;
  const totalSystemKwAnnual = lastPoint?.systemKwCumulative ?? plan.priceMxn;
  const netAnnualSavings = totalTraditionalAnnual - totalSystemKwAnnual;
  const roiPercent =
    totalSystemKwAnnual > 0
      ? Math.round((netAnnualSavings / totalSystemKwAnnual) * 100)
      : 0;
  const effectiveAnnualCostPerCfdi = lastPoint?.effectiveCostPerCfdi ?? 0;
  const recommendedPlan: PlanId = safeMonthly >= 400 ? 'corporativo' : 'esencial';

  return {
    points,
    monthlyInvoices: safeMonthly,
    costPerFolioMxn: safeFolioCost,
    planId: params.planId,
    planName: plan.name,
    totalTraditionalAnnual,
    totalSystemKwAnnual,
    netAnnualSavings,
    breakEvenMonthExact: breakEvenExact,
    breakEvenMonthWhole: breakEvenWhole,
    roiPercent,
    effectiveAnnualCostPerCfdi,
    recommendedPlan,
  };
}
