import { Injectable } from '@angular/core';
import { Transcript } from '@darts-types/transcript.interface';
import { TranscriptsRow } from '@darts-types/transcripts-row.interface';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  mapTranscriptRequestToRows(transcripts: Transcript[]): TranscriptsRow[] {
    return transcripts.map((transcript) => {
      return {
        tra_id: transcript.tra_id,
        hearingDate: transcript.hearing_date,
        type: transcript.type,
        requestedOn: transcript.requested_on,
        requestedBy: transcript.requested_by_name,
        status: transcript.status,
      };
    });
  }
}
