class UserState {
    userId: number = 0;
    userName: string = '';
    roles?: Role;
}

class Role {
    roleId: number = 0;
    roleName: string = '';
    //Permissions excluded for now
}

export = UserState;