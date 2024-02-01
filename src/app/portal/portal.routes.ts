import { Routes } from '@angular/router';

export const PORTAL_ROUTES: Routes = [
  {
    path: 'audios',
    loadComponent: () => import('../components/audios/audios.component').then((c) => c.AudiosComponent),
  },
  {
    path: 'work',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () => import('../components/your-work/your-work.component').then((c) => c.YourWorkComponent),
  },
  {
    path: 'work/:requestId',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../components/your-work/upload-transcript/upload-transcript.component').then(
        (c) => c.UploadTranscriptComponent
      ),
  },
  {
    path: 'work/:requestId/complete',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../components/your-work/completed-transcript/completed-transcript.component').then(
        (c) => c.CompletedTranscriptComponent
      ),
  },
  {
    path: 'audios/:requestId',
    loadComponent: () =>
      import('../components/audios/audio-view/audio-view.component').then((c) => c.AudioViewComponent),
  },
  {
    path: 'transcriptions',
    data: { allowedRoles: ['APPROVER', 'REQUESTER', 'JUDGE'] },
    loadComponent: () =>
      import('../components/transcriptions/transcriptions.component').then((c) => c.TranscriptionsComponent),
  },
  {
    path: 'transcription-requests',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../components/transcriptions/transcription-requests/transcription-requests.component').then(
        (c) => c.TranscriptionRequestsComponent
      ),
  },
  {
    path: 'transcription-requests/:transcriptId',
    data: { allowedRoles: ['TRANSCRIBER'] },
    loadComponent: () =>
      import('../components/transcriptions/assign-transcript/assign-transcript.component').then(
        (c) => c.AssignTranscriptComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () => import('../components/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'case/:caseId',
    loadComponent: () => import('../components/case/case.component').then((c) => c.CaseComponent),
  },
  {
    path: 'case/:caseId/retention',
    data: { allowedRoles: ['APPROVER', 'REQUESTER', 'JUDGE', 'ADMIN'] },
    loadComponent: () =>
      import('../components/case/case-retention-date/case-retention-date.component').then(
        (c) => c.CaseRetentionDateComponent
      ),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id',
    loadComponent: () => import('../components/hearing/hearing.component').then((c) => c.HearingComponent),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id/request-transcript',
    loadComponent: () =>
      import('../components/hearing/request-transcript/request-transcript.component').then(
        (c) => c.RequestTranscriptComponent
      ),
  },
  {
    path: 'case/:caseId/transcripts/:transcriptId',
    loadComponent: () =>
      import('../components/transcriptions/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'case/:caseId/hearing/:hearing_id/transcripts/:transcriptId',
    loadComponent: () =>
      import('../components/transcriptions/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'transcriptions/transcripts/:transcriptId',
    loadComponent: () =>
      import('../components/transcriptions/view-transcript/view-transcript.component').then(
        (c) => c.ViewTranscriptComponent
      ),
  },
  {
    path: 'transcriptions/approve-transcript/:transcriptId',
    data: { allowedRoles: ['APPROVER'] },
    loadComponent: () =>
      import('../components/transcriptions/approve-transcript/approve-transcript.component').then(
        (c) => c.ApproveTranscriptComponent
      ),
  },
];
