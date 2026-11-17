export type AnalyticsEventName =
  | 'whatsapp_cta_click'
  | 'open_whatsapp_drawer'
  | 'whatsapp_drawer_submit'
  | 'calculator_preset_click'
  | 'calculator_plan_change'
  | 'd3_comparison_interact'
  | 'faq_toggle'
  | 'copy_whatsapp_number'
  | 'copy_whatsapp_message';

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const VALID_GA_ID_PATTERN = /^(G|AW|GT)-[A-Z0-9]{6,14}$/;
const PLACEHOLDER_IDS = new Set(['G-XXXXXXXXXX', 'G-0000000000', 'G-YOUR_GA_ID']);

export function resolveMeasurementId(rawId?: string | null): string | null {
  if (!rawId) {
    return null;
  }
  const normalized = rawId.trim().toUpperCase();
  if (!normalized || PLACEHOLDER_IDS.has(normalized)) {
    return null;
  }
  return VALID_GA_ID_PATTERN.test(normalized) ? normalized : null;
}

export function buildGtagScriptUrl(measurementId: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
}

let initializedMeasurementId: string | null = null;

function ensureGtagQueue(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

export function resetAnalyticsForTests(): void {
  initializedMeasurementId = null;
}

export function initGoogleAnalytics(explicitMeasurementId?: string | null): {
  enabled: boolean;
  measurementId: string | null;
} {
  if (typeof window === 'undefined') {
    return { enabled: false, measurementId: null };
  }

  ensureGtagQueue();

  const envId =
    explicitMeasurementId !== undefined
      ? explicitMeasurementId
      : (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
          ?.VITE_GA_MEASUREMENT_ID;

  const measurementId = resolveMeasurementId(envId);

  if (!measurementId) {
    return { enabled: false, measurementId: null };
  }

  if (initializedMeasurementId === measurementId) {
    return { enabled: true, measurementId };
  }

  if (typeof document !== 'undefined') {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-ga-measurement-id="${measurementId}"]`
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = buildGtagScriptUrl(measurementId);
      script.dataset.gaMeasurementId = measurementId;
      document.head.appendChild(script);
    }
  }

  initializedMeasurementId = measurementId;
  window.gtag?.('js', new Date());
  window.gtag?.('config', measurementId, { send_page_view: true });

  return { enabled: true, measurementId };
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params?: AnalyticsEventParams
): void {
  if (typeof window === 'undefined') {
    return;
  }
  ensureGtagQueue();

  const cleanParams: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        cleanParams[key] = value;
      }
    }
  }

  window.gtag?.('event', eventName, cleanParams);
}
