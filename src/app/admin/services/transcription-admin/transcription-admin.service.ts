import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { FileHideData } from '@admin-types/hidden-reasons/file-hide-data.interface';
import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { HiddenReasonData } from '@admin-types/hidden-reasons/hidden-reason-data.interface';
import {
  SecurityGroup,
  SecurityGroupData,
  SecurityRoleData,
  Transcription,
  TranscriptionData,
  TranscriptionDocument,
  TranscriptionDocumentData,
  TranscriptionDocumentSearchResult,
  TranscriptionDocumentSearchResultData,
  TranscriptionSearchFormValues,
  TranscriptionSearchRequest,
  TranscriptionStatusData,
  UpdateTranscriptStatusRequest,
} from '@admin-types/index';
import { AssignedTo } from '@admin-types/transcription/transcription-assignee';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionAdminDetailsData } from '@admin-types/transcription/transcription-details-data.interface';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { TranscriptionWorkflowData } from '@admin-types/transcription/transcription-workflow-data.interface';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CourthouseData } from '@core-types/index';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';
import { GET_SECURITY_GROUPS_PATH } from '@services/courthouses/courthouses.service';
import { GET_SECURITY_ROLES_PATH } from '@services/groups/groups.service';
import { MappingService } from '@services/mapping/mapping.service';
import { DateTime } from 'luxon';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { TranscriptionStatus } from './../../models/transcription/transcription-status';

export const defaultFormValues = {
  requestId: '',
  caseId: '',
  courthouse: '',
  hearingDate: '',
  owner: '',
  requestedBy: '',
  requestedDate: {
    type: '',
    specific: '',
    from: '',
    to: '',
  },
  requestMethod: '',
};

@Injectable({
  providedIn: 'root',
})
export class TranscriptionAdminService {
  luxonPipe = inject(LuxonDatePipe);
  http = inject(HttpClient);
  mapping = inject(MappingService);

  searchResults = signal<Transcription[] | null>(null);
  completedSearchResults = signal<TranscriptionDocumentSearchResult[] | null>(null);
  searchFormValues = signal<TranscriptionSearchFormValues>(defaultFormValues);
  isAdvancedSearch = signal(false);
  hasSearchFormBeenSubmitted$ = new BehaviorSubject<boolean>(false);
  tab = signal<string>('Requests');

  search(formValues: TranscriptionSearchFormValues): Observable<Transcription[]> {
    const body = this.mapSearchFormValuesToSearchRequest(formValues);
    return this.http
      .post<TranscriptionData[]>('api/admin/transcriptions/search', body)
      .pipe(map((res) => this.mapTranscriptionDataToTranscription(res)));
  }

  getTranscriptionStatuses(): Observable<TranscriptionStatus[]> {
    return this.http
      .get<TranscriptionStatusData[]>('api/admin/transcription-status')
      .pipe(map((res) => this.mapTransctiptionStatusDataToTranscriptionStatus(res)));
  }

  getAllowableTranscriptionStatuses(status: TranscriptStatus, isManual: boolean): Observable<TranscriptionStatus[]> {
    const allowableStatusMap: Record<TranscriptStatus, TranscriptStatus[]> = {
      Requested: ['Closed'],
      'Awaiting Authorisation': isManual ? ['Requested', 'Closed'] : [],
      Approved: ['Closed'],
      Rejected: [],
      'With Transcriber': isManual ? ['Approved', 'Closed'] : ['Approved', 'Closed', 'Complete'],
      Complete: [],
      Closed: [],
    };

    return this.getTranscriptionStatuses().pipe(
      map((statuses) => statuses.filter((s) => allowableStatusMap[status].includes(s.type)))
    );
  }

  getTranscriptionDetails(transcriptId: number): Observable<TranscriptionAdminDetails> {
    return this.http
      .get<TranscriptionAdminDetailsData>(`api/transcriptions/${transcriptId}`)
      .pipe(map((t) => this.mapTranscriptionDetails(t)));
  }

  getLatestTranscriptionWorkflowActor(transcriptionId: number, current: boolean = false): Observable<number> {
    return this.getTranscriptionWorkflows(transcriptionId, current).pipe(
      map((workflows) => {
        const latestWorkflow = workflows.reduce(
          (latest, current) => (current.workflowTimestamp > latest.workflowTimestamp ? current : latest),
          workflows[0]
        );
        return latestWorkflow.workflowActor;
      })
    );
  }

  getTranscriberRoleId(): Observable<number | undefined> {
    return this.http.get<SecurityRoleData[]>(GET_SECURITY_ROLES_PATH).pipe(
      map((roles) => {
        const transcriberRole = roles.find((role) => role.role_name === 'TRANSCRIBER');
        return transcriberRole?.id;
      })
    );
  }

