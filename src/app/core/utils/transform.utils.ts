// Convert 'true' or 'false' string to boolean
export const optionalStringToBooleanOrNull = (string?: string): boolean | null => {
  if (string === undefined) return null;
  else return string === 'true';
};
