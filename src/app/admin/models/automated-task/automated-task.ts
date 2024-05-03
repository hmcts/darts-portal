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
  createdAt: DateTime;
  createdBy: number;
  lastModifiedAt: DateTime;
  lastModifiedBy: number;
  createdByFullName?: string;
  modifiedByFullName?: string;
};
