import { useState } from "react";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Camera, CircleHelp, HandHeart, LockKeyhole, Pencil, Plus, Save, UserRound, UsersRound, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboardHeader";
import { CloudinaryUpload } from "../../components/CloudinaryWidget";

const tabs = ["Overview", "My initiatives", "Contributions", "Profile"] as const;
type DashboardTab = typeof tabs[number];
type IndividualProfile = {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  profileUrl: string;
};

const profileInputClassName = "w-full rounded-md border border-[#C3C6D4] bg-white px-3.5 py-2.5 text-sm text-[#323338] outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15";
const profileLabelClassName = "mb-1.5 block text-sm font-medium text-[#323338]";

export const IndividualDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const routeLocation = useLocation();
  const initialProfile = (routeLocation.state as { profile?: IndividualProfile } | null)?.profile;
  const [profile, setProfile] = useState<IndividualProfile>(() => ({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    state: "",
    lga: "",
    profileUrl: "",
    ...initialProfile,
  }));
  const [profileDraft, setProfileDraft] = useState(profile);
  const navigate = useNavigate();

  const updateProfileDraft = <Key extends keyof IndividualProfile>(key: Key, value: IndividualProfile[Key]) => {
    setProfileDraft((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = () => {
    setProfile(profileDraft);
    setIsEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setProfileDraft(profile);
    setIsEditingProfile(false);
  };

  const displayName = [profile.firstname, profile.middlename, profile.lastname].filter(Boolean).join(" ");
  const initials = [profile.firstname, profile.lastname].filter(Boolean).map((part) => part[0]).join("").toUpperCase();

  return (
    <main className="min-h-screen bg-[#F3FAFA] text-[#323338]">
      <DashboardHeader roleLabel="Individual" />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-[#DDE3E8] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1A73E8]">INDIVIDUAL SPACE</p>
            <h1 className="mt-2 text-3xl font-bold">Your initiatives</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#676879]">Turn a concern into a community effort. Find people ready to contribute time, skills, or items.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("/individual/create-initiative")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155FC0]">
              <Plus size={17} /> Create initiative
            </button>
            <button type="button" onClick={() => navigate("/individual/verification")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#C3C6D4] bg-white px-4 py-2.5 text-sm font-semibold text-[#323338] transition hover:bg-[#F8FAFC]">
              <LockKeyhole size={17} /> Verification steps
            </button>
          </div>
        </header>

        <section className="mt-6 border-l-4 border-[#FBBC05] bg-white px-5 py-4 shadow-sm" aria-labelledby="verification-status-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-md bg-[#FFF7DF] p-2 text-[#9A6B00]"><CircleHelp size={19} /></span>
              <div>
                <h2 id="verification-status-title" className="font-semibold">Identity verification required</h2>
                <p className="mt-1 max-w-3xl text-sm leading-5 text-[#676879]">Unverified individuals can browse, but must be verified before creating or joining an individual-led initiative.</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate("/individual/verification")} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#1A73E8] hover:underline">
              View verification steps <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <nav className="mt-7 flex gap-1 overflow-x-auto border-b border-[#DDE3E8]" aria-label="Individual dashboard sections">
          {tabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-current={activeTab === tab ? "page" : undefined} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab ? "border-[#1A73E8] text-[#1A73E8]" : "border-transparent text-[#676879] hover:text-[#323338]"}`}>
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Overview" && (
          <>
            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Initiative activity">
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>Initiatives</span><BriefcaseBusiness size={18} className="text-[#1A73E8]" /></div>
                <p className="mt-3 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Created by you</p>
              </article>
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>People supporting</span><UsersRound size={18} className="text-[#34A853]" /></div>
                <p className="mt-3 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Across your initiatives</p>
              </article>
              <article className="border border-[#DDE3E8] bg-white p-5">
                <div className="flex items-center justify-between text-sm text-[#676879]"><span>Contributions tracked</span><HandHeart size={18} className="text-[#B86705]" /></div>
                <p className="mt-3 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-[#8A8D98]">Time, services, and items</p>
              </article>
            </section>

            <section className="mt-8 border border-[#DDE3E8] bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your first initiative starts with verification</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#676879]">Once verified, you can publish an initiative, recruit contributors, and track volunteer, service, and item commitments. Givr does not support monetary donations.</p>
                </div>
                <BadgeCheck className="hidden shrink-0 text-[#34A853] sm:block" size={34} />
              </div>
            </section>
          </>
        )}

        {activeTab === "My initiatives" && (
          <section className="mt-6 border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
            <BriefcaseBusiness className="mx-auto text-[#1A73E8]" size={30} />
            <h2 className="mt-4 text-lg font-semibold">No initiatives yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Complete identity verification to create and manage your own initiatives.</p>
            <button type="button" onClick={() => navigate("/individual/verification")} className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-[#1A73E8] hover:bg-[#EAF2FE]">Review verification <ArrowRight size={16} /></button>
          </section>
        )}

        {activeTab === "Contributions" && (
          <section className="mt-6 border border-dashed border-[#C3C6D4] bg-white px-6 py-12 text-center">
            <HandHeart className="mx-auto text-[#34A853]" size={30} />
            <h2 className="mt-4 text-lg font-semibold">No contributions to show</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#676879]">Your commitments to initiatives will appear here, including services and item contributions.</p>
          </section>
        )}

        {activeTab === "Profile" && (
          <section className="mt-6 overflow-hidden border border-[#DDE3E8] bg-white">
            <div className="flex flex-col gap-4 border-b border-[#E7EAEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <h2 className="text-lg font-semibold">Personal profile</h2>
                <p className="mt-1 text-sm text-[#676879]">Your contact and location details for Givr.</p>
              </div>
              {isEditingProfile ? (
                <div className="flex gap-2">
                  <button type="button" onClick={cancelProfileEdit} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-medium text-[#323338] hover:bg-[#F8FAFC]"><X size={16} /> Cancel</button>
                  <button type="button" onClick={saveProfile} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#1A73E8] px-3 py-2 text-sm font-semibold text-white hover:bg-[#155FC0]"><Save size={16} /> Save changes</button>
                </div>
              ) : (
                <button type="button" onClick={() => { setProfileDraft(profile); setIsEditingProfile(true); }} className="inline-flex min-h-10 items-center gap-2 self-start rounded-md border border-[#C3C6D4] px-3 py-2 text-sm font-semibold text-[#323338] hover:bg-[#F8FAFC] sm:self-auto"><Pencil size={16} /> Edit profile</button>
              )}
            </div>

            <div className="grid gap-7 px-5 py-6 sm:grid-cols-[13rem_1fr] sm:px-7 sm:py-8">
              <div className="flex flex-col items-center gap-3 sm:items-start">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#DDE3E8] bg-[#EAF2FE] text-[#1A73E8]">
                  {(isEditingProfile ? profileDraft.profileUrl : profile.profileUrl)
                    ? <img src={isEditingProfile ? profileDraft.profileUrl : profile.profileUrl} alt={`${displayName || "Individual"} profile`} className="h-full w-full object-cover" />
                    : initials
                      ? <span className="text-3xl font-semibold">{initials}</span>
                      : <UserRound size={42} strokeWidth={1.5} />}
                </div>
                {isEditingProfile && <CloudinaryUpload folder="individual-profiles" buttonText="Change photo" onUploadSuccess={(url) => updateProfileDraft("profileUrl", url)} className="inline-flex items-center gap-2 border border-[#C3C6D4] bg-white text-[#323338] hover:bg-[#F8FAFC]" />}
                {!isEditingProfile && <p className="text-sm font-semibold text-[#323338]">{displayName}</p>}
              </div>

              <div className="grid content-start grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                {([
                  ["firstname", "First name", "given-name"],
                  ["middlename", "Middle name", "additional-name"],
                  ["lastname", "Last name", "family-name"],
                  ["email", "Email address", "email"],
                  ["phone", "Phone number", "tel"],
                  ["state", "State", "address-level1"],
                  ["lga", "Local government area", "address-level2"],
                ] as const).map(([key, label, autoComplete]) => (
                  <div key={key}>
                    <label className={profileLabelClassName} htmlFor={`profile-${key}`}>{label}</label>
                    {isEditingProfile ? (
                      <input id={`profile-${key}`} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} autoComplete={autoComplete} className={profileInputClassName} value={profileDraft[key]} onChange={(event) => updateProfileDraft(key, event.target.value)} />
                    ) : (
                      <p className="min-h-10 rounded-md border border-[#E7EAEE] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#676879]">
                        {profile[key]}
                      </p>
                    )}
                  </div>
                ))}
                {!isEditingProfile && <p className="flex items-center gap-2 text-xs text-[#8A8D98] sm:col-span-2"><Camera size={14} /> Profile information is editable from this page.</p>}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};