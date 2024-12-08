import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

export const isValidFileType = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  return ACCEPTED_FILE_TYPES.some((type) => fileName.endsWith(type));
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
  return urls.filter((url) => isValidUrl(url.trim()));
};

export const isOneUrlPerLine = (text: string): boolean => {
  // Split by newlines and filter out empty lines
  const lines = text.split("\n").filter((line) => line.trim());

  // Check if any line contains multiple URLs
  return !lines.some((line) => {
    const trimmedLine = line.trim();
    // Look for common URL protocol indicators
    const urlCount = (trimmedLine.match(/https?:\/\//g) || []).length;
    return urlCount > 1;
  });
};
