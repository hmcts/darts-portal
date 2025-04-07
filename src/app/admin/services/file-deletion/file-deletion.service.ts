import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { AudioFileMarkedDeletionData } from '@admin-types/file-deletion/audio-file-marked-deletion.interface';
import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { FileHideData } from '@admin-types/hidden-reasons/file-hide-data.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MappingService } from '@services/mapping/mapping.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

const MEDIAS_BASE_PATH = '/api/admin/medias';
const TRANSCRIPTS_BASE_PATH = '/api/admin/transcription-documents';
const MARKED_FOR_DELETION_AUDIO_FILES_PATH = '/api/admin/medias/marked-for-deletion';

@Injectable({
  providedIn: 'root',
})
export class FileDeletionService {
  http = inject(HttpClient);
  userAdminService = inject(UserAdminService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  mappingService = inject(MappingService);

  getTranscriptionDocumentsMarkedForDeletion(): Observable<TranscriptionDocumentForDeletion[]> {
    return this.transcriptionAdminService
      .getTranscriptionsMarkedForDeletion()
      .pipe(switchMap((transcriptions) => this.resolveUsersAndReasons(transcriptions)));
  }

  getAudioFilesMarkedForDeletion(): Observable<AudioFileMarkedDeletion[]> {
    return this.http.get<AudioFileMarkedDeletionData[]>(MARKED_FOR_DELETION_AUDIO_FILES_PATH).pipe(
      map((data) => data.map((audioFile) => this.mapMarkedAudioFiles(audioFile))),
      switchMap((audioFiles) => this.resolveUsersAndReasons(audioFiles))
    );
  }

  approveAudioFileDeletion(mediaId: number): Observable<FileHide> {
    return this.http
      .post<FileHideData>(`${MEDIAS_BASE_PATH}/${mediaId}/approve-deletion`, {})
      .pipe(map((res) => this.mappingService.mapHideFileResponse(res)));
  }

  approveTranscriptFileDeletion(transcriptId: number): Observable<FileHide> {
    return this.http
      .post<FileHideData>(`${TRANSCRIPTS_BASE_PATH}/${transcriptId}/approve-deletion`, {})
      .pipe(map((res) => this.mappingService.mapHideFileResponse(res)));
  }

  private mapMarkedAudioFiles(audioFile: AudioFileMarkedDeletionData): AudioFileMarkedDeletion {
    return {
      media: audioFile.media.map((media) => ({
        id: media.id,
        channel: media.channel,
        totalChannels: media.total_channels,
        isCurrent: media.is_current,
        versionCount: media.version_count,
      })),
      startAt: DateTime.fromISO(audioFile.start_at),
      endAt: DateTime.fromISO(audioFile.end_at),
      courthouse: audioFile.courthouse.display_name,
      courtroom: audioFile.courtroom.name,
      hiddenById: audioFile.admin_action.hidden_by_id,
      comments: audioFile.admin_action.comments,
      ticketReference: audioFile.admin_action.ticket_reference,
      reasonId: audioFile.admin_action.reason_id,
    };
  }

  private resolveUsersAndReasons<T extends { hiddenById?: number; reasonId?: number }>(files: T[]): Observable<T[]> {
    const markedByName$ = this.mapHiddenByUsers(files);
    const reasonName$ = this.mapReasons(files);

    return forkJoin([markedByName$, reasonName$]).pipe(
      map(([markedByFiles, reasonFiles]) => {
        return files.map((file) => {
          const markedHiddenBy = file.hiddenById
            ? markedByFiles.find((f) => f.hiddenById === file.hiddenById)?.markedHiddenBy
            : undefined;

          const reasonName = file.reasonId
            ? reasonFiles.find((f) => f.reasonId === file.reasonId)?.reasonName
            : undefined;

          return {
            ...file,
            markedHiddenBy,
            reasonName,
          };
        });
      })
    );
  }

  private mapHiddenByUsers<T extends { hiddenById?: number }>(
    files: T[]
  ): Observable<(T & { markedHiddenBy: string })[]> {
    const userIds = [...new Set(files.map((file) => file.hiddenById).filter((id): id is number => id !== undefined))];

    return this.userAdminService.getUsersById(userIds).pipe(
      map((users) => {
        return files.map((file) => {
          const markedHiddenBy = file.hiddenById ? users.find((u) => u.id === file.hiddenById)?.fullName : undefined;
          return {
            ...file,
            markedHiddenBy: markedHiddenBy ?? 'System',
          };
        });
      })
    );
  }

  private mapReasons<T extends { reasonId?: number }>(files: T[]): Observable<(T & { reasonName: string })[]> {
    return this.transcriptionAdminService.getHiddenReasons().pipe(
      map((reasons) => {
        return files.map((file) => {
          const reasonName = file.reasonId ? reasons.find((r) => r.id === file.reasonId)?.displayName : undefined;
          return {
            ...file,
            reasonName: reasonName ?? 'Unknown',
          };
        });
      })
    );
  }
}
