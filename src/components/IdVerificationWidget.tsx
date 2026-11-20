import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import React, { useEffect, useId } from "react";
import { CloudinaryUpload } from "./CloudinaryWidget";
import type { IdType, OrganizationProps } from "../interface/interfaces";
import { IDCardInput } from "./IDCardInput";
import type { UploaderRole } from "./hooks/useMediaUpload";

/** The identity details both organizations (contact person) and individuals verify with */
export type IdentityDetails = {
  idType?: IdType;
  idNumber?: string;
  dateOfBirth?: string;
  firstname?: string;
  middleName?: string;
  lastname?: string;
  photoUrl?: string;
};

export type IdentityDetailsErrors = Partial<Record<keyof IdentityDetails, string>>;

type IdentityVerificationFieldsProps = {
  value: IdentityDetails;
  onChange: (patch: Partial<IdentityDetails>) => void;
  /** Which account signs the photo upload */
  uploaderRole: UploaderRole;
  disabled?: boolean;
  /** Organizations may skip the contact person's ID; individuals may not */
  idOptional?: boolean;
  /** Individuals may skip the photo: the backend doesn't require it for individual verification */
  photoOptional?: boolean;
  showMiddleName?: boolean;
  errors?: IdentityDetailsErrors;
};

const inputClassName = `w-full pl-4 pr-4 py-3 border rounded-lg transition duration-150 text-gray-800
  focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400`;

const FieldError = ({ id, message }: { id?: string; message?: string }) =>
  message ? <p id={id} role="alert" className="text-sm text-red-600">{message}</p> : null;

/**
 * The verification sections shared by organizations and individuals:
 * 1. ID details, 2. the person's name, 3. a photo of them.
 * Stateless: the parent owns the values, so each flow keeps its own payload shape.
 */
