/**
 * Downloads a remote file to the local device with the correct file extension.
 *
 * We can't trust the file to always be a PDF, so we inspect the fetched
 * blob's MIME type (and fall back to the URL path) to derive the proper
 * extension instead of blindly renaming everything to `.pdf`.
 */

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function extensionFromMime(mime: string): string | undefined {
  return MIME_TO_EXT[mime.toLowerCase()];
}

function extensionFromUrl(url: string): string | undefined {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]{2,5})(?:\?|$)/);
    return match ? match[1].toLowerCase() : undefined;
  } catch {
    return undefined;
  }
}

function stripKnownExtension(name: string): string {
  return name.replace(/\.(pdf|png|jpe?g|webp|gif|svg)$/i, "");
}

export async function downloadFile(
  url: string,
  filename?: string
): Promise<void> {
  const requestedBase =
    filename && filename.trim().length > 0
      ? stripKnownExtension(filename.trim())
      : "givr-download";

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const mimeExt = extensionFromMime(blob.type);
    const urlExt = extensionFromUrl(url);
    const ext = mimeExt || urlExt || "bin";

    const finalName = `${requestedBase}.${ext}`;

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = finalName;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Release the object URL after the browser has had a chance to use it.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // Cross-origin fetch may be blocked; fall back to opening in a new tab.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}