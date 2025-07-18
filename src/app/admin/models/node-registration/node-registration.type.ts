import { DateTime } from 'luxon';

export type NodeRegistration = {
  id: number;
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: string;
    name: string;
  };
  ipAddress: string;
  hostname?: string;
  macAddress: string;
  nodeType: string;
  createdAt: DateTime;
  createdBy: number;
  createdByName?: string;
};
