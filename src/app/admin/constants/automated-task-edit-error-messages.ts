import { FormErrorMessages } from '@core-types/index';

export const maxIntegerSize = 2147483647;

export const AutomatedTaskEditFormErrorMessages: FormErrorMessages = {
  batchSize: {
    required: 'Batch size must be set',
    min: 'Batch size must be greater than 0',
    max: `Batch size must be less than ${maxIntegerSize}`,
    pattern: 'Batch size must be an integer',
  },
  rpoCsvStartHour: {
    required: 'RPO CSV start hour must be set',
    min: 'RPO CSV start hour must be greater than 0',
    max: `RPO CSV start hour must be less than ${maxIntegerSize}`,
    pattern: 'RPO CSV start hour must be an integer',
  },
  rpoCsvEndHour: {
    required: 'RPO CSV end hour must be set',
    min: 'RPO CSV end hour must be greater than 0',
    max: `RPO CSV end hour must be less than ${maxIntegerSize}`,
    pattern: 'RPO CSV end hour must be an integer',
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
