import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { User } from '@admin-types/users/user.type';
import { DateTime } from 'luxon';

type OptionalEventMapping = Partial<Omit<EventMapping, 'id'>> & { id: number; name?: string };

export type Event = {
  id: number;
  documentumId: string;
  sourceId: number;
  messageId: string;
  text: string;
  eventMapping: OptionalEventMapping;
  isLogEntry: boolean;
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  cases?: {
    id: number;
    courthouse: {
      id: number;
      displayName: string;
    };
    caseNumber: string;
  }[];
  hearings?: {
    id: number;
    caseId: number;
    caseNumber: string;
    hearingDate: DateTime;
    courthouse: {
      id: number;
      displayName: string;
    };
    courtroom: {
      id: number;
      name: string;
    };
  }[];
  version: string;
  chronicleId: string;
  antecedentId: string;
  isDataAnonymised: boolean;
  eventStatus: number;
  eventTs: DateTime;
  createdAt: DateTime;
  createdById: number;
  createdBy?: User;
  lastModifiedAt: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: User;
  isCurrentVersion: boolean;
};

