import { DateTime } from 'luxon';

export type RetentionPolicy = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fixedPolicyKey: number;
  duration: string;
  policyStartAt: DateTime;
  policyEndAt: DateTime | null;
};
