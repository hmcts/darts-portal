import { FormErrorMessages } from '@core-types/index';

export const ChangeTranscriptErrorMessages: FormErrorMessages = {
  reason: {
    required: 'Select a reason to mark this request as unfulfilled',
  },
  details: {
    required: 'Enter the reason for the unfulfilled request',
    maxlength: 'Details must be less than or equal to 200 characters',
  },
};
