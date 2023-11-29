export interface UserState {
  userId: number;
  userName: string;
  roles: Role[];
}

interface Role {
  roleId: number;
  roleName: RoleName;
  permissions?: Permissions[];
}

interface Permissions {
  permissionId: number;
  permissionName: string;
}

export type RoleName = 'TRANSCRIBER' | 'APPROVER' | 'JUDGE' | 'REQUESTER' | 'LANGUAGE_SHOP_USER';
