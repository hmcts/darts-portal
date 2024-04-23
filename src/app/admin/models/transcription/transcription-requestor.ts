export type Requestor = {
  userId: number | undefined;
  fullName: string | undefined;
  email?: string | undefined;
};

export interface RequestorData {
  user_id: number;
  user_full_name: string;
}
