export type CreateCourthouseRequest = {
  courthouse_name: string;
  display_name: string;
  region_id?: number;
  security_group_ids?: number[];
};
