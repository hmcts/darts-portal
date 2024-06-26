import { Role } from './role.interface';

export interface UserState {
  userId: number;
  userName: string;
  roles: Role[];
  isActive: boolean;
}
