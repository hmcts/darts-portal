export interface EventMappingData {
  id: number;
  type: string;
  sub_type: string;
  name: string;
  handler: string | null;
  is_active: boolean;
  has_restrictions: boolean;
  created_at: string;
}
