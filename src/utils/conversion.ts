export type PlanId = 'esencial' | 'corporativo';

export interface PlanSpec {
  id: PlanId;
  name: string;
  priceMxn: number;
  priceFormatted: string;
  tagline: string;
  recommendedFor: string;
  badgeText: string | null;
  features: string[];
}

export const WHATSAPP_E164 = '525535660861';
export const WHATSAPP_DISPLAY = '55 3566 0861';

export const PLANS: Record<PlanId, PlanSpec> = {
  esencial: {
    id: 'esencial',
    name: 'Plan Esencial',
    priceMxn: 2690,
    priceFormatted: '$2,690',
    tagline: 'Para PyMEs, despachos y profesionistas que exigen facturar sin límites.',
    recommendedFor: '1 RFC emisor · Hasta 2 usuarios',
    badgeText: null,
    features: [
      'Timbrado CFDI 4.0 ilimitado sin costo por folio',
      '1 RFC emisor con series y sucursales configurables',
      'Facturas, notas de crédito y complementos de pago',
      'Instalación remota y puesta en marcha gratuita',
      'Actualizaciones fiscales ante el SAT incluidas',
      'Soporte técnico directo por WhatsApp',
    ],
  },
  corporativo: {
    id: 'corporativo',
    name: 'Plan Corporativo',
    priceMxn: 3990,
    priceFormatted: '$3,990',
    tagline: 'Para empresas con alto volumen, múltiples razones sociales o equipos completos.',
    recommendedFor: 'Multi-RFC · Usuarios ilimitados',
    badgeText: 'Más elegido por empresas',
    features: [
      'Todo lo del Plan Esencial con timbrado ilimitado',
      'Múltiples RFC emisores y múltiples sucursales',
      'Usuarios concurrentes ilimitados con roles de acceso',
      'Carta Porte 3.1, nómina y addendas comerciales',
      'Migración asistida de catálogos de clientes y productos',
      'Instalación prioritaria el mismo día y soporte VIP',
    ],
  },
};

export interface SavingsCalculation {
  monthlyInvoices: number;
  annualInvoices: number;
  currentAnnualCost: number;
  planId: PlanId;
  planCost: number;
  annualSavings: number;
  paybackMonths: number;
  recommendedPlan: PlanId;
}

export function calculateFolioSavings(
  monthlyInvoices: number,
  costPerFolioMxn: number,
  selectedPlanId: PlanId = 'esencial'
): SavingsCalculation {
  const safeMonthly = Math.max(0, Math.round(monthlyInvoices));
  const safeFolioCost = Math.max(0, Number.isFinite(costPerFolioMxn) ? costPerFolioMxn : 0);
  const annualInvoices = safeMonthly * 12;
  const currentAnnualCost = Math.round(annualInvoices * safeFolioCost);
  const planCost = PLANS[selectedPlanId].priceMxn;
  const annualSavings = currentAnnualCost - planCost;
  const monthlySpend = safeMonthly * safeFolioCost;
  const paybackMonths =
    monthlySpend > 0 ? Number((planCost / monthlySpend).toFixed(1)) : 0;
  const recommendedPlan: PlanId = safeMonthly >= 400 ? 'corporativo' : 'esencial';

  return {
    monthlyInvoices: safeMonthly,
    annualInvoices,
    currentAnnualCost,
    planId: selectedPlanId,
    planCost,
    annualSavings,
    paybackMonths,
    recommendedPlan,
  };
}

export function formatMxn(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(Math.round(amount));
  return `${sign}$${abs.toLocaleString('en-US')}`;
}

export interface WhatsAppLinkParams {
  planId?: PlanId;
  companyName?: string;
  monthlyInvoices?: number;
  source?: string;
}

export function buildWhatsAppUrl(params: WhatsAppLinkParams = {}): string {
  const { planId, companyName, monthlyInvoices, source } = params;
  const lines: string[] = ['Hola equipo SystemKW, quiero activar mi sistema de facturación CFDI 4.0 ilimitada.'];

  if (planId && PLANS[planId]) {
    const plan = PLANS[planId];
    lines.push(`Me interesa el ${plan.name} (${plan.priceFormatted} MXN) con instalación gratuita.`);
  } else {
    lines.push('Quiero información y demostración rápida de los planes con timbrado ilimitado.');
  }

  if (companyName && companyName.trim().length > 0) {
    lines.push(`Empresa / Giro: ${companyName.trim()}`);
  }

  if (typeof monthlyInvoices === 'number' && monthlyInvoices > 0) {
    lines.push(`Volumen aproximado: ${monthlyInvoices.toLocaleString('en-US')} facturas al mes.`);
  }

  if (source && source.trim().length > 0) {
    lines.push(`(Referencia: ${source.trim()})`);
  }

  const encoded = encodeURIComponent(lines.join(' '));
  return `https://wa.me/${WHATSAPP_E164}?text=${encoded}`;
}

export interface LeadFormInput {
  companyName: string;
  contactValue: string;
  monthlyInvoices: string;
}

export interface LeadValidationResult {
  valid: boolean;
  errors: {
    companyName?: string;
    contactValue?: string;
    monthlyInvoices?: string;
  };
}

export function validateLeadForm(input: LeadFormInput): LeadValidationResult {
  const errors: LeadValidationResult['errors'] = {};

  if (!input.companyName || input.companyName.trim().length < 2) {
    errors.companyName = 'Ingresa el nombre de tu empresa o razón social.';
  }

  const trimmedContact = (input.contactValue || '').trim();
  const digitsOnly = trimmedContact.replace(/\D/g, '');
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
  const isPhone = digitsOnly.length >= 10 && digitsOnly.length <= 13;

  if (!trimmedContact) {
    errors.contactValue = 'Ingresa tu WhatsApp a 10 dígitos o correo corporativo.';
  } else if (!isEmail && !isPhone) {
    errors.contactValue = 'Debe ser un número de 10 dígitos (ej. 55 1234 5678) o un correo válido.';
  }

  if (input.monthlyInvoices.trim().length > 0) {
    const parsed = Number(input.monthlyInvoices);
    if (!Number.isFinite(parsed) || parsed < 1) {
      errors.monthlyInvoices = 'Indica un número válido de facturas al mes.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
