import { AudioFileMarkedDeletionData } from '@admin-types/file-deletion/audio-file-marked-deletion.interface';
import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { FileHideData } from '@admin-types/hidden-reasons/file-hide-data.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';

const MEDIAS_BASE_PATH = '/api/admin/medias';
const MARKED_FOR_DELETION_AUDIO_FILES_PATH = '/api/admin/medias/marked-for-deletion';

@Injectable({
  providedIn: 'root',
})
export class FileDeletionService {
  constructor(
    private readonly http: HttpClient,
    private readonly userAdminService: UserAdminService,
    private readonly transcriptionAdminService: TranscriptionAdminService
  ) {}

  getAudioFilesMarkedForDeletion(): Observable<AudioFileMarkedDeletion[]> {
    return this.http.get<AudioFileMarkedDeletionData[]>(MARKED_FOR_DELETION_AUDIO_FILES_PATH).pipe(
      map((data) => data.map((audioFile) => this.mapMarkedAudioFiles(audioFile))),
      mergeMap((audioFiles) => {
        const markedByName$ = this.mapMarkedByName(audioFiles);
        const reasonName$ = this.mapReasonName(audioFiles);

        return forkJoin([markedByName$, reasonName$]).pipe(
          map(([markedByName, reasonName]) => {
            return audioFiles.map((audioFile) => {
              const markedFile = markedByName.find((file) => file.mediaId === audioFile.mediaId);
              const reasonFile = reasonName.find((file) => file.mediaId === audioFile.mediaId);

              return {
                ...audioFile,
                markedByName: markedFile?.markedByName,
                reasonName: reasonFile?.reasonName,
              };
            });
          })
        );
      })
    );
  }

  approveAudioFileDeletion(mediaId: number): Observable<FileHide> {
    return this.http
      .post<FileHideData>(`${MEDIAS_BASE_PATH}/${mediaId}/approve-deletion`, {})
      .pipe(map((res) => this.mapDeletedFileResponse(res)));
  }

  private mapMarkedByName(audioFiles: AudioFileMarkedDeletion[]): Observable<AudioFileMarkedDeletion[]> {
    const userIds = [...new Set(audioFiles.map((audioFile) => audioFile.markedById))] as number[];

    return this.userAdminService.getUsersById(userIds).pipe(
      map((users) => {
        return audioFiles.map((audioFile) => {
          const markDeletedBy = users.find((u) => u.id == audioFile?.markedById);

          return {
            ...audioFile,
            markedByName: markDeletedBy?.fullName,
          };
        });
      })
    );
  }

  private mapReasonName(audioFiles: AudioFileMarkedDeletion[]): Observable<AudioFileMarkedDeletion[]> {
    return this.transcriptionAdminService.getHiddenReasons().pipe(
      map((reasons) => {
        return audioFiles.map((audioFile) => {
          const hiddenReasonObj = reasons.find((u) => u.id == audioFile?.reasonId);

          return {
            ...audioFile,
            reasonName: hiddenReasonObj?.displayName,
          };
        });
      })
    );
  }

  private mapDeletedFileResponse(res: FileHideData): FileHide {
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

  mapMarkedAudioFiles(audioFile: AudioFileMarkedDeletionData): AudioFileMarkedDeletion {
    return {
      mediaId: audioFile.media_id,
      channel: audioFile.channel,
      startAt: DateTime.fromISO(audioFile.start_at),
      endAt: DateTime.fromISO(audioFile.end_at),
      courthouse: audioFile.courthouse.display_name,
      courtroom: audioFile.courtroom.name,
      markedById: audioFile.admin_action.marked_for_manual_deletion_by_id,
      comments: audioFile.admin_action.comments,
      ticketReference: audioFile.admin_action.ticket_reference,
      reasonId: audioFile.admin_action.reason_id,
    };
  }
}
