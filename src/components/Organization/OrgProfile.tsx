import type {  OrganizationProfileProps, OrganizationProps, OrgContantProfileProps, OtpPurpose } from "../../interface/interfaces";
import { ChangePasswordModal, type ChangePasswordFormFields } from "../ChangePassword";

import React, {  useState } from "react";
import { VerifyEmailOtpModal } from "../VerifyOtpModal";
import { PageLoader } from "../icons";
import useAuthFetch from "../hooks/useAuthFetch";
import { useAlert } from "../hooks/useAlert";
import { useConfirmAsk } from "../hooks/useConfirm";
import { CloudinaryUpload } from "../CloudinaryWidget";

interface OrgProfileComponentProps {
  profile: OrganizationProfileProps;
  org: OrganizationProps;
  onEditProfile: () => void;
  editOrgInfo: ()=>void;
  reload?:()=>void;
  updateProfile: React.Dispatch<React.SetStateAction<OrganizationProfileProps>>
  save:(data: OrgContantProfileProps |OrganizationProps)=>Promise<undefined>;
}


const Info = ({label, value, highlight,}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`font-medium ${highlight ? "text-green-600" : ""}`}>
      {value}
    </p>
  </div>
);



export default function OrganizationProfile({profile, onEditProfile, editOrgInfo, reload, updateProfile, save}: OrgProfileComponentProps) {

    const [isOpen, setIsOpen] = useState(false)
    const {API} = useAuthFetch("organization")
    const {alertMessage, AlertDialog} = useAlert({isOrg:true})
    const [isLoading, setIsLoading] = useState(false)

    const [otpIsOpen, setOtpIsOpen] = useState(false)

    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:true})

    const requestOtp = async (purpose:OtpPurpose)=>{
      
      try{  
        setIsLoading(true)
        await API().post(`/otp/request?purpose=${purpose}`)

      }catch(err:any){
        const status = err?.response?.status

        switch(status){

          case 400:
            alertMessage("OTP request failed")
            break
          case 500:
            alertMessage("Server error, contact support")
            break
          default:
            alertMessage("Error")
            break;
          
        }
        return Promise.reject()
      }finally{
          setIsLoading(false)
        }
    }


    const onChangePasswordClick = async ()=>{
        await requestOtp("PASSWORD_UPDATE")
          
        setIsOpen(true)
       
    }
   

    const handleVerifyEmailClick = async()=>{
      if(otpIsOpen){
        setOtpIsOpen(false)
        return
      }

      try{
        await requestOtp("EMAIL_VERIFICATION")
        setIsLoading(false)
        setOtpIsOpen(true)
      }finally{
        setIsLoading(false)
      }
    }

    const handleEmailVerfication = async (otp:string)=>{
        return await API().patch("/verify/email", {otp});
    }

    const handlePasswordChange = async (p:ChangePasswordFormFields)=>{
      return await API().patch("/password/update", p)
    }

    const handleUpdateEmail = async (email:string)=>{
      updateProfile(prev=>({
                ...prev, 
                organizationContact:{
                  ...prev.organizationContact, 
                  email: email
                }
              }))

            let response = await confirmAsk({
                question: "Are you sure you want to update profile?",
                trueAnswer: "Update",
                falseAnswer: "Cancel"
            })
    
            if(!response)
                return 
            
            return save(profile.organizationContact)
        }

    const handleLogoUpdate = (url:string)=>{
      updateProfile(prev=>({
        ...prev,
        organization:{
          ...prev.organization,
          profileUrl: url
        }
      }))
    }

    const UserProfileSection = () => (
        <div className="border border-ui rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#323338]">
              Personal Profile
            </h3>

          </div>

          <div className="flex items-center gap-6">
            <img
              src={profile.organizationContact.contactPersonProfileUrl || `https://avatar.iran.liara.run/username?username=${profile.organizationContact.contactFirstname}+${profile.organizationContact.contactLastname}`}
              alt={profile.organizationContact.contactFirstname}
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="text-sm">
              <p className="font-semibold text-base">
                {profile.organizationContact.contactLastname} {profile.organizationContact.contactFirstname}{" "}
                {profile.organizationContact.contactMiddleName || ""}
              </p>

              <p className="text-[#676879]">{profile.organization.name}</p>

              <p className="text-[#676879]">
                {profile.organization.location?.state}, {profile.organization.location?.lga}
              </p>

              <p className="text-yellow-500 text-sm mt-1">
                {profile.organization.rating}
                <span className="text-gray-500 ml-1">
                  ({profile.organization.rating}/5)
                </span>
              </p>
            </div>
          </div>
        </div>
      );

      const OrganizationProfileSection = () => {

        const org = profile.organization;

        const initials = org.name? org.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase(): "?";
      
        return (<div className="border border-ui rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#323338]">
              Organization Profile
            </h3>

            {profile.organization?.status == "UNVERIFIED" && (
              <button
                onClick={() => {
                  onEditProfile()
                  editOrgInfo()
                }}
                className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100"
              >
                {!profile.organization.profileCompleted? "Complete profile":"Edit Organization" }
              </button>
            )}
          </div>

          {/* Logo + Fields */}
          <div className="flex gap-5 items-start">
            {/* Logo column */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-ui bg-gray-100 flex items-center justify-center">
                {org.profileUrl ? (
                  <img
                    src={org.profileUrl}
                    alt={`${org.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{initials}</span>
                )}
              </div>
            </div> 

             {/* Upload button — shown for any non-locked org */}
                <CloudinaryUpload
                  onUploadSuccess={(url:string, _:string)=>{
                    handleLogoUpdate(url)
                    API().patch("/profile", {profileUrl:url})
                  }}
                  buttonText={org.profileUrl ? "Change logo" : "Add logo"}
                  folder="organization-logos"
                  sources={["local", "camera"]}
                  max_size_MB={2}
                  className="!text-xs !px-2 !py-1 w-full text-center"
              />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Organization Name" value={profile.organization.name || "—"} />
            <Info
              label="Organization Type"
              value={profile.organization.category?.[0] || "—"}
            />
            <Info
              label="CAC Number"
              value={profile.organization.cacRegNumber || "—"}
            />
            <Info label="Website" value={profile.organization.website || "—"} />
            <Info
              label="Status"
              value={profile.organization.status === "VERIFIED" ? "Verified" : profile.organization.status == "PENDING"? "Pending": "Unverified"}
              highlight={profile.organization.status === "VERIFIED"}
            />
          </div>

          {profile.organization.status === "VERIFIED" && (
            <p className="text-xs text-gray-500 mt-4">
              Organization details are locked after CAC verification.
            </p>
          )}
        </div>)
      };

    return (
    <div className=" grid lg:grid-cols-6 gap-8 w-full ">
      <ConfirmDialog/>
      {isLoading && <PageLoader/>}
      <AlertDialog/>
      <div className="border border-ui rounded-2xl p-6 col-span-4">
      <h2 className="text-xl text-[#323338] font-semibold mb-6">
        Profile Information
      </h2>

        <div className="flex flex-col gap-8">
          {/* User Profile */}
          <UserProfileSection />

          {/* Organization Profile */}
          <OrganizationProfileSection />
        </div>
      </div>

      

      <div className="border border-ui lg:col-span-2 col-span-4 rounded-2xl p-6">
        <h2 className="text-base text-[#323338] font-semibold mb-4">
          Security & Access
        </h2>

        <div className="flex flex-col gap-y-4">

          {/* Email verification */}
          <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between p-4 rounded-xl border border-ui">
              <div>
                <p className="text-sm font-medium text-[#323338]">
                  Email Address
                </p>
                <p className="text-xs text-gray-500">
                  {profile.organizationContact.email}
                </p>
              </div>

              {profile.organizationContact.emailVerified ? (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Verified
                </span>
              ) : (
                <button
                  onClick={handleVerifyEmailClick}
                  className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100"
                >
                  {otpIsOpen? "Cancel":"Verify Email"}
                  
                </button>
              )}
            </div>
            <VerifyEmailOtpModal email={profile.organizationContact.email} isOpen={otpIsOpen} onSubmit={handleEmailVerfication}
            close={()=>setOtpIsOpen(false)}
            onSuccess={()=>{
              setOtpIsOpen(false)
              if(reload)
                reload()
            }}
            onEmailChange={(email:string)=>{
              if(email != profile.organizationContact.email)
                return handleUpdateEmail(email)

              return Promise.resolve()
            }}
            otpRequest={()=>(requestOtp("EMAIL_VERIFICATION"))}
            
            />
          </div>

          {/* Password */}
          {
            profile.organizationContact.emailEditable && <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between p-4 rounded-xl border border-ui">
            <div>
              <p className="text-sm font-medium text-[#323338]">
                Password
              </p>
              <p className="text-xs text-gray-500">
                Last updated 
              </p>
            </div>

            <button
              onClick={onChangePasswordClick}
              className="text-xs font-semibold text-[red] bg-red-100 px-3 py-1 rounded-full hover:bg-red-200"
            >
              Change Password
            </button>
            </div>
            <ChangePasswordModal email={profile.organizationContact.email} isOpen={isOpen} onClose={()=>{setIsOpen(false)}} onSubmit={handlePasswordChange} />
          </div>
          }

          {/* Optional: 2FA placeholder */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-ui opacity-60">
            <div>
              <p className="text-sm font-medium text-[#323338]">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-gray-500">
                Add an extra layer of security
              </p>
            </div>

            <span className="text-xs font-semibold text-gray-500">
              Coming soon
            </span>
          </div>
          
        </div>
      </div>


    </div>
  );
}
