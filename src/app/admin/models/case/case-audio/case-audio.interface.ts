export interface PaginatedCaseAudioData {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  data: CaseAudioData[];
}

export interface CaseAudioData {
  id: number;
  start_at: string;
  end_at: string;
  channel: number;
  courtroom: string;
}
