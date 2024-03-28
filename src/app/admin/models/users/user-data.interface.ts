export interface UserData {
  id: number;
  last_login_at: string;
  last_modified_at: string;
  created_at: string;
  full_name: string;
  email_address: string;
  description: string;
  active: boolean;
  security_group_ids: number[];
}
