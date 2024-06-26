import { SecurityGroup } from '@admin-types/index';
import { DateTime } from 'luxon';

export interface CourthouseData {
  id: number;
  courthouse_name: string;
  display_name: string;
  code: number;
  created_date_time: string;
  last_modified_date_time?: string;
  region_id?: number;
  security_group_ids?: number[];
  has_data?: boolean | false;
}

export type Courthouse = {
  id: number;
  name: string;
  code: number;
  displayName: string;
  createdDateTime?: DateTime;
  lastModifiedDateTime?: DateTime;
  regionName?: string;
  securityGroups?: SecurityGroup[];
};
