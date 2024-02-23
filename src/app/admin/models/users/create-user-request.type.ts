export type CreateUserRequest = {
  full_name: string;
  email_address: string;
  description: string | null;
  active: boolean;
  security_group_ids: number[];
};
