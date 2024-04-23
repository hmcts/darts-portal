export interface TranscriptionWorkflowData {
  workflow_actor: number;
  status_id: number;
  workflow_ts: string;
  comments: TranscriptionWorkflowCommentData[];
}

interface TranscriptionWorkflowCommentData {
  comment: string;
  commented_at: string;
  author_id: number;
}
