class UserState {
  userId!: number;
  userName!: string;
  roles?: Role[];
  isActive!: boolean;
}

class Role {
  roleId!: number;
  roleName!: string;
  permissions?: Permissions[];
}

class Permissions {
  permissionId!: number;
  permissionName!: string;
}

export default UserState;
