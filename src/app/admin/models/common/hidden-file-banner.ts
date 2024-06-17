export type HiddenFileBanner = {
  id: number;
  isHidden: boolean;
  isMarkedForManualDeletion: boolean;
  markedForManualDeletionBy: string;
  hiddenByName: string;
  hiddenReason: string;
  ticketReference: string;
  comments: string;
  fileType: 'audio_file' | 'transcription_document';
};
