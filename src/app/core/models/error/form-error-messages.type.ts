export interface FormErrorMessages {
  [controlName: string]: {
    [errorType: string]: string;
  };
}
