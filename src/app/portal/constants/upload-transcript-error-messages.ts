import { FormErrorMessages } from '@core-types/index';

export const UploadTranscriptErrorMessages: FormErrorMessages = {
  reason: {
    required: 'Select a reason to mark this request as unfulfilled',
  },
  details: {
    required: 'Enter the reason for the unfulfilled request',
    maxlength: 'Details must be less than or equal to 200 characters',
  },
  file: {
    required: 'You must upload a file to complete this request',
    maxFileSize: 'The selected file must be smaller than 10MB.',
  },
};
