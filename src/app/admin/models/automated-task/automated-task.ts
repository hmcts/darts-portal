export type AutomatedTask = {
  id: number;
  name: string;
  description: string;
  cronExpression: string;
  isActive: boolean;
};
