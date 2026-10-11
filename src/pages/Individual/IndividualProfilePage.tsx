
import { PageLoader } from "../../components/icons";

import type { OrganizationProfileProps, OrganizationProps, OrgContantProfileProps} from "../../interface/interfaces"
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserRound } from "lucide-react";

import useAuthFetch from "../../components/hooks/useAuthFetch";
import OrganizationProfile from "../../components/Organization/OrgProfile";
import { EditOrgProfileModal } from "../../components/Organization/editOrgProfile";
import { EditOrgContactProfile } from "../../components/Organization/editOrgContactProfile";
import LocationSelect from "../../components/form/LocationSelect";
import { CloudinaryUpload } from "../../components/CloudinaryWidget";

type IndividualProfileFields = {
  firstname: string;
  middlename: string;
  lastname: string;
  phone: string;
  state: string;
  lga: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileUrl: string;
};

type IndividualProfileErrors = Partial<Record<keyof IndividualProfileFields, string>>;

const profileInputClassName = "w-full rounded-md border border-[#C3C6D4] bg-white px-3.5 py-3 text-sm text-[#323338] outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15";
const profileLabelClassName = "mb-1.5 block text-sm font-medium text-[#323338]";

export const IndividualProfileSignup: React.FC = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const initiative = (routeLocation.state as { initiative?: { title?: string } } | null)?.initiative;
  const [profile, setProfile] = useState<IndividualProfileFields>({
    firstname: "",
    middlename: "",
    lastname: "",
    phone: "",
    state: "",
    lga: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileUrl: "",
  });
  const [errors, setErrors] = useState<IndividualProfileErrors>({});
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = <Key extends keyof IndividualProfileFields>(key: Key, value: IndividualProfileFields[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setNotice("");
  };

  const handleLocationChange = useCallback((value: { state: string; lga: string }) => {
    setProfile((current) => ({ ...current, state: value.state, lga: value.lga }));
    setErrors((current) => ({ ...current, state: "", lga: "" }));
    setNotice("");
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: IndividualProfileErrors = {};

    if (!profile.firstname.trim()) nextErrors.firstname = "First name is required.";
    if (!profile.lastname.trim()) nextErrors.lastname = "Last name is required.";
    if (!/^\d{11,}$/.test(profile.phone)) nextErrors.phone = "Enter a phone number with at least 11 digits.";
    if (!profile.state) nextErrors.state = "Choose your state and LGA.";
    if (!profile.lga) nextErrors.lga = "Choose your state and LGA.";
    if (!profile.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!profile.password) {
      nextErrors.password = "Create a password.";
    } else if (profile.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (!profile.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (profile.confirmPassword !== profile.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("Please complete the required fields to continue.");
      return;
    }

    const { password, confirmPassword, ...profileDetails } = profile;
    void password;
    void confirmPassword;
    navigate("/individual", { state: { profile: profileDetails } });
  };

  return (
    <main className="min-h-screen bg-[#F3FAFA] px-4 py-8 font-sans sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-7 text-center sm:mb-9">
          <p className="mb-3 text-lg font-bold text-[#1A73E8]">Individual Profile</p>
          <h1 className="text-2xl font-bold text-[#323338] sm:text-3xl">Create your profile</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-[#676879] sm:text-base">
            Add your personal information and the credentials you’ll use to sign in.
          </p>
        </header>

        {initiative?.title && <p className="mb-4 rounded-md border border-[#DDE3E8] bg-white px-4 py-3 text-sm text-[#676879]">Initiative: <span className="font-semibold text-[#323338]">{initiative.title}</span></p>}

        <form onSubmit={handleSubmit} noValidate className="overflow-hidden rounded-xl border border-[#DDE3E8] bg-white shadow-sm">
          <section className="border-b border-[#E7EAEE] px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#323338]">Personal information</h2>
              <p className="mt-1 text-sm text-[#676879]">Tell supporters a little about the person leading this initiative.</p>
            </div>
            <div className="mb-6 flex flex-col items-center gap-4 rounded-lg border border-dashed border-[#C3C6D4] bg-[#F8FAFC] p-4 sm:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DDE3E8] bg-[#EAF2FE] text-[#1A73E8]">
                {profile.profileUrl
                  ? <img src={profile.profileUrl} alt="Profile photo preview" className="h-full w-full object-cover" />
                  : <UserRound size={34} strokeWidth={1.5} />}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-[#323338]">Profile photo</p>
                <p className="mb-3 mt-1 text-xs text-[#676879]">Add a photo so people can recognize you.</p>
                <CloudinaryUpload
                  folder="individual-profiles"
                  buttonText={profile.profileUrl ? "Change photo" : "Upload photo"}
                  onUploadSuccess={(url) => setProfile((current) => ({ ...current, profileUrl: url }))}
                  className="border border-[#C3C6D4] bg-white text-[#323338] hover:bg-[#F3FAFA]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={profileLabelClassName} htmlFor="individual-firstname">First name <span className="text-[#1A73E8]">*</span></label>
                <input id="individual-firstname" autoComplete="given-name" required className={profileInputClassName} value={profile.firstname} onChange={(event) => updateField("firstname", event.target.value)} aria-invalid={Boolean(errors.firstname)} />
                {errors.firstname && <p className="mt-1 text-xs text-red-600">{errors.firstname}</p>}
              </div>
              <div>
                <label className={profileLabelClassName} htmlFor="individual-middlename">Middle name</label>
                <input id="individual-middlename" autoComplete="additional-name" className={profileInputClassName} value={profile.middlename} onChange={(event) => updateField("middlename", event.target.value)} />
              </div>
              <div>
                <label className={profileLabelClassName} htmlFor="individual-lastname">Last name <span className="text-[#1A73E8]">*</span></label>
                <input id="individual-lastname" autoComplete="family-name" required className={profileInputClassName} value={profile.lastname} onChange={(event) => updateField("lastname", event.target.value)} aria-invalid={Boolean(errors.lastname)} />
                {errors.lastname && <p className="mt-1 text-xs text-red-600">{errors.lastname}</p>}
              </div>
              <div>
                <label className={profileLabelClassName} htmlFor="individual-phone">Phone number <span className="text-[#1A73E8]">*</span></label>
                <input id="individual-phone" type="tel" autoComplete="tel" required className={profileInputClassName} placeholder="08012345678" value={profile.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, ""))} aria-invalid={Boolean(errors.phone)} />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>
            <div className="mt-5">
              <p className={profileLabelClassName}>Personal location <span className="text-[#1A73E8]">*</span></p>
              <LocationSelect onChange={handleLocationChange} state={profile.state} lga={profile.lga} />
              {(errors.state || errors.lga) && <p className="mt-1 text-xs text-red-600">{errors.state || errors.lga}</p>}
            </div>
          </section>

          <section className="px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#323338]">Sign-in details</h2>
              <p className="mt-1 text-sm text-[#676879]">Use these details when you sign in to Givr.</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className={profileLabelClassName} htmlFor="individual-email">Email <span className="text-[#1A73E8]">*</span></label>
                <input id="individual-email" type="email" autoComplete="email" required className={profileInputClassName} placeholder="you@example.com" value={profile.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className={profileLabelClassName} htmlFor="individual-password">Create password <span className="text-[#1A73E8]">*</span></label>
                <div className="relative">
                  <input id="individual-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={6} className={`${profileInputClassName} pr-12`} value={profile.password} onChange={(event) => updateField("password", event.target.value)} aria-invalid={Boolean(errors.password)} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#676879] hover:text-[#1A73E8] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A73E8]" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className={profileLabelClassName} htmlFor="individual-confirm-password">Confirm password <span className="text-[#1A73E8]">*</span></label>
                <div className="relative">
                  <input id="individual-confirm-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" required minLength={6} className={`${profileInputClassName} pr-12`} value={profile.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} aria-invalid={Boolean(errors.confirmPassword)} />
                  <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#676879] hover:text-[#1A73E8] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A73E8]" aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"} title={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </section>

          <footer className="flex flex-col-reverse gap-3 border-t border-[#E7EAEE] bg-[#FAFCFD] px-5 py-5 sm:flex-row sm:justify-between sm:px-8">
            <button type="button" onClick={() => navigate("/signup/individual", { state: routeLocation.state })} className="rounded-md border border-[#C3C6D4] px-4 py-2 text-sm font-semibold text-[#323338] hover:bg-[#F3FAFA] cursor-pointer">Back to initiative</button>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#155FC0] sm:w-auto cursor-pointer">Create profile</button>
          </footer>
          {notice && <p role="status" className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-8">{notice}</p>}
        </form>
      </div>
    </main>
  );
};



export const OrganizationProfilePage:React.FC<{editing?:boolean}> = ({editing = false})=> {

  const [isEditing, setIsEditing] = useState(editing)
  const [orgEdit, setOrgEdit] = useState(false)
  const [profile, setProfile] = useState<OrganizationProfileProps>({
    organization: {
      website:"",
    },
    organizationContact: {
      contactFirstname:"",
      contactLastname:"",
      contactMiddleName:"",
      phoneNumber:"", 
      contactPersonProfileUrl:"",
      email:"",
      emailEditable:false,
      emailVerified:false
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [reload, setReload] = useState(false)

  const {API} = useAuthFetch("organization")
  
  useEffect(()=>{
    const loadProfile = async ()=>{
      try{
        setIsLoading(true)
        let response = await API().get("/profile")
        setProfile(prev=>({...prev, ...response.data as OrganizationProfileProps}))
      }finally{
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleUpdate = async (data: OrganizationProps)=>{
    try{
      let response = await API().patch("/profile", data)
      setProfile(response.data as OrganizationProfileProps)
      return response
    }catch{
      return Promise.reject()
    }
  }

  const save = async (data: OrgContantProfileProps | OrganizationProps): Promise<undefined> => {
    try {
      const response = await API().patch("/profile", data)
      setProfile(response.data as OrganizationProfileProps)
      return undefined
    } catch {
      return Promise.reject()
    }
  }

  const handleContactUpdate =  async (data: OrgContantProfileProps)=>{
    return save(data)
  }

  return (
    <div className="p-6 space-y-6 flex flex-col justify-center items-center">
      {isLoading&&<PageLoader message="Loading your profile"/> }

      { isEditing? orgEdit? <EditOrgProfileModal org={profile.organization} onSave={handleUpdate} onClose={()=>{
         setOrgEdit(false)
        setIsEditing(false)
      }}/>:<EditOrgContactProfile onClose={()=>{
        setOrgEdit(false)
        setIsEditing(false)
      }}
      onSubmit={handleContactUpdate}
      profileProps={profile.organizationContact}
      /> : <OrganizationProfile
        profile={profile}
        org={profile.organization}
        onEditProfile={()=>{
          setIsEditing(true) 
        } }
        editOrgInfo={()=>setOrgEdit(true)}
        reload={()=>setReload(!reload)}
        updateProfile={setProfile}
        save={save}
      />}

    </div>
  );
}

export default OrganizationProfilePage;