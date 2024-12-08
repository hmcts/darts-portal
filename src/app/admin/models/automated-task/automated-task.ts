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
  rpoCsvStartHour?: DateTime;
  rpoCsvEndHour?: DateTime;
  armReplayStartTs?: DateTime;
  armReplayEndTs?: DateTime;
  armAttributeType?: 'RPO' | 'REPLAY';
};

export type AutomatedTaskDetailsState = AutomatedTaskDetails & {
  rpoCsvStartHour?: string;
  rpoCsvEndHour?: string;
  armReplayStartTs?: string;
  armReplayEndTs?: string;
};
