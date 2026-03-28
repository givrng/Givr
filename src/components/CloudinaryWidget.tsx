import { useEffect, useRef, useState } from "react";

type CloudinaryUploadProps = {
  onUploadSuccess: (url: string, publicId: string) => void;
  buttonText?: string;
  folder?: string;
  disabled?: boolean;
  className?: string;
};

declare global {
  interface Window {
    cloudinary: any;
  }
}

export const CloudinaryUpload = ({
  onUploadSuccess,
  buttonText = "Upload Image",
  folder = "uploads",
  disabled = false,
  className = "",
}: CloudinaryUploadProps) => {
  const widgetRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.cloudinary || widgetRef.current) return;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        folder,
        multiple: false,
        cropping: false,
        resourceType: "image",
        sources:["local", "camera"],
        clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
        maxFileSize: 2_000_000, // 2MB
      },
      (error: any, result: any) => {
        // if (error) {
        //   console.error("Upload error:", error);
        //   setLoading(false);
        //   return;
        // }

        // if (result.event === "success") {
        //   setLoading(false);
        //   onUploadSuccess(
        //     result.info.secure_url,
        //     result.info.public_id
        //   );
        // }
        if (!error && result?.event === "success") {
          onUploadSuccess(result.info.secure_url, result.info.public_id );
        }
      }
    );


    return ()=>{
      widgetRef.current?.destroy?.()
      widgetRef.current = null
      setLoading(false)
    }
  }, []);

  // intentiona

  const openWidget = () => {
    if (disabled || !widgetRef.current) return;
    setLoading(true);
    widgetRef.current.open();
    
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={openWidget}
      className={`px-4 py-2 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 ${className}`}
    >
      {loading ? "Uploading..." : buttonText}
    </button>
  );
};
