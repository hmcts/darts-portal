import { StubResponse } from '.';
import data from './data/securityRoles.json';

export const securityRoles: StubResponse[] = [
  {
    method: 'get',
    path: '/admin/security-roles',
    response: data,
    status: 200,
  },
  {
    method: 'get',
    path: '/admin/security-roles/:securityRoleId',
    response: data[0],
    status: 200,
  },
  {
    method: 'post',
    path: '/admin/security-roles',
    response: data[0],
    status: 201,
  },
  {
    method: 'patch',
    path: '/admin/security-roles/:securityRoleId',
    response: data[0],
    status: 200,
  },
  {
    method: 'delete',
    path: '/admin/security-roles/:securityRoleId',
    response: null,
    status: 204,
  },
];
