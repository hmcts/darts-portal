import { FormErrorMessages } from '@core-types/index';

export const EventMappingFormErrorMessages: FormErrorMessages = {
  type: {
    required: 'Enter the event type',
    unique: 'The combination of event type and subtype should be unique',
    maxlength: 'Enter a description shorter than 256 characters',
  },
  subType: {
    unique: 'The combination of event type and subtype should be unique',
    maxlength: 'Enter a description shorter than 256 characters',
  },
  eventName: {
    required: 'Enter the event name',
    maxlength: 'Enter a description shorter than 256 characters',
  },
  eventHandler: {
    required: 'Select an event handler to map to',
  },
};
