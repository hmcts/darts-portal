import { FormErrorMessages } from '@core-types/index';

export const maxBatchSize = 2147483647;

export const AutomatedTaskEditFormErrorMessages: FormErrorMessages = {
  batchSize: {
    required: 'Batch size must be set',
    min: 'Batch size must be greater than 0',
    max: `Batch size must be less than ${maxBatchSize}`,
    pattern: 'Batch size must be an integer',
  },
  date: {
    required: 'You must include a date',
    pattern: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
  },
  time: {
    required: 'You must include a time',
    pattern: 'Enter a time in the correct format (for example 15:11:11)',
    maxlength: 'Enter a time in the correct format (for example 15:11:11)',
    minlength: 'Enter a time in the correct format (for example 15:11:11)',
    invalidTime: 'Enter a time in the correct format (for example 15:11:11)',
  },
};
