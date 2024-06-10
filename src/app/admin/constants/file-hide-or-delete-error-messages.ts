import { FieldErrors } from '@core-types/index';

export const FileHideOrDeleteFormErrorMessages: FieldErrors = {
  reason: {
    required: 'Select a reason for hiding and/or deleting the file',
  },
  ticketReference: {
    required: 'Enter a ticket reference',
    maxlength: 'Ticket reference is too long. Enter a ticket reference shorter than 256 characters',
  },
  comments: {
    required: 'Provide details relating to this action',
    maxlength: 'Comment is too long. Enter a comment shorter than 256 characters',
  },
};
