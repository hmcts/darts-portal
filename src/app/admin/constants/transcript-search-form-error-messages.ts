export const TranscriptSearchFormErrorMessages: Record<string, Record<string, string>> = {
  hearingDate: {
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. Hearing date must be in the past',
    realDate: 'Enter a real date',
  },
  specific: {
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. Requested date must be in the past',
    realDate: 'Enter a real date',
  },
  from: {
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. Requested start date must be in the past',
    realDate: 'Enter a real date',
    dateRange: 'The start date must be before the end date',
  },
  to: {
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. Requested end date must be in the past',
    realDate: 'Enter a real date',
    dateRange: 'The end date must be after the start date',
  },
  requestId: {
    min: 'Request ID must be greater than 0',
    max: 'Request ID must be less than 2147483648',
    pattern: 'Request ID must only contain numbers',
  },
<<<<<<< HEAD
  caseId: { maxlength: 'Case ID must be less than 33 characters' },
  owner: { maxlength: 'Owner must be less than 2001 characters' },
  requestedBy: { maxlength: 'Requested by must be less than 2001 characters' },
=======
  caseId: { maxlength: 'Case ID must be less than or equal to 32 characters' },
  owner: { maxlength: 'Owner must be less than or equal to 2000 characters' },
  requestedBy: { maxlength: 'Requested by must be less than or equal to 2000 characters' },
>>>>>>> master
};
