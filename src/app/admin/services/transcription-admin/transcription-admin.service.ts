import {
  SecurityGroup,
  SecurityGroupData,
  SecurityRoleData,
  Transcription,
  TranscriptionData,
  TranscriptionSearchFormValues,
  TranscriptionSearchRequest,
  TranscriptionStatusData,
  UpdateTranscriptStatusRequest,
} from '@admin-types/index';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionAdminDetailsData } from '@admin-types/transcription/transcription-details-data.interface';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { TranscriptionWorkflowData } from '@admin-types/transcription/transcription-workflow-data.interface';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';
import { GET_SECURITY_GROUPS_PATH } from '@services/courthouses/courthouses.service';
import { GET_SECURITY_ROLES_PATH } from '@services/groups/groups.service';
import { MappingService } from '@services/mapping/mapping.service';
import { DateTime } from 'luxon';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { TranscriptionStatus } from './../../models/transcription/transcription-status';

@Injectable({
  providedIn: 'root',
})
export class TranscriptionAdminService {
  luxonPipe = inject(LuxonDatePipe);
  http = inject(HttpClient);
  mapping = inject(MappingService);

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
      .set('current', current.toString())
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

  private mapSearchFormValuesToSearchRequest(values: TranscriptionSearchFormValues): TranscriptionSearchRequest {
    return {
      transcription_id: values.requestId || values.requestId === '0' ? Number(values.requestId) : null,
      case_number: values.caseId || null,
      courthouse_display_name: values.courthouse || null,
      hearing_date: values.hearingDate || null,
      owner: values.owner || null,
      requested_by: values.requestedBy || null,
      requested_at_from: values.requestedDate?.from || null,
      requested_at_to: values.requestedDate?.to || null,
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
    const associatedGroups = transcript.assignedGroups?.map((group) => ({
      href: `/admin/groups/${group.id}`,
      value: group.displayName,
    }));

    const changeStatuses = ['Awaiting Authorisation', 'With Transcriber'];
    const statusData =
      changeStatuses.indexOf(transcript.status!) !== -1
        ? {
            value: transcript.status,
            action: {
              text: 'Change status',
              url: `/admin/transcripts/${transcript.transcriptionId}/change-status`,
              queryParams: { manual: transcript.isManual, status: transcript.status },
            },
          }
        : { value: transcript.status };

    return {
      Status: statusData,
      'Assigned to': [
        {
          href: `/admin/users/${transcript.assignedTo?.userId}`,
          value: transcript.assignedTo?.fullName,
          caption: transcript.assignedTo?.email,
        },
      ],
      'Associated groups': associatedGroups,
    };
  }

  getRequestDetailsFromTranscript(transcript: TranscriptionAdminDetails) {
    return {
      'Hearing date': this.luxonPipe.transform(transcript.hearingDate, 'dd MMM yyyy'),
      'Request type': transcript.requestType,
      'Request method': transcript.isManual ? 'Manual' : 'Automated',
      'Request ID': transcript.transcriptionId,
      Urgency: transcript.urgency.description,
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
}