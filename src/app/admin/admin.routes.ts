import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { authGuard } from '../core/auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/search',
    title: 'DARTS Admin Search Audio, Events and Hearings',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () => import('./components/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'admin/users',
    title: 'DARTS Admin Search Users',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () => import('./components/users/users.component').then((c) => c.UsersComponent),
  },
  {
    path: 'admin/users/create',
    title: 'DARTS Admin Create Users',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/users/create-user/create-user.component').then((c) => c.CreateUserComponent),
  },
  {
    path: 'admin/users/edit/:userId',
    title: 'DARTS Admin Edit User',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () => import('./components/users/edit-user/edit-user.component').then((c) => c.EditUserComponent),
  },
  {
    path: 'admin/users/:userId/assign-groups',
    title: 'DARTS Admin Assign User Groups',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/users/user-groups/assign-groups/assign-groups.component').then(
        (c) => c.AssignGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/remove-groups',
    title: 'DARTS Admin Remove User Groups',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/users/user-groups/remove-groups/remove-groups.component').then(
        (c) => c.RemoveGroupsComponent
      ),
  },
  {
    path: 'admin/users/:userId/activate',
    title: 'DARTS Admin Activate User',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/users/activate-user/activate-user.component').then((c) => c.ActivateUserComponent),
  },
  {
    path: 'admin/users/:userId/deactivate',
    title: 'DARTS Admin Deactivate User',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/users/deactivate-user/deactivate-user.component').then((c) => c.DeactivateUserComponent),
  },
  {
    path: 'admin/users/:userId',
    title: 'DARTS Admin View User',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/users/user-record/user-record.component').then((c) => c.UserRecordComponent),
  },
  {
    path: 'admin/groups',
    title: 'DARTS Admin Search Groups',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () => import('./components/groups/groups.component').then((c) => c.GroupsComponent),
  },
  {
    path: 'admin/groups/create',
    title: 'DARTS Admin Create Group',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/groups/create-edit-group/create-edit-group.component').then(
        (c) => c.CreateEditGroupComponent
      ),
  },
  {
    path: 'admin/groups/:id',
    title: 'DARTS Admin View Group',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/groups/group-record/group-record.component').then((c) => c.GroupRecordComponent),
  },
  {
    path: 'admin/groups/:id/remove-users',
    title: 'DARTS Admin Remove Users Group',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/groups/remove-group-users/remove-group-users.component').then(
        (c) => c.RemoveGroupUsersComponent
      ),
  },
  {
    path: 'admin/groups/:id/edit',
    title: 'DARTS Admin Edit Group',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/groups/create-edit-group/create-edit-group.component').then(
        (c) => c.CreateEditGroupComponent
      ),
  },
  {
    path: 'admin/courthouses',
    title: 'DARTS Admin Search Courthouses',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () => import('./components/courthouses/courthouses.component').then((c) => c.CourthousesComponent),
  },
  {
    path: 'admin/courthouses/:courthouseId/edit',
    title: 'DARTS Admin Edit Courthouse',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/courthouses/edit-courthouse/edit-courthouse.component').then(
        (c) => c.EditCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/create',
    title: 'DARTS Admin Create Courthouse',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/courthouses/create-courthouse/create-courthouse.component').then(
        (c) => c.CreateCourthouseComponent
      ),
  },
  {
    path: 'admin/courthouses/:courthouseId',
    title: 'DARTS Admin View Courthouses',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/courthouses/courthouse-record/courthouse-record.component').then(
        (c) => c.CourthouseRecordComponent
      ),
  },
  {
    path: 'admin/audio-file/:id',
    title: 'DARTS Admin View Audio File',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () => import('./components/audio-file/audio-file.component').then((c) => c.AudioFileComponent),
  },
  {
    path: 'admin/transformed-media',
    title: 'DARTS Admin Transformed Media',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/transformed-media/search-transformed-media/search-transformed-media.component').then(
        (c) => c.SearchTransformedMediaComponent
      ),
  },
  {
    path: 'admin/transformed-media/:id',
    title: 'DARTS Admin View Transformed Media',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/transformed-media/view-transformed-media/view-transformed-media.component').then(
        (c) => c.ViewTransformedMediaComponent
      ),
  },
  {
    path: 'admin/transformed-media/:id/change-owner/:mediaRequestId',
    title: 'DARTS Admin Change Media Request Owner',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/transformed-media/change-owner-transformed-media/change-owner-transformed-media.component'
      ).then((c) => c.ChangeOwnerTransformedMediaComponent),
  },
  {
    path: 'admin/transcripts',
    title: 'DARTS Admin Transcripts',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () => import('./components/transcripts/transcripts.component').then((c) => c.TranscriptsComponent),
  },
  {
    path: 'admin/transcripts/:transcriptionId',
    title: 'DARTS Admin View Transcription',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/transcripts/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'admin/transcripts/:transcriptionId/change-status',
    title: 'DARTS Admin Change Transcription Status',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/transcripts/change-transcript-status/change-transcript-status.component').then(
        (c) => c.ChangeTranscriptStatusComponent
      ),
  },
  {
    path: 'admin/transcripts/document/:transcriptionDocumentId',
    title: 'DARTS Admin View Transcription Document',
    data: { allowedRoles: ['SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('./components/transcripts/view-transcription-document/view-transcription-document.component').then(
        (c) => c.ViewTranscriptionDocumentComponent
      ),
  },
  {
    path: 'admin/file-deletion',
    title: 'DARTS Admin File Deletion',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/file-deletion/file-deletion.component').then((c) => c.FileDeletionComponent),
  },
  {
    path: 'admin/file-deletion/audio-file/:id',
    title: 'DARTS Admin Audio File Deletion',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/file-deletion/audio-file-delete/audio-file-delete.component').then(
        (c) => c.AudioFileDeleteComponent
      ),
  },
  {
    path: 'admin/file/:id/hide-or-delete',
    title: 'DARTS Admin Hide or Delete File',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/file-deletion/file-hide-or-delete/file-hide-or-delete.component').then(
        (c) => c.FileHideOrDeleteComponent
      ),
  },
  {
    path: 'admin/system-configuration/retention-policies',
    title: 'DARTS Admin Retention Policies',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/retention-policies/create',
    title: 'DARTS Admin Create Retention Policy',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/edit',
    title: 'DARTS Admin Edit Retention Policy',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/event-mappings',
    title: 'DARTS Admin Event Mapping',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/event-mappings/create',
    title: 'DARTS Admin Add Event Mapping',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/system-configuration/event-mappings/add-update-event-mapping/add-update-event-mapping.component'
      ).then((c) => c.AddUpdateEventMappingComponent),
  },
  {
    path: 'admin/system-configuration/event-mappings/:id/edit',
    title: 'DARTS Admin Edit Event Mapping',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/system-configuration/event-mappings/add-update-event-mapping/add-update-event-mapping.component'
      ).then((c) => c.AddUpdateEventMappingComponent),
  },
  {
    path: 'admin/system-configuration/event-mappings/:id/delete',
    title: 'DARTS Admin Delete Event Mapping',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/system-configuration/event-mappings/delete-event-mapping/delete-event-mapping.component'
      ).then((c) => c.DeleteEventMappingComponent),
  },
  {
    path: 'admin/system-configuration/automated-tasks',
    title: 'DARTS Admin Automated Tasks',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/system-configuration/system-configuration.component').then(
        (c) => c.SystemConfigurationComponent
      ),
  },
  {
    path: 'admin/system-configuration/automated-tasks/:id',
    title: 'DARTS Admin Automated Task',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./components/automated-tasks/view-automated-tasks/view-automated-tasks.component').then(
        (c) => c.ViewAutomatedTasksComponent
      ),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/create-revision',
    title: 'DARTS Admin New Version Retention Policy',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
  {
    path: 'admin/system-configuration/retention-policies/:id/edit-revision',
    title: 'DARTS Admin Edit Revision Retention Policy',
    data: { allowedRoles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import(
        './components/retention-policies/create-edit-retention-policy/create-edit-retention-policy.component'
      ).then((c) => c.CreateEditRetentionPolicyComponent),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
}));
