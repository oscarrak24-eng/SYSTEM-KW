import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGtagScriptUrl,
  initGoogleAnalytics,
  resetAnalyticsForTests,
  resolveMeasurementId,
  trackEvent,
} from './analytics';

test('resolveMeasurementId validates real GA4/GT/AW IDs and rejects placeholders', () => {
  assert.equal(resolveMeasurementId('g-abc123def4'), 'G-ABC123DEF4');
  assert.equal(resolveMeasurementId('  G-9XYZ876543 '), 'G-9XYZ876543');
  assert.equal(resolveMeasurementId('GT-ABCD1234'), 'GT-ABCD1234');
  assert.equal(resolveMeasurementId('G-XXXXXXXXXX'), null);
  assert.equal(resolveMeasurementId(''), null);
  assert.equal(resolveMeasurementId(undefined), null);
  assert.equal(resolveMeasurementId('UA-12345-1'), null);
});

test('buildGtagScriptUrl builds the official googletagmanager script URL', () => {
  assert.equal(
    buildGtagScriptUrl('G-9XYZ876543'),
    'https://www.googletagmanager.com/gtag/js?id=G-9XYZ876543'
  );
});

test('initGoogleAnalytics initializes dataLayer/gtag and injects script idempotently when valid', () => {
  const appended: Array<{ src: string; async: boolean; dataset: Record<string, string> }> = [];
  const globalObj = globalThis as unknown as {
    window?: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    document?: {
      querySelector: (selector: string) => unknown;
      createElement: () => { src: string; async: boolean; dataset: Record<string, string> };
      head: { appendChild: (el: { src: string; async: boolean; dataset: Record<string, string> }) => void };
    };
  };

  const prevWindow = globalObj.window;
  const prevDocument = globalObj.document;

  try {
    resetAnalyticsForTests();
    globalObj.window = {};
    globalObj.document = {
      querySelector: () => null,
      createElement: () => ({ src: '', async: false, dataset: {} }),
      head: {
        appendChild: (el) => {
          appended.push(el);
        },
      },
    };

    // Placeholder ID disables network script injection but readies dataLayer
    const skipped = initGoogleAnalytics('G-XXXXXXXXXX');
    assert.equal(skipped.enabled, false);
    assert.equal(skipped.measurementId, null);
    assert.equal(appended.length, 0);
    assert.equal(typeof globalObj.window.gtag, 'function');

    // Real ID initializes once and queues config + js
    const first = initGoogleAnalytics('G-9XYZ876543');
    const second = initGoogleAnalytics('G-9XYZ876543');
    assert.equal(first.enabled, true);
    assert.equal(first.measurementId, 'G-9XYZ876543');
    assert.equal(second.enabled, true);
    assert.equal(appended.length, 1);
    assert.equal(appended[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-9XYZ876543');
    assert.equal(appended[0].async, true);

    trackEvent('whatsapp_cta_click', { location: 'hero_primary', plan_id: undefined });
    const events = (globalObj.window.dataLayer || []) as unknown[][];
    const tracked = events.find((entry) => entry[0] === 'event' && entry[1] === 'whatsapp_cta_click');
    assert.ok(tracked);
    assert.deepEqual(tracked[2], { location: 'hero_primary' });
  } finally {
    globalObj.window = prevWindow;
    globalObj.document = prevDocument;
    resetAnalyticsForTests();
  }
});
