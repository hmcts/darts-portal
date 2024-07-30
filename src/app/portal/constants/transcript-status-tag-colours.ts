import { TagColour } from '@core-types/index';
import { TranscriptStatus } from '@portal-types/index';

export const transcriptStatusTagColours: { [K in TranscriptStatus]: TagColour } = {
  Requested: 'blue',
  'Awaiting Authorisation': 'yellow',
  Approved: 'turquoise',
  Rejected: 'red',
  'With Transcriber': 'purple',
  Complete: 'green',
  Closed: 'grey',
};
