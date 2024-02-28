import { DateTime } from 'luxon';
import { SecurityGroup } from './security-groups.interface';

export interface CourthouseData {
  id: number;
  courthouse_name: string;
  code: number;
  display_name: string;
  created_date_time: string;
  last_modified_date_time?: string;
  region_id?: number;
  security_group_ids?: number[];
}

export interface Courthouse {
  id: number;
  name: string;
  code: number;
  displayName: string;
  createdDateTime?: DateTime;
  lastModifiedDateTime?: DateTime;
  regionName?: string;
  securityGroups?: SecurityGroup[];
}
