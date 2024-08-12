import { FormErrorMessages } from '@core-types/index';

export const RetentionPolicyFormErrorMessages: FormErrorMessages = {
  displayName: {
    required: 'Enter a display name',
    unique: 'Enter a unique display name',
  },
  name: {
    required: 'Enter a name',
    unique: 'Enter a unique name',
  },
  description: {
    maxlength: 'Enter a description shorter than 256 characters',
  },
  fixedPolicyKey: {
    required: 'Enter a fixed policy key',
    unique: 'The fixed policy key entered already exists in the database. Fixed policy keys must be unique',
  },
  duration: {
    minimumDuration: 'Enter a duration of at least 1 day',
  },
  startDate: {
    required: 'Enter a policy start date',
    pastDate: 'Enter a policy start date in the future',
    priorRevisionDate: 'Enter a policy start date that is not used in another version of this policy',
    pattern: 'Enter start date in dd/mm/yyyy format',
  },
  startTime: {
    required: 'Enter a start time',
    pattern: 'Enter the start time as numbers',
    maxlength: 'Enter the start time as numbers',
    minlength: 'Enter the start time as numbers',
    invalidTime: 'Enter the start time as numbers',
    pastDateTime: 'Enter a policy start time in the future',
  },
};
