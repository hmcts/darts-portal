class UserState {
  userId: number = 0;
  userName: string = '';
  roles?: Role[];
}

class Role {
  roleId: number = 0;
  roleName: string = '';
  permissions?: Permissions[];
}

class Permissions {
  permissionId: number = 0;
  permissionName: string = '';
}

export = UserState;
