import { FormErrorMessages } from '@core-types/index';

export const CaseSearchFormErrorMessages: FormErrorMessages = {
  courthouse: {
    required: 'You must also enter a courthouse',
  },
  courtroom: {
    maxlength: 'Courtroom must be less than or equal to 64 characters',
  },
  specific: {
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. The hearing date must be in the past',
  },
  from: {
    required: 'You have not selected a start date. Select a start date to define your search',
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. The hearing date must be in the past',
    dateRange: 'The start date must be before the end date',
  },
  to: {
    required: 'You have not selected an end date. Select an end date to define your search',
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
    futureDate: 'You have selected a date in the future. The hearing date must be in the past',
    dateRange: 'The end date must be after the start date',
  },
  judgeName: {
    maxlength: `Judge's name must be less than or equal to 2000 characters`,
  },
  defendantName: {
    maxlength: `Defendant's name must be less than or equal to 2000 characters`,
  },
  eventTextContains: {
    minlength: 'Keywords must be greater than or equal to 3 characters',
    maxlength: 'Keywords must be less than or equal to 2000 characters',
  },
};
