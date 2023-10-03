export interface UserAudioRequestRow {
    caseNumber: string;
    courthouse: string;
    hearingDate: string | null;
    startTime: string | null;
    endTime: string | null;
    requestId: number;
    expiry: string | null;
    status: "OPEN" | "PROCESSING" | "FAILED" | "COMPLETED"
}