import { AbstractControl, ValidationErrors } from '@angular/forms';

export const futureDateValidator = (control: AbstractControl): ValidationErrors | null => {
  const dateValue = control.value;

  if (!dateValue) {
    return null; // Don't perform validation if the field is empty
  }

  // Split the input date string into day, month, and year components
  const dateParts = dateValue.split('/');
  if (dateParts.length !== 3) {
    return { invalidDate: true };
  }

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);

  // Create a Date object using the parsed components
  const inputDate = new Date(year, month - 1, day); // Subtract 1 from month since months are zero-based

  const currentDate = new Date();

  if (inputDate > currentDate) {
    return { futureDate: true };
  }
  return null;
};
