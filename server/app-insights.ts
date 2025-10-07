import * as appInsights from 'applicationinsights';
import config from 'config';
import os from 'os';

let started = false;
let enabled = false;

const GUID_RE = /^[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;
const ZERO_GUID_RE = /^0{8}-(0{4}-){3}0{12}$/;

function isValidIkey(s?: string): s is string {
  if (!s) return false;
  const v = s.trim();
  if (!v) return false;
  const low = v.toLowerCase();
  if (low === 'undefined' || low === 'null') return false;
  return GUID_RE.test(v) && !ZERO_GUID_RE.test(v);
}

export function initAppInsights(roleName = 'DARTS Portal API') {
  if (started) return enabled;

  // Prefer env ikey (common names), then config
  const cfgIkey = config.has('secrets.darts.AppInsightsInstrumentationKey')
    ? config.get<string>('secrets.darts.AppInsightsInstrumentationKey') || undefined
    : undefined;

  const ikey = isValidIkey(cfgIkey) ? cfgIkey!.trim() : undefined;
  const connFromIkey = `InstrumentationKey=${ikey}`;

  if (!ikey) {
    console.info('[AppInsights] No valid iKey. Telemetry disabled (OK locally).');
    started = true;
    enabled = false;
    return enabled;
  }

  try {
    const release = process.env.RELEASE_NAME || process.env.HELM_RELEASE || '';
    const prFromRelease = release.match(/pr-(\d+)/i)?.[1];
    const pr = process.env.CHANGE_ID || process.env.PR_NUMBER || prFromRelease || '';
    const role = pr ? `DARTS Portal Node PR-${pr}` : roleName;
    const instance = process.env.HOSTNAME || os.hostname();

    process.env.OTEL_SERVICE_NAME = role;
    process.env.APPLICATIONINSIGHTS_CLOUD_ROLE = role;
    process.env.APPLICATIONINSIGHTS_CLOUD_ROLE_INSTANCE = instance;

    appInsights
      .setup(connFromIkey)
      .setAutoCollectRequests(false)
      .setAutoCollectPerformance(false, false)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(false)
      .setAutoCollectConsole(false)
      .setAutoCollectPreAggregatedMetrics(false)
      .setSendLiveMetrics(!!process.env.AI_LIVE_METRICS)
      .enableWebInstrumentation(false); // FE already instrumented

    const client = appInsights.defaultClient;

    client.config.samplingPercentage = process.env.AI_SAMPLING ? Number(process.env.AI_SAMPLING) : 100;
    client.config.enableUseDiskRetryCaching = true;

    client.context.tags[client.context.keys.cloudRole] = role;
    client.context.tags[client.context.keys.cloudRoleInstance] = instance;

    appInsights.start();

    const wired = (client as any)?._logApi && typeof (client as any)._logApi.trackTrace === 'function';
    if (!wired) {
      console.warn('[AppInsights] Client not fully wired; disabling telemetry.');
      enabled = false;
      started = true;
      return enabled;
    }

    enabled = true;
    started = true;
    console.info('[AppInsights] Telemetry enabled.');
  } catch (e) {
    console.warn('AppInsights setup failed; telemetry disabled:', (e as Error)?.message ?? e);
    enabled = false;
    started = true;
  }

  return enabled;
}

export function isTelemetryEnabled() {
  return enabled;
}

export function trackTrace(message: string, properties?: Record<string, any>) {
  if (!enabled) return;
  try {
    appInsights.defaultClient?.trackTrace({ message, properties });
  } catch {}
}

export function trackException(err: Error, properties?: Record<string, any>) {
  if (!enabled) return;
  try {
    appInsights.defaultClient?.trackException({ exception: err, properties });
  } catch {}
}

export function trackEvent(name: string, properties?: Record<string, any>, measurements?: Record<string, number>) {
  if (!enabled) return;
  try {
    appInsights.defaultClient?.trackEvent({ name, properties, measurements });
  } catch {}
}

export function flushNow(cb?: () => void) {
  if (!enabled) return cb?.();
  try {
    appInsights.defaultClient?.flush();
  } catch {}
}
