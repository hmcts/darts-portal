import { DateTime } from 'luxon';

export type RetentionPolicyTypes = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fixedPolicyKey: number;
  duration: string;
  policyStartAt: DateTime;
  policyEndAt: DateTime | null;
};
