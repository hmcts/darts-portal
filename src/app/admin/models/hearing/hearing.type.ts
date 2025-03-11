import { AdminCase } from '@admin-types/case/case.type';
import { DateTime } from 'luxon';

export type AdminHearing = {
  id: number;
  hearingDate: DateTime;
  scheduledStartTime: string;
  hearingIsActual: boolean;
  case: AdminCase;
  courtroom: {
    id: number;
    name: string;
  };
  judges: string[];
  createdAt: DateTime;
  createdBy?: string;
  createdById: number;
  lastModifiedAt: DateTime;
  lastModifiedBy?: string;
  lastModifiedById: number;
};
