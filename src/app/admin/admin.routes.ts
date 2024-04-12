import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { authGuard } from '../core/auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/users',
    loadComponent: () => import('./components/users/users.component').then((c) => c.UsersComponent),
  },
  {
    path: 'admin/users/create',
    loadComponent: () =>
      import('./components/users/create-user/create-user.component').then((c) => c.CreateUserComponent),
  },
  {
    path: 'admin/users/edit/:userId',
    loadComponent: () => import('./components/users/edit-user/edit-user.component').then((c) => c.EditUserComponent),
  },
  {
    path: 'admin/users/:userId/assign-groups',
    loadComponent: () =>
      import('./components/users/user-groups/assign-groups/assign-groups.component').then(
        (c) => c.AssignGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/remove-groups',
    loadComponent: () =>
      import('./components/users/user-groups/remove-groups/remove-groups.component').then(
        (c) => c.RemoveGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/activate',
    loadComponent: () =>
      import('./components/users/activate-user/activate-user.component').then((c) => c.ActivateUserComponent),
  },
  {
    path: 'admin/users/:userId',
    loadComponent: () =>
      import('./components/users/user-record/user-record.component').then((c) => c.UserRecordComponent),
  },
  {
    path: 'admin/groups',
    loadComponent: () => import('./components/groups/groups.component').then((c) => c.GroupsComponent),
  },
  {
    path: 'admin/groups/create',
    loadComponent: () =>
      import('./components/groups/create-edit-group/create-edit-group.component').then(
        (c) => c.CreateEditGroupComponent
      ),
  },
  {
    path: 'admin/groups/:id',
    loadComponent: () =>
      import('./components/groups/group-record/group-record.component').then((c) => c.GroupRecordComponent),
  },
  {
    path: 'admin/groups/:id/remove-users',
    loadComponent: () =>
      import('./components/groups/remove-group-users/remove-group-users.component').then(
        (c) => c.RemoveGroupUsersComponent
      ),
  },
  {
    path: 'admin/groups/:id/edit',
    loadComponent: () =>
      import('./components/groups/create-edit-group/create-edit-group.component').then(
        (c) => c.CreateEditGroupComponent
      ),
  },
  {
    path: 'admin/courthouses',
    loadComponent: () => import('./components/courthouses/courthouses.component').then((c) => c.CourthousesComponent),
  },
  {
    path: 'admin/courthouses/:courthouseId/edit',
    loadComponent: () =>
      import('./components/courthouses/edit-courthouse/edit-courthouse.component').then(
        (c) => c.EditCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/create',
    loadComponent: () =>
      import('./components/courthouses/create-courthouse/create-courthouse.component').then(
        (c) => c.CreateCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/:courthouseId',
    loadComponent: () =>
      import('./components/courthouses/courthouse-record/courthouse-record.component').then(
        (c) => c.CourthouseRecordComponent
      ),
  },
  {
    path: 'admin/events',
    loadComponent: () => import('./components/events/events.component').then((c) => c.EventsComponent),
  },
  {
    path: 'admin/audio-cache',
    loadComponent: () => import('./components/audio-cache/audio-cache.component').then((c) => c.AudioCacheComponent),
  },
  {
    path: 'admin/transcripts',
    loadComponent: () => import('./components/transcripts/transcripts.component').then((c) => c.TranscriptsComponent),
  },
  {
    path: 'admin/file-deletion',
    loadComponent: () =>
      import('./components/file-deletion/file-deletion.component').then((c) => c.FileDeletionComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies',
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/retention-policies/create',
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/edit',
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/event-mapping',
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/automated-tasks',
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
  data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
}));
