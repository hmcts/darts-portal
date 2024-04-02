import { SecurityRole } from '@admin-types/users/security-role.type';

export type GroupFormValue = {
  name: string | null;
  description: string | null;
  role: SecurityRole | null;
};
