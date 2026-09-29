import { DateTime } from 'luxon';

export type AutomatedTask = {
  id: number;
  name: string;
  description: string;
  cronExpression: string;
  isActive: boolean;
};

export type AutomatedTaskDetails = AutomatedTask & {
  isCronEditable: boolean;
  batchSize: number;
  createdAt: DateTime;
  createdBy: number;
  lastModifiedAt: DateTime;
  lastModifiedBy: number;
  createdByFullName?: string;
  modifiedByFullName?: string;
  rpoCsvStartHour?: number;
  rpoCsvEndHour?: number;
  armReplayStartTs?: DateTime;
  armReplayEndTs?: DateTime;
  armAttributeType?: 'RPO' | 'REPLAY';
};

export type AutomatedTaskDetailsState = AutomatedTaskDetails & {
  rpoCsvStartHour?: number;
  rpoCsvEndHour?: number;
  armReplayStartTs?: string;
  armReplayEndTs?: string;
};
