import { StubResponse } from '.';
import { localArray } from './../../darts-api-stub/localArray';

export const securityRoles: StubResponse[] = [
  {
    method: 'get',
    path: '/admin/security-roles',
    response: localArray('securityRoles').value,
    status: 200,
  },
  {
    method: 'get',
    path: '/admin/security-roles/:securityRoleId',
    response: localArray('securityRoles').value[0],
    status: 200,
  },
  {
    method: 'post',
    path: '/admin/security-roles',
    response: localArray('securityRoles').value[0],
    status: 201,
  },
  {
    method: 'patch',
    path: '/admin/security-roles/:securityRoleId',
    response: localArray('securityRoles').value[0],
    status: 200,
  },
  {
    method: 'delete',
    path: '/admin/security-roles/:securityRoleId',
    response: null,
    status: 204,
  },
];
