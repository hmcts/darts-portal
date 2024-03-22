import { SecurityGroup } from '@admin-types/index';
import { DateTime } from 'luxon';
import { Region } from './region.interface';

export type Courthouse = {
  courthouseName: string;
  displayName: string;
  code: number;
  id: number;
  createdDateTime: DateTime;
  lastModifiedDateTime?: DateTime;
  region?: Region;
  securityGroups?: SecurityGroup[];
};
