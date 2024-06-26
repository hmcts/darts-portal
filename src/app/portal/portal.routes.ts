import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { authGuard } from '../core/auth/auth.guard';

export const PORTAL_ROUTES: Routes = [
  {
    path: 'audios',
    title: 'DARTS Your Audio',
    loadComponent: () => import('../portal/components/audios/audios.component').then((c) => c.AudiosComponent),
  },
  {
    path: 'work',
    title: 'DARTS Your Work',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () => import('../portal/components/your-work/your-work.component').then((c) => c.YourWorkComponent),
  },
  {
    path: 'work/:requestId',
    title: 'DARTS View Your Work Request',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../portal/components/your-work/upload-transcript/upload-transcript.component').then(
        (c) => c.UploadTranscriptComponent
      ),
  },
  {
    path: 'work/:requestId/complete',
    title: 'DARTS Completed Transcript Request',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../portal/components/your-work/completed-transcript/completed-transcript.component').then(
        (c) => c.CompletedTranscriptComponent
      ),
  },
  {
    path: 'audios/:requestId',
    title: 'DARTS Play Audio',
    loadComponent: () =>
      import('../portal/components/audios/audio-view/audio-view.component').then((c) => c.AudioViewComponent),
  },
  {
    path: 'transcriptions',
    title: 'DARTS Your Transcripts',
    data: { allowedRoles: ['APPROVER', 'REQUESTER', 'JUDICIARY', 'SUPER_USER'] },
    loadComponent: () =>
      import('../portal/components/transcriptions/transcriptions.component').then((c) => c.TranscriptionsComponent),
  },
  {
    path: 'transcriptions/delete-error',
    title: 'DARTS Delete Transcript Error',
    data: { allowedRoles: ['APPROVER', 'REQUESTER', 'JUDICIARY'] },
    loadComponent: () =>
      import('../portal/components/transcriptions/error/partial-delete-error/partial-delete-error.component').then(
        (c) => c.PartialDeleteErrorComponent
      ),
  },
  {
    path: 'transcription-requests',
    title: 'DARTS Transcript Requests',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../portal/components/transcriptions/transcription-requests/transcription-requests.component').then(
        (c) => c.TranscriptionRequestsComponent
      ),
  },
  {
    path: 'transcription-requests/:transcriptId',
    title: 'DARTS View Transcript Request',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../portal/components/transcriptions/assign-transcript/assign-transcript.component').then(
        (c) => c.AssignTranscriptComponent
      ),
  },
  {
    path: 'search',
    title: 'DARTS Search',
    loadComponent: () => import('../portal/components/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'case/:caseId',
    title: 'DARTS Case File',
    loadComponent: () => import('../portal/components/case/case.component').then((c) => c.CaseComponent),
  },
  {
    path: 'case/:caseId/retention',
    title: 'DARTS Case Retention',
    data: { allowedRoles: ['APPROVER', 'REQUESTER', 'JUDICIARY', 'SUPER_ADMIN', 'SUPER_USER'] },
    loadComponent: () =>
      import('../portal/components/case/case-retention-date/case-retention-date.component').then(
        (c) => c.CaseRetentionDateComponent
      ),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id',
    title: 'DARTS Hearing Details',
    loadComponent: () => import('../portal/components/hearing/hearing.component').then((c) => c.HearingComponent),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id/add-annotation',
    title: 'DARTS Add Annotation',
    data: { allowedRoles: ['JUDICIARY', 'SUPER_ADMIN'] },
    loadComponent: () =>
      import('../portal/components/hearing/add-annotation/add-annotation.component').then(
        (c) => c.AddAnnotationComponent
      ),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id/request-transcript',
    title: 'DARTS Request Transcript',
    loadComponent: () =>
      import('../portal/components/hearing/request-transcript/request-transcript.component').then(
        (c) => c.RequestTranscriptComponent
      ),
  },
  {
    path: 'case/:caseId/transcripts/:transcriptId',
    title: 'DARTS View Transcript File',
    loadComponent: () =>
      import('../portal/components/transcriptions/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id/transcripts/:transcriptId',
    title: 'DARTS View Transcript File',
    loadComponent: () =>
      import('../portal/components/transcriptions/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'transcriptions/transcripts/:transcriptId',
    title: 'DARTS View Transcript File',
    loadComponent: () =>
      import('../portal/components/transcriptions/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'transcriptions/approve-transcript/:transcriptId',
    title: 'DARTS Approve Transcript',
    data: { allowedRoles: ['APPROVER'] },
    loadComponent: () =>
      import('../portal/components/transcriptions/approve-transcript/approve-transcript.component').then(
        (c) => c.ApproveTranscriptComponent
      ),
  },
].map((route) => ({
  ...route,
  resolve: { userState: () => inject(UserService).userProfile$ },
  canActivate: [authGuard],
}));
