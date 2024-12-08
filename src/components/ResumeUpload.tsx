import React from "react";
import { Upload, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { isValidFileType, isValidFileSize } from "../utils/validation";
import { ERROR_MESSAGES, ACCEPTED_FILE_TYPES } from "../constants";

interface ResumeUploadProps {
  onResumeUpload: (file: File) => void;
  currentFile: File | null;
}

export function ResumeUpload({
  onResumeUpload,
  currentFile,
}: ResumeUploadProps) {
  const [error, setError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    if (!isValidFileType(file)) {
      setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    if (!isValidFileSize(file)) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    onResumeUpload(file);
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onResumeUpload(null as any);
    setError("");
  };

  return (
    <Card>
      {!currentFile ? (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                <span>Upload your resume</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <Upload className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {currentFile.name}
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={handleRemoveFile}
            className="p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
