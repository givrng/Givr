/**
 * Downloads a remote file (image/PDF) to the local device.
 *
 * Attempts a CORS-enabled `fetch` so cross-origin assets (e.g. Cloudinary,
 * S3) get a proper filename and download behaviour. Falls back to opening the
 * URL in a new tab when the asset can't be fetched cross-origin.
 */
export async function downloadFile(url: string, filename?: string): Promise<void> {
  const fallbackName =
    filename && filename.trim().length > 0
      ? filename.trim()
      : "givr-download";

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fallbackName;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Release the object URL after the browser has had a chance to use it.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}