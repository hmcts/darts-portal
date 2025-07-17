export type Requestor = {
  userId?: number | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
  isSystemUser?: boolean;
};

export interface RequestorData {
  user_id: number;
  user_full_name: string;
  is_system_user: boolean;
}
