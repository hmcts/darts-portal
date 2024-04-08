export type RetentionPolicyForm = {
  displayName: string;
  name: string;
  description: string;
  fixedPolicyKey: string;
  duration: {
    years: string;
    months: string;
    days: string;
  };
  startDate: string;
  startTime: {
    hours: string;
    minutes: string;
  };
};
