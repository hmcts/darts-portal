import config from 'config';
import { version } from './utils/version';

// only include config items that are allowed to be exposed the browser
export default () => ({
  appInsightsKey: config.get('secrets.darts.AppInsightsInstrumentationKey'),
  support: config.get('support'),
  environment: config.get('node-env'),
  dynatrace: config.get('dynatrace'),
  features: config.get('features'),
  pagination: config.get('pagination'),
  caseSearchTimeout: config.get('caseSearchTimeout'),
  version: version(),
});
