export type AutomatedTaskStatus = [
  taskName: string,
  'success' | 'not-found' | 'already-running' | 'inactive' | 'active',
];
