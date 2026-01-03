import type {  OrganizationProfileProps, OrganizationProps } from "../../interface/interfaces";
import { Button } from "../ReuseableComponents";
import { ChangePasswordModal, type ChangePasswordFormFields } from "../ChangePassword";

import {  useState } from "react";
import { VerifyEmailOtpModal } from "../VerifyOtpModal";

interface OrgProfileComponentProps {
  profile: OrganizationProfileProps;
  org: OrganizationProps;
  onEditProfile: () => void;
  editOrgInfo: ()=>void;
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



export default function OrganizationProfile({profile, onEditProfile, editOrgInfo}: OrgProfileComponentProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [otpIsOpen, setOtpIsOpen] = useState(false)
    const onClick = ()=>{
        setIsOpen(true)
    }

    const UserProfileSection = () => (
        <div className="border border-ui rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#323338]">
              Personal Profile
            </h3>

            <Button
              variant="green"
              className="text-xs px-4 py-1"
              onClick={onEditProfile}
            >
              Edit Profile
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <img
              src={profile.organization.profileUrl || `https://avatar.iran.liara.run/username?username=${profile.organizationContact.contactFirstname}+${profile.organizationContact.contactLastname}`}
              alt={profile.organizationContact.contactFirstname}
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="text-sm">
              <p className="font-semibold text-base">
                {profile.organizationContact.contactLastname} {profile.organizationContact.contactFirstname}{" "}
                {profile.organizationContact.contactMiddleName || ""}
              </p>

              <p className="text-[#676879]">{"Organization"}</p>

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

      const OrganizationProfileSection = () => (
    <div className="border border-ui rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#323338]">
          Organization Profile
        </h3>

        {!profile.organization.profileCompleted && (
          <button
            onClick={() => {
              onEditProfile()
              editOrgInfo()
            }}
            className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100"
          >
            Edit Organization
          </button>
        )}
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
          value={profile.organization.status === "VERIFIED" ? "Verified" : "Not Verified"}
          highlight={profile.organization.status === "VERIFIED"}
        />
      </div>

      {profile.organization.status === "VERIFIED" && (
        <p className="text-xs text-gray-500 mt-4">
          Organization details are locked after CAC verification.
        </p>
      )}
    </div>
);

    return (
    <div className=" grid lg:grid-cols-6 gap-8 w-full ">
    
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

              {false ? (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Verified
                </span>
              ) : (
                <button
                  onClick={()=>{
                    setOtpIsOpen(!otpIsOpen)
                  }}
                  className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100"
                >
                  {otpIsOpen? "Cancel":"Verify Email"}
                </button>
              )}
            </div>
            <VerifyEmailOtpModal email="jedidiah@gmail.com" isOpen={otpIsOpen} onSubmit={async ()=>{}}/>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-y-2">
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
              onClick={onClick}
              className="text-xs font-semibold text-[red] bg-red-100 px-3 py-1 rounded-full hover:bg-red-200"
            >
              Change Password
            </button>
          </div>
          <ChangePasswordModal email="jediddiah@gmail.com" isOpen={isOpen} onClose={()=>{setIsOpen(false)}} onSubmit={async (p:ChangePasswordFormFields)=>{
            let x = p;
            console.log(x)
          }} />
          </div>

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
