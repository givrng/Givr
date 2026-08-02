import { useState } from "react";
import type { CertificateDto, OtpPurpose, ProfileProps } from "../interface/interfaces";
import { ChangePasswordModal, type ChangePasswordFormFields } from "./ChangePassword";
import { Button } from "./ReuseableComponents";
import { VerifyEmailOtpModal } from "./VerifyOtpModal";
import useAuthFetch from "./hooks/useAuthFetch";
import { useAlert } from "./hooks/useAlert";
import { PageLoader } from "./icons";
import { Award, ExternalLink } from "lucide-react";
interface ProfileAchievementsProps {
  profile: ProfileProps;
  onEditProfile: () => void;
  reload:()=>void;
}

export default function ProfileAchievements({profile, onEditProfile,reload}: ProfileAchievementsProps) {

  const [otpIsOpen, setOtpIsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false);
  const {alertMessage, AlertDialog} = useAlert({isOrg:false})
  const {API} = useAuthFetch("volunteer")


  const requestOtp = async (purpose:OtpPurpose)=>{
        
        try{  
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
        }
      }

  const handleVerifyEmailClick = async ()=>{
    if(otpIsOpen){
        setOtpIsOpen(false)
        return
      }
      try{
        setIsLoading(true)
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
  const handlePasswordChange = async (data:ChangePasswordFormFields)=>{
    return await API().patch("/password/update", data)
  }

  const onChangePasswordClick = async ()=>{
     try{
          setIsLoading(true)
          await requestOtp("PASSWORD_UPDATE")
          setIsLoading(false)
          setIsOpen(true)
        }finally{
          setIsLoading(false)
        }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid lg:grid-cols-6 gap-8 w-full ">
      <AlertDialog/>
      {isLoading && <PageLoader/>}
      {/* ------------------ Profile Section ------------------ */}
      <div className="border border-ui rounded-2xl  p-6 col-span-4">
        <h2 className="text-xl text-[#323338] font-semibold mb-4">
          Profile Information
        </h2>

        <div className="flex flex-col  md:items-start gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <img
              src={profile.profileUrl}
              alt={profile.firstname}
              className="w-28 h-28 rounded-full object-cover border"
            />

            {/* Info */}

            <div>
              
              <h3 className="text-lg font-semibold">{profile.lastname}</h3>
              <h3 className="text-lg font-semibold">{profile.firstname}</h3>
              <h3 className="text-lg font-semibold">{profile.middleName? profile.middleName:""}</h3>
              <span className="text-[#676879] text-sm">{profile.role}</span>
              <span className="text-[#676879] text-sm ml-2">
                {`${profile.location?.state}, ${profile.location?.lga}`}
              </span>
              {/* Rating */}
              <p className="text-yellow-500 text-sm">
                {profile.rating}
                <span className="text-gray-500 ml-1">({profile.rating}/5)</span>
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-base text-[#323338] font-medium">Interests</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs border border-ui rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>


          {/* Edit Button */}
          <Button 
          variant="primary" 
          onClick={onEditProfile}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* ------------------ Achievement Section ------------------ */}
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
                      {profile.email}
                    </p>
                  </div>
    
                  {profile.emailIsVerified ? (
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
                <VerifyEmailOtpModal email={profile.email? profile.email :""} isOpen={otpIsOpen} onSubmit={handleEmailVerfication}
                  onSuccess={()=>{
                    setOtpIsOpen(false)
                    reload()
                  }}
                  close={()=>setOtpIsOpen(false)}
                />
              </div>
    
              {/* Password */}
              {
                profile.emailEditable && <div className="flex flex-col gap-y-2">
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
                    className={`text-xs font-semibold text-[red] bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full`}
                  >
                    Change Password
                  </button>
                </div>
                <ChangePasswordModal email={profile.email?profile.email:""} isOpen={isOpen} onClose={()=>{setIsOpen(false)}} onSubmit={handlePasswordChange} />
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
    
      {/* ------------------ Certificates Section ------------------ */}
      <div className="col-span-full border border-ui rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl text-[#323338] font-semibold">
              Certificates & Recognition
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Official certificates earned through verified volunteer work
            </p>
          </div>
          {profile.certificates && profile.certificates.length > 0 && (
            <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              {profile.certificates.length} {profile.certificates.length === 1 ? "Certificate" : "Certificates"}
            </span>
          )}
        </div>
        {!profile.certificates || profile.certificates.length === 0 ? (
          <div className="py-14 flex flex-col items-center justify-center text-gray-400">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Award size={40} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No certificates earned yet.</p>
            <p className="text-xs text-gray-400 mt-1.5 max-w-md text-center leading-relaxed">
              Complete volunteer projects and get reviewed by the organization to have your certificates issued here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {profile.certificates.map((cert: CertificateDto) => (
              <div
                key={cert.certId}
                className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:border-green-300 group cursor-default"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <Award size={20} className="text-green-600" />
                  </div>
                  <time
                    dateTime={cert.issuedAt}
                    className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md whitespace-nowrap"
                  >
                    {formatDate(cert.issuedAt)}
                  </time>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                  {cert.projectTitle}
                </h4>
                <p className="text-xs text-gray-500 mb-5 truncate">
                  {cert.organizationName}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                    Verified
                  </span>
                  <a
                    href={cert.certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-white bg-green-50 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink size={13} />
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
      </div>
  );
}
