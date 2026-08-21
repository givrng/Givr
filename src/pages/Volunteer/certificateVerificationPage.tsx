import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import type { CertificateVerificationResponse } from "../../interface/interfaces";
import { DashboardHeader } from "../../components/dashboardHeader";
import { GivrLogoIcon, PageLoader } from "../../components/icons";
import {
  AlertCircle,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  ClipboardCopy,
  ExternalLink,
  FileText,
  Share,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import useShareModal from "../../components/shareModal";

type VerifyState = "idle" | "loading" | "success" | "error";

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const CertificateVerificationPage: React.FC<{
  isOrganization?: boolean;
  public?: boolean;
}> = ({ isOrganization = false, public: isPublic = false }) => {
  const accent = isOrganization ? "#34A853" : "#1A73E8";

  const [searchParams] = useSearchParams();
  const params = useParams<{ certId?: string }>();
  const [_, setCertIdInput] = useState("");
  const [state, setState] = useState<VerifyState>("idle");
  const [result, setResult] = useState<CertificateVerificationResponse | null>(
    null
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const {openShare, ShareModalComponent} = useShareModal()
  const verifyCertificate = useCallback(
    async (certId: string) => {
      const trimmed = certId.trim();
      if (!trimmed) return;

      setState("loading");
      setError("");
      setResult(null);

      try {
        const response = await axios.get<CertificateVerificationResponse>(
          `${apiBaseUrl}/certificates/verify/${encodeURIComponent(trimmed)}`
        );
        setResult(response.data);
        setState("success");
      } catch (err) {
        const axiosErr = err as AxiosError;
        const status = axiosErr.response?.status;

        if (status === 404) {
          setError(
            `No certificate was found for “${trimmed}”. Please check the ID and try again.`
          );
        } else if (status === 400 || status === 422) {
          setError("That certificate ID looks invalid. Please check and try again.");
        } else {
          setError(
            "We couldn't verify this certificate right now. Please check your connection and try again."
          );
        }
        setState("error");
      }
    },
    [apiBaseUrl]
  );

  // Auto-verify when a certId is supplied in the URL (?certId=...)
  useEffect(() => {
    const certId =
      params.certId ||
      searchParams.get("certId") ||
      searchParams.get("cert");
    if (certId && certId.trim()) {
      setCertIdInput(certId);
      void verifyCertificate(certId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   void verifyCertificate(certIdInput);
  // };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.certificate.certId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. non-secure context); ignore.
    }
  };

  const volunteerFullName = result
    ? [result.volunteerFirstName, result.volunteerMiddleName, result.volunteerLastName]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans">
      <ShareModalComponent/>
      {isPublic ? (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7FAFC] backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-15">
            <a href="/" className="flex items-center">
              <GivrLogoIcon className="w-20 h-auto max-w-full" />
            </a>
            <a
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-[#1877F2] transition-colors"
            >
              Back to Home
            </a>
          </div>
        </header>
      ) : (
        <DashboardHeader isOrganization={isOrganization} />
      )}
      {state === "loading" && <PageLoader color={isOrganization ? "green" : "blue"} />}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Page heading */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <ShieldCheck size={14} />
            Certificate Verification
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Verify a certificate
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Confirm the authenticity of any Givr volunteer certificate by scanning the QR Code on the certificate.
          </p>
        </div>

        {/* Search / verify form */}
        {/* <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-8"
        >
          <label
            htmlFor="certId"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Certificate ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="certId"
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder="e.g. CERT-123"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:outline-none transition-colors"
                style={{ "--tw-ring-color": accent } as React.CSSProperties}
              />
            </div>
            <button
              type="submit"
              disabled={!certIdInput.trim() || state === "loading"}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition-opacity disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              <BadgeCheck size={18} />
              Verify Certificate
            </button>
          </div>
        </form> */}

        {/* Error state */}
        {state === "error" && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 mb-8">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">Verification failed</p>
              <p className="text-sm text-red-700 mt-1 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => {
                setState("idle");
                setError("");
                setCertIdInput("");
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-800 whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        )}

        {/* Success state */}
        {state === "success" && result && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Verified banner */}
            <div className="flex items-center gap-2 bg-green-600 px-5 py-3 text-white">
              <BadgeCheck size={18} />
              <span className="text-sm font-bold">
                This certificate is authentic and verified
              </span>
            </div>

            <div className="bg-white p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Certificate identity */}
                <div className="flex-1 min-w-0">
                  <div
                    className="inline-flex w-14 h-14 items-center justify-center rounded-2xl mb-4"
                    style={{ backgroundColor: `${accent}12`, color: accent }}
                  >
                    <Award size={28} />
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Certificate ID
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                      {result.certificate.certId}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Copy certificate ID"
                    >
                      <ClipboardCopy size={13} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {result.certificate.projectTitle || "—"}
                  </p>
                </div>

                {/* Name + issued date */}
                <div className="flex flex-col gap-3 md:items-end md:text-right">
                  <div className="flex items-center gap-2 md:justify-end text-gray-700">
                    <UserRound size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold">{volunteerFullName}</span>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end text-gray-500">
                    <CalendarDays size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {formatDate(result.certificate.issuedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                  <Building2 size={18} className="text-gray-400 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Issuing Organization
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {result.certificate.organizationName || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                  <UserRound size={18} className="text-gray-400 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Awarded To
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {volunteerFullName || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                  <FileText size={18} className="text-gray-400 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Project
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {result.certificate.projectTitle || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                  <CalendarDays size={18} className="text-gray-400 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Date Issued
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {formatDate(result.certificate.issuedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-x-2">
                  {result.certificate.certUrl && (
                  <a
                    href={result.certificate.certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accent }}
                  >
                    <ExternalLink size={18} />
                    View Certificate
                  </a>
                )}

                <button onClick={()=>{
                  openShare({
                    text: "Share certificate",
                    title: "Givr certificate",
                    url: result.certificate.certUrl
                  })
                }}><Share></Share>Share</button>
              </div>
            </div>
          </div>
        )}

        {/* Idle state */}
        {state === "idle" && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Award size={28} />
            </div>
            <p className="text-sm font-semibold text-gray-600">
              Scan the QR Code of a certificate to begin verification
            </p>
            <p className="mt-1.5 text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              The QR Code is found on every certificate issued through
              Givr.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CertificateVerificationPage;