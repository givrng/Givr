import { useId, useRef, useState } from "react";
import { MEDIA_RULES, PURPOSE_KIND, UploadError, useMediaUpload, type MediaPurpose, type UploaderRole } from "./hooks/useMediaUpload";

type CloudinaryUploadProps = {
  /** Which account's signature endpoint signs the upload */
  role: UploaderRole;
  /** What the file is for. Decides the folder, allowed formats and image vs video on the backend */
  purpose: MediaPurpose;
  onUploadSuccess: (url: string, publicId: string) => void;
  buttonText?: string;
  disabled?: boolean;
  className?: string;
  max_size_MB?: number;
};

/**
 * Upload button backed by signed, direct-to-Cloudinary uploads (see useMediaUpload).
 * Phones offer camera capture automatically through the native file picker.
 */
export const CloudinaryUpload = ({
  role,
  purpose,
  onUploadSuccess,
  buttonText = PURPOSE_KIND[purpose] === "video" ? "Upload Video" : "Upload Image",
  disabled = false,
  className = "",
  max_size_MB,
}: CloudinaryUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const { upload, cancel, progress, isUploading } = useMediaUpload(role);
  const [error, setError] = useState("");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still triggers a change
    event.target.value = "";
    if (!file) return;

    setError("");
    try {
      const { secureUrl, publicId } = await upload(file, purpose, max_size_MB);
      onUploadSuccess(secureUrl, publicId);
    } catch (err) {
      setError(err instanceof UploadError ? err.message : "Upload failed. Please try again.");
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={Object.keys(MEDIA_RULES[PURPOSE_KIND[purpose]].mimeTypes).join(",")}
        className="hidden"
        onChange={handleFile}
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
          aria-describedby={error ? errorId : undefined}
          className={`px-4 py-2 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 ${className}`}
        >
          {isUploading ? `Uploading… ${progress ?? 0}%` : buttonText}
        </button>
        {isUploading && (
          <button type="button" onClick={cancel} className="text-xs font-medium text-gray-500 underline hover:text-gray-700">
            Cancel
          </button>
        )}
      </div>
      {isUploading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
          <div className="h-full bg-blue-600 transition-[width] duration-200" style={{ width: `${progress ?? 0}%` }} />
        </div>
      )}
      {error && <p id={errorId} role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
