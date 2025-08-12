export interface NodeRegistrationData {
  id: number;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: string;
    name: string;
  };
  ip_address: string;
  hostname?: string;
  mac_address: string;
  node_type: string;
  created_at: string;
  created_by: number;
}
