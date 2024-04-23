export type TranscriptionSearchFormValues = Partial<{
  requestId: string | null;
  caseId: string | null;
  courthouse: string | null;
  hearingDate: string | null;
  owner: string | null;
  requestedBy: string | null;
  requestedDate: Partial<{
    type: string | null;
    specific: string | null;
    from: string | null;
    to: string | null;
  }>;
  requestMethod: string | null;
}>;
