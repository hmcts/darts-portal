export interface SecurityGroupData {
  id: number;
  name: string;
  description: string;
  display_state: boolean;
  global_access: boolean;
  display_name: string;
  security_role_id: number;
  courthouse_ids: number[];
  user_ids: number[];
}
