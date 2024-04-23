import { DateTime } from 'luxon';

export type TranscriptionWorkflow = {
  workflowActor: number;
  statusId: number;
  workflowTimestamp: DateTime;
  comments: TranscriptionWorkflowComment[];
};

type TranscriptionWorkflowComment = {
  comment: string;
  commentedAt: DateTime;
  authorId: number;
};
