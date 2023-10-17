export const validateFiles = (value: FileList) => {
  if (value.length < 1) return 'Files is required';
  return true;
};
