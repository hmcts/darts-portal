export interface HearingData {
  id: number;
  date: string;
  courtroom: string;
  judges: string[];
  transcript_count?: number;
}
