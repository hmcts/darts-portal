import * as appInsights from 'applicationinsights';
import config from 'config';
import os from 'os';

let started = false;

export function initAppInsights(roleName = 'DARTS Portal API') {
  if (started) return appInsights.defaultClient;

  const connectionString: string | undefined = config.has('secrets.darts.AppInsightsConnectionString')
    ? config.get<string>('secrets.darts.AppInsightsConnectionString')
    : undefined;

  const instrumentationKey: string | undefined =
    !connectionString && config.has('secrets.darts.AppInsightsInstrumentationKey')
      ? config.get<string>('secrets.darts.AppInsightsInstrumentationKey')
      : undefined;

  if (!connectionString && !instrumentationKey) {
    console.warn('[AppInsights] No connection string or instrumentation key in config.');
    return null;
  }

  const setup = connectionString ? appInsights.setup(connectionString) : appInsights.setup(instrumentationKey!);

  setup
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

  started = true;
  return client;
}

export function trackTrace(message: string, properties?: Record<string, any>) {
  appInsights.defaultClient?.trackTrace({ message, properties });
}

export function trackException(err: Error, properties?: Record<string, any>) {
  appInsights.defaultClient?.trackException({ exception: err, properties });
}

export function trackEvent(name: string, properties?: Record<string, any>, measurements?: Record<string, number>) {
  appInsights.defaultClient?.trackEvent({ name, properties, measurements });
}

process.on('uncaughtException', (e) => {
  appInsights.defaultClient?.trackException({ exception: e });
  appInsights.defaultClient?.flush();
});

process.on('unhandledRejection', (e: any) => {
  appInsights.defaultClient?.trackException({ exception: e instanceof Error ? e : new Error(String(e)) });
  appInsights.defaultClient?.flush();
});
