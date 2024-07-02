export const AdminSearchFormErrorMessages = {
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
};
