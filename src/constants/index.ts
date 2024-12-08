export const ACCEPTED_FILE_TYPES = [".pdf", ".docx"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ANIMATION_DURATION = 300;
export const API_TIMEOUT = 30000; // 30 seconds

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "File size exceeds 10MB limit",
  INVALID_FILE_TYPE:
    "Invalid file type. Please upload a PDF, DOC, or DOCX file",
  NO_JOBS_PROVIDED: "Please provide at least one job URL",
  INVALID_URLS: "One or more URLs are invalid",
  API_TIMEOUT: "Request timed out. Please try again",
  GENERIC_ERROR: "An error occurred. Please try again",
};
