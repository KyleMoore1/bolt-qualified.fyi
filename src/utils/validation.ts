import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';

export const isValidFileType = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  return ACCEPTED_FILE_TYPES.some(type => fileName.endsWith(type));
};

export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateUrls = (urls: string[]): string[] => {
  return urls.filter(url => isValidUrl(url.trim()));
};