export const IdentityVerificationFields = ({
  value,
  onChange,
  uploaderRole,
  disabled = false,
  idOptional = false,
  photoOptional = false,
  showMiddleName = false,
  errors = {},
}: IdentityVerificationFieldsProps) => {
  const errorIdPrefix = useId();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>, key: "contactVerification" | "dateOfBirth") => {
    if (key === "dateOfBirth") {
      onChange({ dateOfBirth: e.target.value });
      return;
    }
    // NINs are numeric and exactly 11 digits
    const raw = e.target.value;
    onChange({ idNumber: value.idType === "NIN" ? raw.replace(/\D/g, "").slice(0, 11) : raw });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">
            1. Select & Enter ID Details{" "}
            {idOptional ? <span className="text-red-500">(optional)</span> : <span className="text-red-500">*</span>}
          </h3>
          <p className="text-sm text-gray-500">Please provide valid identification details</p>
          <IDCardInput
            onChange={handleIdChange}
            onTypeChange={(idType) => onChange({ idType, idNumber: "" })}
            disabled={disabled}
            idType={value.idType}
            value={value.idNumber ?? ""}
            dobValue={value.dateOfBirth ?? ""}
          />
          <FieldError message={errors.idNumber} />
          <FieldError message={errors.dateOfBirth} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">2. User information<span className="text-red-500">*</span></h3>
          <p className="text-sm text-gray-500">Enter your name exactly as it appears on your ID</p>
          <div className={`grid gap-2 ${showMiddleName ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            <div className="space-y-1">
              <input type="text" aria-label="First name" autoComplete="given-name" maxLength={50} disabled={disabled}
                className={inputClassName} placeholder="Firstname" value={value.firstname ?? ""}
                aria-invalid={Boolean(errors.firstname)} aria-describedby={errors.firstname ? `${errorIdPrefix}-firstname` : undefined}
                onChange={(e) => onChange({ firstname: e.target.value })} />
              <FieldError id={`${errorIdPrefix}-firstname`} message={errors.firstname} />
            </div>
            {showMiddleName && (
              <div className="space-y-1">
                <input type="text" aria-label="Middle name (optional)" autoComplete="additional-name" maxLength={50} disabled={disabled}
                  className={inputClassName} placeholder="Middle name (optional)" value={value.middleName ?? ""}
                  aria-invalid={Boolean(errors.middleName)} aria-describedby={errors.middleName ? `${errorIdPrefix}-middle` : undefined}
                  onChange={(e) => onChange({ middleName: e.target.value })} />
                <FieldError id={`${errorIdPrefix}-middle`} message={errors.middleName} />
              </div>
            )}
            <div className="space-y-1">
              <input type="text" aria-label="Last name" autoComplete="family-name" maxLength={50} disabled={disabled}
                className={inputClassName} placeholder="Lastname" value={value.lastname ?? ""}
                aria-invalid={Boolean(errors.lastname)} aria-describedby={errors.lastname ? `${errorIdPrefix}-lastname` : undefined}
                onChange={(e) => onChange({ lastname: e.target.value })} />
              <FieldError id={`${errorIdPrefix}-lastname`} message={errors.lastname} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            3. User Image Capture{" "}
            {photoOptional ? <span className="text-red-500">(optional)</span> : <span className="text-red-500">*</span>}
          </h3>
          <p className="text-sm text-gray-500">
            {photoOptional
              ? "A clear passport photograph helps volunteers recognise you on your initiatives"
              : "Please provide a clear passport photograph for verification"}
          </p>

          {!value.photoUrl ? (
            <CloudinaryUpload
              role={uploaderRole}
              purpose="ID_PHOTO"
              buttonText="Snap or Upload a passport photograph"
              max_size_MB={4}
              disabled={disabled}
              onUploadSuccess={(url) => onChange({ photoUrl: url })}
            />
          ) : (
            <div className="relative group rounded-xl overflow-hidden border-2 border-blue-100 bg-gray-50">
              <img
                src={value.photoUrl}
                alt="Your verification photo"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Shown on hover, and on keyboard focus so it's reachable without a mouse */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onChange({ photoUrl: "" })}
                  disabled={disabled}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove image"
                  aria-label="Remove photo"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm border border-green-100">
                <CheckCircle2 size={14} />
                Uploaded Successfully
              </div>
            </div>
          )}
          <FieldError message={errors.photoUrl} />
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} />
          <span>Secure encryption. Your data is only used for verification.</span>
        </div>
      </div>
    </div>
  );
};

type IdentityVerificationWidgetProps = {
  formData: OrganizationProps;
  setForm: React.Dispatch<React.SetStateAction<OrganizationProps>>;
  disabled: boolean;
};

/** Organization contact-person verification: maps the shared fields onto OrganizationProps */
export const IdentityVerificationWidget = ({ formData, setForm, disabled = false }: IdentityVerificationWidgetProps) => {
  // Default the ID type when the form opens
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      contactVerification: { ...prev.contactVerification, idType: "DL" },
    }));
  }, [setForm]);

  const handleChange = (patch: Partial<IdentityDetails>) => {
    setForm(prev => ({
      ...prev,
      ...("firstname" in patch ? { contactFirstname: patch.firstname } : {}),
      ...("lastname" in patch ? { contactLastname: patch.lastname } : {}),
      ...("dateOfBirth" in patch ? { dateOfBirth: patch.dateOfBirth } : {}),
      contactVerification: {
        ...prev.contactVerification,
        ...("idType" in patch ? { idType: patch.idType } : {}),
        ...("idNumber" in patch ? { idNumber: patch.idNumber } : {}),
        ...("photoUrl" in patch ? { usrImgUrl: patch.photoUrl } : {}),
      },
    }));
  };

  return (
    <IdentityVerificationFields
      uploaderRole="organization"
      idOptional
      disabled={disabled}
      value={{
        idType: formData.contactVerification?.idType,
        idNumber: formData.contactVerification?.idNumber,
        dateOfBirth: formData.dateOfBirth,
        firstname: formData.contactFirstname,
        lastname: formData.contactLastname,
        photoUrl: formData.contactVerification?.usrImgUrl,
      }}
      onChange={handleChange}
    />
  );
};
