export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts[parts.length - 1];
};
