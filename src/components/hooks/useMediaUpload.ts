import { useCallback, useRef, useState } from "react";
import useAuthFetch from "./useAuthFetch";

/**
 * Signed, direct-to-Cloudinary uploads.
 *
 * 1. The backend signs one upload for one purpose (GET /{role}/media/upload/signature?purpose=…).
 *    The purpose decides the folder, the upload preset (which limits formats) and the resource type.
 * 2. The browser uploads the file straight to Cloudinary with that signature and gets back a
 *    secure (https) URL, so files never pass through our API and the API secret never reaches the browser.
 *
 * The signature covers timestamp, folder and upload_preset, so those are sent exactly as returned.
 * Signatures last 5 minutes and are meant for a single upload, so a fresh one is requested every time.
 */

export type UploaderRole = "volunteer" | "organization" | "individual";
export type MediaKind = "image" | "video";
export type MediaPurpose = "AVATAR" | "ID_PHOTO" | "CAC_PHOTO" | "INITIATIVE_VIDEO" | "INITIATIVE_FLIER";

interface SignatureResponse {
  signature: string;
  timestamp: number;
  expiresAt: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadPreset: string;
  resourceType: string;
  allowedFormat?: string[];
}

export interface UploadedMedia {
  secureUrl: string;
  publicId: string;
  kind: MediaKind;
}

/** What kind of file each purpose takes. Must match the backend's presets (see the API readme). */
export const PURPOSE_KIND: Record<MediaPurpose, MediaKind> = {
  AVATAR: "image",
  ID_PHOTO: "image",
  CAC_PHOTO: "image",
  INITIATIVE_VIDEO: "video",
  INITIATIVE_FLIER: "image",
};

/**
 * Client-side pre-checks so an obviously wrong file fails before any network call.
 * The backend's `allowedFormat` is still checked after the signature arrives, and Cloudinary enforces the preset.
 */
export const MEDIA_RULES: Record<MediaKind, { mimeTypes: Record<string, string>; label: string; defaultMaxMB: number }> = {
  image: {
    mimeTypes: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" },
    label: "JPG, PNG or WEBP",
    defaultMaxMB: 2,
  },
  video: {
    mimeTypes: { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" },
    label: "MP4, WEBM or MOV",
    defaultMaxMB: 50,
  },
};

export class UploadError extends Error {}

const fileExtension = (file: File) => {
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "";
};

/** Checks type and size before spending a network round trip; returns a user-facing message or undefined. */
export function validateMediaFile(file: File, purpose: MediaPurpose, maxMB?: number): string | undefined {
  const rules = MEDIA_RULES[PURPOSE_KIND[purpose]];
  const limit = maxMB ?? rules.defaultMaxMB;
  if (!(file.type in rules.mimeTypes)) return `Please choose a ${rules.label} file.`;
  if (file.size > limit * 1024 * 1024) return `That file is too large. The maximum size is ${limit} MB.`;
  return undefined;
}

/** True when the backend's allowed list accepts this file, by its extension or, failing that, its MIME type. */
const isAllowedByBackend = (file: File, purpose: MediaPurpose, allowed?: string[]) => {
  if (!allowed?.length) return true;
  const list = allowed.map((format) => format.toLowerCase().replace(/^\./, ""));
  const fromMime = MEDIA_RULES[PURPOSE_KIND[purpose]].mimeTypes[file.type];
  const ext = fileExtension(file);
  // "jpeg" and "jpg" are the same format; the backend lists both but be tolerant if it only lists one
  const variants = (value: string) => (value === "jpg" || value === "jpeg" ? ["jpg", "jpeg"] : [value]);
  return [ext, fromMime].filter(Boolean).some((value) => variants(value as string).some((v) => list.includes(v)));
};

export function useMediaUpload(role: UploaderRole) {
  const { API } = useAuthFetch(role);
  const [progress, setProgress] = useState<number | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const cancelledRef = useRef(false);

  const getSignature = useCallback(async (purpose: MediaPurpose): Promise<SignatureResponse> => {
    try {
      const { data } = await API().get<SignatureResponse>("/media/upload/signature", { params: { purpose } });
      if (!data?.signature || !data.uploadPreset || !data.cloudName) throw new Error("Incomplete signature");
      return data;
    } catch {
      throw new UploadError("We couldn't prepare your upload. Please check you're signed in and try again.");
    }
  }, [API]);

  const upload = useCallback(async (file: File, purpose: MediaPurpose, maxMB?: number): Promise<UploadedMedia> => {
    const invalid = validateMediaFile(file, purpose, maxMB);
    if (invalid) throw new UploadError(invalid);

    const kind = PURPOSE_KIND[purpose];
    cancelledRef.current = false;
    setProgress(0);
    try {
      const signature = await getSignature(purpose);
      if (cancelledRef.current) throw new UploadError("Upload cancelled.");

      if (signature.resourceType !== kind) {
        // The backend and this client disagree on what the purpose accepts; refuse instead of guessing
        throw new UploadError("This upload isn't available right now. Please try again later.");
      }
      if (!isAllowedByBackend(file, purpose, signature.allowedFormat)) {
        throw new UploadError(`Please choose a ${signature.allowedFormat!.map((f) => f.toUpperCase()).join(", ")} file.`);
      }

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signature.apiKey);
      body.append("timestamp", String(signature.timestamp));
      body.append("signature", signature.signature);
      // Signed parameters: must be sent exactly as returned or Cloudinary rejects the signature
      body.append("folder", signature.folder);
      body.append("upload_preset", signature.uploadPreset);

      return await new Promise<UploadedMedia>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/${encodeURIComponent(signature.resourceType)}/upload`
        );
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () => {
          let response: { secure_url?: string; public_id?: string; error?: { message?: string } } = {};
          try { response = JSON.parse(xhr.responseText); } catch { /* handled below */ }

          const expectedPrefix = `https://res.cloudinary.com/${signature.cloudName}/`;
          if (xhr.status >= 200 && xhr.status < 300 && response.secure_url?.startsWith(expectedPrefix) && response.public_id) {
            resolve({ secureUrl: response.secure_url, publicId: response.public_id, kind });
            return;
          }
          if (xhr.status === 401) {
            reject(new UploadError("Your upload session expired. Please try again."));
            return;
          }
          reject(new UploadError(response.error?.message ? `Upload failed: ${response.error.message}` : "Upload failed. Please try again."));
        };
        xhr.onerror = () => reject(new UploadError("Upload failed. Please check your connection and try again."));
        xhr.onabort = () => reject(new UploadError("Upload cancelled."));
        xhr.send(body);
      });
    } finally {
      xhrRef.current = null;
      setProgress(null);
    }
  }, [getSignature]);

  /** Stops the upload, including while the signature is still being fetched. */
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    xhrRef.current?.abort();
  }, []);

  return { upload, cancel, progress, isUploading: progress !== null };
}