  getTranscriptionSecurityGroups(courthouseId: number): Observable<SecurityGroup[] | null> {
    return this.getTranscriberRoleId().pipe(
      switchMap((roleId) => {
        if (!roleId) {
          return of(null);
        } else {
          const params = new HttpParams()
            .set('role_id', roleId.toString())
            .set('courthouse_id', courthouseId ? courthouseId.toString() : '');
          return this.http
            .get<SecurityGroupData[]>(`${GET_SECURITY_GROUPS_PATH}`, { params })
            .pipe(map((data) => this.mapSecurityGroupData(data)));
        }
      })
    );
  }

  getTranscriptionWorkflows(transcriptionId: number, current: boolean = false): Observable<TranscriptionWorkflow[]> {
    const params = new HttpParams()
      .set('is_current', current.toString())
      .set('transcription_id', transcriptionId.toString());

    return this.http
      .get<TranscriptionWorkflowData[]>(`api/admin/transcription-workflows`, { params })
      .pipe(map(this.mapTranscriptionWorkflows));
  }

  updateTranscriptionStatus(
    transcriptId: number,
    statusId: number,
    comments: string | null
  ): Observable<HttpResponse<void>> {
    const body: UpdateTranscriptStatusRequest = {
      transcription_status_id: statusId,
      workflow_comment: comments,
    };
    return this.http.patch<void>(`api/admin/transcriptions/${transcriptId}`, body, { observe: 'response' });
  }

  getTranscriptiptionRequests(userId: number, requestedAtFrom?: string): Observable<Transcription[]> {
    return this.http
      .get<TranscriptionData[]>(
        `api/admin/transcriptions`,
        requestedAtFrom
          ? {
              params: { user_id: userId, requested_at_from: requestedAtFrom },
            }
          : {
              params: { user_id: userId },
            }
      )
      .pipe(map(this.mapTranscriptionDataToTranscription));
  }

  searchCompletedTranscriptions(
    formValues: TranscriptionSearchFormValues
  ): Observable<TranscriptionDocumentSearchResult[]> {
    const body = this.mapSearchFormValuesToSearchRequest(formValues, true);
    return this.http
      .post<TranscriptionDocumentSearchResultData[]>('api/admin/transcription-documents/search', body)
      .pipe(map((res) => this.mapCompletedTranscriptSearchResults(res)));
  }

  getTranscriptionDocument(id: number): Observable<TranscriptionDocument> {
    return this.http
      .get<TranscriptionDocumentData>(`api/admin/transcription-documents/${id}`)
      .pipe(map((res) => this.mapTranscriptionDocument(res)));
  }

  hideTranscriptionDocument(id: number, formValues: FileHideOrDeleteFormValues): Observable<FileHide> {
    const body = this.mapHidePostRequest(formValues);

    return this.http
      .post<FileHideData>(`api/admin/transcription-documents/${id}/hide`, body)
      .pipe(map((res) => this.mapHideFileResponse(res)));
  }

  unhideTranscriptionDocument(id: number): Observable<FileHide> {
    return this.http
      .post<FileHideData>(`api/admin/transcription-documents/${id}/hide`, { is_hidden: false })
      .pipe(map((res) => this.mapHideFileResponse(res)));
  }

