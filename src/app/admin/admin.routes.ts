import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { authGuard } from '../core/auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/search',
    title: 'DARTS Admin Search Audio, Events and Hearings',
    loadComponent: () => import('./components/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'admin/users',
    title: 'DARTS Admin Search Users',
    loadComponent: () => import('./components/users/users.component').then((c) => c.UsersComponent),
  },
  {
    path: 'admin/users/create',
    title: 'DARTS Admin Create Users',
    loadComponent: () =>
      import('./components/users/create-user/create-user.component').then((c) => c.CreateUserComponent),
  },
  {
    path: 'admin/users/edit/:userId',
    title: 'DARTS Admin Edit User',
    loadComponent: () => import('./components/users/edit-user/edit-user.component').then((c) => c.EditUserComponent),
  },
  {
    path: 'admin/users/:userId/assign-groups',
    title: 'DARTS Admin Assign User Groups',
    loadComponent: () =>
      import('./components/users/user-groups/assign-groups/assign-groups.component').then(
        (c) => c.AssignGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/remove-groups',
    title: 'DARTS Admin Remove User Groups',
    loadComponent: () =>
      import('./components/users/user-groups/remove-groups/remove-groups.component').then(
        (c) => c.RemoveGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/activate',
    title: 'DARTS Admin Activate User',
    loadComponent: () =>
      import('./components/users/activate-user/activate-user.component').then((c) => c.ActivateUserComponent),
  },
  {
    path: 'admin/users/:userId/deactivate',
    title: 'DARTS Admin Deactivate User',
    loadComponent: () =>
      import('./components/users/deactivate-user/deactivate-user.component').then((c) => c.DeactivateUserComponent),
  },
  {
    path: 'admin/users/:userId',
    title: 'DARTS Admin View User',
    loadComponent: () =>
      import('./components/users/user-record/user-record.component').then((c) => c.UserRecordComponent),
  },
  {
    path: 'admin/groups',
    title: 'DARTS Admin Search Groups',
    loadComponent: () => import('./components/groups/groups.component').then((c) => c.GroupsComponent),
  },
  {
    path: 'admin/groups/create',
    title: 'DARTS Admin Create Group',
    loadComponent: () =>
      import('./components/groups/create-edit-group/create-edit-group.component').then(
        (c) => c.CreateEditGroupComponent
      ),
  },
  {
    path: 'admin/groups/:id',
    title: 'DARTS Admin View Group',
    loadComponent: () =>
      import('./components/groups/group-record/group-record.component').then((c) => c.GroupRecordComponent),
  },
  {
    path: 'admin/groups/:id/remove-users',
    title: 'DARTS Admin Remove Users Group',
    loadComponent: () =>
      import('./components/groups/remove-group-users/remove-group-users.component').then(
        (c) => c.RemoveGroupUsersComponent
      ),
  },
  {
    path: 'admin/groups/:id/edit',
    title: 'DARTS Admin Edit Group',
    loadComponent: () =>
      import('./components/groups/create-edit-group/create-edit-group.component').then(
        (c) => c.CreateEditGroupComponent
      ),
  },
  {
    path: 'admin/courthouses',
    title: 'DARTS Admin Search Courthouses',
    loadComponent: () => import('./components/courthouses/courthouses.component').then((c) => c.CourthousesComponent),
  },
  {
    path: 'admin/courthouses/:courthouseId/edit',
    title: 'DARTS Admin Edit Courthouse',
    loadComponent: () =>
      import('./components/courthouses/edit-courthouse/edit-courthouse.component').then(
        (c) => c.EditCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/create',
    title: 'DARTS Admin Create Courthouse',
    loadComponent: () =>
      import('./components/courthouses/create-courthouse/create-courthouse.component').then(
        (c) => c.CreateCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/:courthouseId',
    title: 'DARTS Admin View Courthouses',
    loadComponent: () =>
      import('./components/courthouses/courthouse-record/courthouse-record.component').then(
        (c) => c.CourthouseRecordComponent
      ),
  },
  {
    path: 'admin/transformed-media',
    title: 'DARTS Admin Transformed Media',
    loadComponent: () =>
      import('./components/transformed-media/search-transformed-media/search-transformed-media.component').then(
        (c) => c.SearchTransformedMediaComponent
      ),
  },
  {
    path: 'admin/transformed-media/:id',
    title: 'DARTS Admin View Transformed Media',
    loadComponent: () =>
      import('./components/transformed-media/view-transformed-media/view-transformed-media.component').then(
        (c) => c.ViewTransformedMediaComponent
      ),
  },
  {
    path: 'admin/transformed-media/:id/change-owner/:mediaRequestId',
    title: 'DARTS Admin Change Media Request Owner',
    loadComponent: () =>
      import(
        './components/transformed-media/change-owner-transformed-media/change-owner-transformed-media.component'
      ).then((c) => c.ChangeOwnerTransformedMediaComponent),
  },
  {
    path: 'admin/audio-cache',
    title: 'DARTS Admin Audio Cache',
    loadComponent: () => import('./components/audio-cache/audio-cache.component').then((c) => c.AudioCacheComponent),
  },
  {
    path: 'admin/transcripts',
    title: 'DARTS Admin Transcripts',
    loadComponent: () => import('./components/transcripts/transcripts.component').then((c) => c.TranscriptsComponent),
  },
  {
    path: 'admin/file-deletion',
    title: 'DARTS Admin File Deletion',
    loadComponent: () =>
      import('./components/file-deletion/file-deletion.component').then((c) => c.FileDeletionComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies',
    title: 'DARTS Admin Retention Policies',
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/retention-policies/create',
    title: 'DARTS Admin Create Retention Policy',
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/edit',
    title: 'DARTS Admin Edit Retention Policy',
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/event-mappings',
    title: 'DARTS Admin Event Mapping',
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/event-mappings/create',
    title: 'DARTS Admin Add Event Mapping',
    loadComponent: () =>
      import(
        './components/system-configuration/event-mappings/add-update-event-mapping/add-update-event-mapping.component'
      ).then((c) => c.AddUpdateEventMappingComponent),
  },
  {
    path: 'admin/system-configuration/automated-tasks',
    title: 'DARTS Admin Automated Tasks',
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/automated-tasks/:id',
    title: 'DARTS Admin Automated Task',
    loadComponent: () =>
      import('./components/automated-tasks/view-automated-tasks/view-automated-tasks.component').then(
        (c) => c.ViewAutomatedTasksComponent
      ),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/create-revision',
    title: 'DARTS Admin New Version Retention Policy',
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/edit-revision',
    title: 'DARTS Admin Edit Revision Retention Policy',
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/transcripts/:transcriptionId',
    title: 'DARTS Admin View Transcription',
    loadComponent: () =>
      import('./components/transcripts/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'admin/transcripts/:transcriptionId/change-status',
    title: 'DARTS Admin Change Transcription Status',
    loadComponent: () =>
      import('./components/transcripts/change-transcript-status/change-transcript-status.component').then(
        (c) => c.ChangeTranscriptStatusComponent
      ),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
  data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
}));
