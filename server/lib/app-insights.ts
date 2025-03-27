import * as appInsights from 'applicationinsights';
import config from 'config';

export default class AppInsights {
  static enable(): void {
    const connectionString: string = config.get('secrets.darts.app-insights-connection-string');
    if (!connectionString) {
      console.log('No app insights connection string found.');
      return;
    }
    appInsights
      .setup(connectionString)
      .setSendLiveMetrics(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectConsole(true, true)
      .start();
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'DARTS portal node';
  }
}