  private mapHideFileResponse(res: FileHideData): FileHide {
    return {
      id: res.id,
      isHidden: res.is_hidden,
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

  private mapHidePostRequest(body: FileHideOrDeleteFormValues) {
    //TBD in future, deleting audio files
    return {
      is_hidden: true,
      admin_action: {
        reason_id: body.reason,
        ticket_reference: body.ticketReference,
        comments: body.comments,
      },
    };
  }

  /**
   *  Gets the reasons for hiding a transcription document or media file
   */
  getHiddenReasons(): Observable<HiddenReason[]> {
    return this.http.get<HiddenReasonData[]>('api/admin/hidden-reasons').pipe(map((res) => this.mapHiddenReasons(res)));
  }

  getHiddenReason(id: number): Observable<HiddenReason | undefined> {
    return this.getHiddenReasons().pipe(map((reasons) => reasons.find((reason) => reason.id === id)));
  }

  private mapHiddenReasons(data: HiddenReasonData[]): HiddenReason[] {
    return data.map((reason) => ({
      id: reason.id,
      reason: reason.reason,
      displayName: reason.display_name,
      displayState: reason.display_state,
      displayOrder: reason.display_order,
      markedForDeletion: reason.marked_for_deletion,
    }));
  }

  private mapTranscriptionDocument(res: TranscriptionDocumentData): TranscriptionDocument {
    return {
      transcriptionDocumentId: res.transcription_document_id,
      transcriptionId: res.transcription_id,
      fileType: res.file_type,
      fileName: res.file_name,
      fileSizeBytes: res.file_size_bytes,
      uploadedAt: DateTime.fromISO(res.uploaded_at),
      uploadedBy: res.uploaded_by,
      isHidden: res.is_hidden,
      retainUntil: DateTime.fromISO(res.retain_until),
      contentObjectId: res.content_object_id,
      checksum: res.checksum,
      clipId: res.clip_id,
      lastModifiedAt: DateTime.fromISO(res.last_modified_at),
      lastModifiedBy: res.last_modified_by,
      ...(res.admin_action && {
        adminAction: {
          id: res.admin_action.id,
          reasonId: res.admin_action.reason_id,
          hiddenById: res.admin_action.hidden_by_id,
          hiddenAt: DateTime.fromISO(res.admin_action.hidden_at),
          isMarkedForManualDeletion: res.admin_action.is_marked_for_manual_deletion,
          markedForManualDeletionById: res.admin_action.marked_for_manual_deletion_by_id,
          markedForManualDeletionAt: DateTime.fromISO(res.admin_action.marked_for_manual_deletion_at),
          ticketReference: res.admin_action.ticket_reference,
          comments: res.admin_action.comments,
        },
      }),
    };
  }

  private mapCompletedTranscriptSearchResults(
    data: TranscriptionDocumentSearchResultData[]
  ): TranscriptionDocumentSearchResult[] {
    return data.map((transcriptionDocumentData) => ({
      transcriptionDocumentId: transcriptionDocumentData.transcription_document_id,
      transcriptionId: transcriptionDocumentData.transcription_id,
      ...(transcriptionDocumentData.case && {
        case: {
          id: transcriptionDocumentData.case.id,
          caseNumber: transcriptionDocumentData.case.case_number,
        },
      }),
      ...(transcriptionDocumentData.courthouse && {
        courthouse: {
          id: transcriptionDocumentData.courthouse.id,
          displayName: transcriptionDocumentData.courthouse.display_name,
        },
      }),
      ...(transcriptionDocumentData.hearing && {
        hearing: {
          id: transcriptionDocumentData.hearing.id,
          hearingDate: DateTime.fromISO(transcriptionDocumentData.hearing.hearing_date),
        },
      }),
      isManualTranscription: transcriptionDocumentData.is_manual_transcription,
      isHidden: transcriptionDocumentData.is_hidden,
    }));
  }

  private mapTranscriptionWorkflows(data: TranscriptionWorkflowData[]): TranscriptionWorkflow[] {
    return data.map((workflow) => ({
      workflowActor: workflow.workflow_actor,
      statusId: workflow.status_id,
      workflowTimestamp: DateTime.fromISO(workflow.workflow_ts),
      comments: workflow.comments.map((c) => ({
        comment: c.comment,
        commentedAt: DateTime.fromISO(c.commented_at),
        authorId: c.author_id,
      })),
    }));
  }

  private mapTranscriptionDataToTranscription(data: TranscriptionData[]): Transcription[] {
    return data.map((transcriptionData) => ({
      id: transcriptionData.transcription_id,
      caseNumber: transcriptionData.case_number,
      courthouse: { id: transcriptionData.courthouse_id },
      hearingDate: DateTime.fromISO(transcriptionData.hearing_date),
      requestedAt: DateTime.fromISO(transcriptionData.requested_at),
      status: { id: transcriptionData.transcription_status_id },
      isManual: transcriptionData.is_manual_transcription,
    }));
  }

  private mapSecurityGroupData(data: SecurityGroupData[]): SecurityGroup[] {
    return data.map((item: SecurityGroupData) => ({
      id: item.id,
      name: item.name,
      displayName: item.display_name,
      description: item.description,
      displayState: item.display_state,
      globalAccess: item.global_access,
      securityRoleId: item.security_role_id,
      courthouseIds: item.courthouse_ids,
      userIds: item.user_ids,
    }));
  }

  private mapSearchFormValuesToSearchRequest(
    values: TranscriptionSearchFormValues,
    isCompletedSearch = false
  ): TranscriptionSearchRequest {
    return {
      //Omit transcription_id completely on completed transcript search
      ...(isCompletedSearch
        ? {}
        : {
            transcription_id:
              !isCompletedSearch && (values.requestId || values.requestId === '0') ? Number(values.requestId) : null,
          }),
      case_number: values.caseId || null,
      courthouse_display_name: values.courthouse || null,
      hearing_date: this.formatDate(values.hearingDate),
      owner: values.owner || null,
      requested_by: values.requestedBy || null,
      requested_at_from: this.formatDate(values.requestedDate?.specific) ?? this.formatDate(values.requestedDate?.from),
      requested_at_to: this.formatDate(values.requestedDate?.specific) ?? this.formatDate(values.requestedDate?.to),
      is_manual_transcription:
        values.requestMethod === 'all' || !values.requestMethod
          ? null
          : values.requestMethod === 'manual'
            ? true
            : false,
    };
  }

  private mapTransctiptionStatusDataToTranscriptionStatus(data: TranscriptionStatusData[]): TranscriptionStatus[] {
    return data.map((status) => ({ id: status.id, type: status.type, displayName: status.display_name }));
  }

  getCurrentStatusFromTranscript(transcript: TranscriptionAdminDetails) {
    const processGroups = (groups: SecurityGroup[] | undefined, status = '') => {
      if (status === 'Awaiting Authorisation' || status === 'Requested') return null;

      return groups && groups.length > 0
        ? groups
            .filter((group) => group.displayName || group.name)
            .map((group) => ({
              href: `/admin/groups/${group.id}`,
              value: group.displayName || group.name,
            }))
        : null;
    };

    const processStatus = (status: string | undefined) => {
      const changeStatuses = ['Awaiting Authorisation', 'With Transcriber', 'Requested', 'Approved'];
      return status
        ? changeStatuses.includes(status)
          ? {
              value: status,
              action: {
                text: 'Change status',
                url: `/admin/transcripts/${transcript.transcriptionId}/change-status`,
                queryParams: { manual: transcript.isManual, status },
              },
            }
          : { value: status }
        : null;
    };

    const processAssignedTo = (assignedTo: AssignedTo | undefined) =>
      assignedTo?.userId
        ? [
            {
              href: `/admin/users/${assignedTo.userId}`,
              value: assignedTo.fullName,
              caption: assignedTo.email,
            },
          ]
        : 'Unassigned';

    return {
      Status: processStatus(transcript.status),
      'Assigned to': processAssignedTo(transcript.assignedTo),
      'Associated groups': processGroups(transcript.assignedGroups, transcript.status),
    };
  }

  getRequestDetailsFromTranscript(transcript: TranscriptionAdminDetails) {
    return {
      'Hearing date': this.luxonPipe.transform(transcript.hearingDate, 'dd MMM yyyy'),
      'Request type': transcript.requestType,
      'Request method': transcript.isManual ? 'Manual' : 'Automated',
      'Request ID': transcript.transcriptionId,
      Urgency: transcript.urgency?.description ? transcript.urgency.description : null,
      'Audio for transcript':
        transcript.transcriptionStartTs && transcript.transcriptionEndTs
          ? 'Start time ' +
            this.luxonPipe.transform(transcript.transcriptionStartTs, 'HH:mm:ss') +
            ' - End time ' +
            this.luxonPipe.transform(transcript.transcriptionEndTs, 'HH:mm:ss')
          : '',
      'Requested by': [
        {
          href: `/admin/users/${transcript.requestor?.userId}`,
          value: transcript.requestor?.fullName,
          caption: transcript.requestor?.email,
        },
      ],
      Received: this.luxonPipe.transform(transcript.received, 'dd MMM yyyy HH:mm:ss'),
      Instructions: transcript.requestorComments,
      'Judge approval': 'Yes',
    };
  }

  private mapTranscriptionDetails(transcription: TranscriptionAdminDetailsData): TranscriptionAdminDetails {
    const baseDetails = this.mapping.mapBaseTranscriptionDetails(transcription);
    return {
      ...baseDetails,
      requestor: {
        fullName: transcription.requestor?.user_full_name,
        userId: transcription.requestor?.user_id,
      },
    };
  }

  private formatDate(date: string | null | undefined): string | null {
    return date ? date.split('/').reverse().join('-') : null;
  }

  mapResults(
    results: Transcription[],
    courthouses: CourthouseData[],
    statuses: TranscriptionStatus[]
  ): Transcription[] {
    return results.map((result) => {
      const courthouse = courthouses.find((c) => c.id === result.courthouse.id);
      const status = statuses.find((s) => s.id === result.status.id);
      return {
        ...result,
        courthouse: {
          id: courthouse?.id,
          displayName: courthouse?.display_name,
          courthouseName: courthouse?.courthouse_name,
        },
        status: {
          id: status?.id,
          type: status?.type,
          displayName: status?.displayName,
        },
      };
    });
  }
}
