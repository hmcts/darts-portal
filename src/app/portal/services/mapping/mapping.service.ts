import { Injectable } from '@angular/core';
import { Transcript } from '@portal-types/transcriptions/transcript.type';
import { TranscriptsRow } from '@portal-types/transcriptions/transcripts-row.type';

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
}
