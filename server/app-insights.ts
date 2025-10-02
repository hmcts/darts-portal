import * as appInsights from 'applicationinsights';
import config from 'config';
import os from 'os';

let started = false;
let enabled = false;

const GUID_RE = /^[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

function isAllZeroGuid(v: string) {
  return /^0{8}-(0{4}-){3}0{12}$/.test(v);
}

function parseConnStrIk(key: string): string | undefined {
  const m = key
    .split(';')
    .map((s) => s.trim())
    .find((p) => /^InstrumentationKey=/i.test(p));
  if (!m) return undefined;
  const v = m.split('=')[1]?.trim();
  return v && GUID_RE.test(v) && !isAllZeroGuid(v) ? v : undefined;
}

function validConnStr(s?: string): boolean {
  if (!s) return false;
  const v = s.trim();
  if (!v || v.toLowerCase() === 'undefined' || v.toLowerCase() === 'null') return false;
  // must contain a real InstrumentationKey=<GUID>
  return /(^|;)InstrumentationKey=/i.test(v) && !!parseConnStrIk(v);
}

function validIkey(s?: string): boolean {
  if (!s) return false;
  const v = s.trim();
  if (!v || v.toLowerCase() === 'undefined' || v.toLowerCase() === 'null') return false;
  return GUID_RE.test(v) && !isAllZeroGuid(v);
}

export function initAppInsights(roleName = 'DARTS Portal API') {
  if (started) return enabled;

  const envConn = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  const cfgConn = config.has('secrets.darts.AppInsightsConnectionString')
    ? config.get<string>('secrets.darts.AppInsightsConnectionString') || undefined
    : undefined;
  const cfgIkey = config.has('secrets.darts.AppInsightsInstrumentationKey')
    ? config.get<string>('secrets.darts.AppInsightsInstrumentationKey') || undefined
    : undefined;

  let chosen: { type: 'conn' | 'ikey'; value: string } | undefined;

  if (validConnStr(envConn)) chosen = { type: 'conn', value: envConn!.trim() };
  else if (validConnStr(cfgConn)) chosen = { type: 'conn', value: cfgConn!.trim() };
  else if (validIkey(cfgIkey)) chosen = { type: 'ikey', value: cfgIkey!.trim() };

  if (!chosen) {
    console.info('[AppInsights] No valid connection string/iKey. Telemetry disabled.');
    started = true;
    enabled = false;
    return enabled;
  }

  try {
    appInsights
      .setup(chosen.value)
      .setAutoCollectRequests(false)
      .setAutoCollectPerformance(false, false)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(false)
      .setAutoCollectConsole(false)
      .setAutoCollectPreAggregatedMetrics(false)
      .setSendLiveMetrics(!!process.env.AI_LIVE_METRICS)
      .enableWebInstrumentation(false); //Already have frontend instrumentation

    const client = appInsights.defaultClient;
    client.config.samplingPercentage = process.env.AI_SAMPLING ? Number(process.env.AI_SAMPLING) : 100;
    client.config.enableUseDiskRetryCaching = true;

    client.context.tags[client.context.keys.cloudRole] = roleName;
    client.context.tags[client.context.keys.cloudRoleInstance] = process.env.HOSTNAME || os.hostname();

    appInsights.start();

    enabled = true;
    started = true;
    console.info('[AppInsights] Telemetry enabled.');
  } catch (e) {
    console.error('AppInsights setup failed', e);
    enabled = false;
  } finally {
    started = true;
  }

  return enabled;
}

export function isTelemetryEnabled() {
  return enabled;
}

export function trackTrace(message: string, properties?: Record<string, any>) {
  if (!enabled) return;

  appInsights.defaultClient?.trackTrace({ message, properties });
}

export function trackException(err: Error, properties?: Record<string, any>) {
  if (!enabled) return;

  appInsights.defaultClient?.trackException({ exception: err, properties });
}

export function trackEvent(name: string, properties?: Record<string, any>, measurements?: Record<string, number>) {
  if (!enabled) return;

  appInsights.defaultClient?.trackEvent({ name, properties, measurements });
}

export function flushNow(cb?: () => void) {
  if (!enabled) return cb?.();
  appInsights.defaultClient?.flush();
}
