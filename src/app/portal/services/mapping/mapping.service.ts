import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { FileHideData } from '@admin-types/hidden-reasons/file-hide-data.interface';
import { Injectable } from '@angular/core';
import { Annotations, AnnotationsData } from '@portal-types/annotations';
import {
  Transcript,
  TranscriptionDetails,
  TranscriptionDetailsData,
  TranscriptsRow,
} from '@portal-types/transcriptions';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  mapTranscriptRequestToRows(transcripts: Transcript[]): TranscriptsRow[] {
    return transcripts.map((transcript) => {
      return {
        id: transcript.id,
        hearingDate: transcript.hearingDate,
        type: transcript.type,
        requestedOn: transcript.requestedOn,
        requestedBy: transcript.requestedByName,
        status: transcript.status,
      };
    });
  }

  mapAnnotationsDataToAnnotations(annotationsData: AnnotationsData[]): Annotations[] {
    return annotationsData.flatMap((x) =>
      x.annotation_documents.map((a) => ({
        annotationId: x.annotation_id,
        hearingId: x.hearing_id,
        hearingDate: DateTime.fromISO(x.hearing_date),
        annotationTs: DateTime.fromISO(x.annotation_ts),
        annotationText: x.annotation_text,
        annotationDocumentId: a.annotation_document_id,
        fileName: a.file_name,
        fileType: a.file_type,
        uploadedBy: a.uploaded_by,
        uploadedTs: DateTime.fromISO(a.uploaded_ts),
      }))
    );
  }

  mapBaseTranscriptionDetails(transcription: TranscriptionDetailsData): TranscriptionDetails {
    return {
      caseReportingRestrictions: transcription.case_reporting_restrictions,
      caseId: transcription.case_id,
      caseNumber: transcription.case_number,
      courthouse: transcription.courthouse,
      courtroom: transcription.courtroom,
      status: transcription.status,
      from: transcription.requestor?.user_full_name,
      received: transcription.received ? DateTime.fromISO(transcription.received) : undefined,
      requestorComments: transcription.requestor_comments,
      rejectionReason: transcription.rejection_reason,
      defendants: transcription.defendants,
      judges: transcription.judges,
      transcriptFileName: transcription.transcript_file_name ?? 'Document not found',
      hearingDate: DateTime.fromISO(transcription.hearing_date),
      urgency: transcription.transcription_urgency,
      requestType: transcription.request_type,
      transcriptionId: transcription.transcription_id,
      transcriptionStartTs: transcription.transcription_start_ts
        ? DateTime.fromISO(transcription.transcription_start_ts)
        : undefined,
      transcriptionEndTs: transcription.transcription_end_ts
        ? DateTime.fromISO(transcription.transcription_end_ts)
        : undefined,
      transcriptionObjectId: transcription.transcription_object_id,
      isManual: transcription.is_manual,
      hearingId: transcription.hearing_id,
      courthouseId: transcription.courthouse_id,
      isRemovedFromUserTranscripts: transcription.hide_request_from_requestor,
    };
  }

  mapHideFileResponse(res: FileHideData): FileHide {
    return {
      id: res.id,
      isHidden: res.is_hidden,
      isDeleted: res.is_deleted,
      adminAction: res.admin_action
        ? {
            id: res.admin_action.id,
            reasonId: res.admin_action.reason_id,
            hiddenById: res.admin_action.hidden_by_id,
            hiddenAt: DateTime.fromISO(res.admin_action.hidden_at),
            isMarkedForManualDeletion: res.admin_action.is_marked_for_manual_deletion,
            markedForManualDeletionById: res.admin_action.marked_for_manual_deletion_by_id,
            markedForManualDeletionAt: DateTime.fromISO(res.admin_action.marked_for_manual_deletion_at),
            ticketReference: res.admin_action.ticket_reference,
            comments: res.admin_action.comments,
          }
        : undefined,
    };
  }
}
