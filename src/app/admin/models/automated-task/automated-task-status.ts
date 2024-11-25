export type AutomatedTaskStatus = {
  taskId: number;
  taskName: string;
  status: 'success' | 'not-found' | 'already-running' | 'inactive' | 'active';
};
