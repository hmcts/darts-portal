import config from 'config';

// only include config items that are allowed to be exposed the browser

export default () => ({
  appInsightsKey: config.get('secrets.darts.AppInsightsInstrumentationKey'),
  support: config.get('support'),
});
