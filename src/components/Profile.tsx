import ProfileAchievements from "./ProfileAchievement";
import {  PageLoader } from "./icons";

import type { ProfileProps} from "../interface/interfaces"
import { useEffect, useRef, useState } from "react";
import { EditProfile } from "./Volunteer/editProfile";
import useAuthFetch from "./hooks/useAuthFetch";
import { IdentityVerificationForm } from "./Volunteer/IdentityVerificationForm";
import { getVerificationState } from "../utils/verification";


type ProfilePageProps = {
  editing?: boolean;
  /** Open straight on the identity verification form (from the Initiatives page) */
  verifying?: boolean;
};

export const ProfilePage:React.FC<ProfilePageProps> = ({editing = false, verifying = false})=> {

  const [isEditing, setIsEditing] = useState(editing)
  const [isVerifying, setIsVerifying] = useState(verifying)
  const [profile, setProfile] = useState<ProfileProps>({
    skills:[],
    rating: 5
  })
  const [isLoading, setIsLoading] = useState(false)
  // The verification form pre-fills names and checks status, so it waits for real profile data
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [profileChanged, setProfileChanged] = useState(false);

  const {API} = useAuthFetch("volunteer")
  const apiRef = useRef(API)

  useEffect(() => {
    apiRef.current = API
  }, [API])

  useEffect(()=>{
    let isMounted = true
    let pollTimer: ReturnType<typeof setInterval> | null = null

    const loadProfile = async (silent = false)=>{
      try{
        if (!silent) setIsLoading(true)
        const response = await apiRef.current().get(`/profile?t=${Date.now()}`)
        if (!isMounted) return
        setProfile(prev=>({...prev, ...response.data as ProfileProps}))
        setProfileLoaded(true)
      } catch (error) {
        // Silently ignore polling errors — server may be temporarily unreachable
        if (!silent) console.error("Failed to load volunteer profile", error)
      } finally{
        if (isMounted && !silent) {
          setIsLoading(false)
        }
      }
    }

    // Handle storage events (cross-tab), custom events, and direct calls
    const handleProfileRefresh = (event?: Event | StorageEvent) => {
      // Always refresh on any certificate-related event or tab focus
      void loadProfile(true);
      // Prevent unused variable warning
      void event;
    }

    void loadProfile()

    const handleFocus = () => {
      void loadProfile(true)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadProfile(true)
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("storage", handleProfileRefresh as EventListener)
    window.addEventListener("givr:certificate-updated", handleProfileRefresh as EventListener)

    // Poll for certificate updates every 2 minutes while profile tab is open.
    // 120s aligns with industry standard (GitHub, Stripe, Jira) for dashboard polling.
    // Cross-device updates (org admin on another machine) also benefit from:
    //   - Instant refresh on tab focus/visibility change (lines above)
    //   - localStorage cross-tab sync (same browser)
    //   - CustomEvent for same-page updates
    pollTimer = setInterval(() => {
      void loadProfile(true)
    }, 120000)

    return () => {
      isMounted = false
      if (pollTimer) clearInterval(pollTimer)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("storage", handleProfileRefresh as EventListener)
      window.removeEventListener("givr:certificate-updated", handleProfileRefresh as EventListener)
    }

  }, [profileChanged, isEditing, isVerifying])

  // Someone who's already verified or in review has nothing to fill in
  const identityState = getVerificationState(profile.verificationStatus)
  const showVerificationForm = isVerifying && profileLoaded && (identityState === "unverified" || identityState === "failed")

  return (
    <div className="space-y-6 flex flex-col justify-center items-center">
      {isLoading && <PageLoader message="Loading your profile"/> }

      { showVerificationForm ? <IdentityVerificationForm
        profile={profile}
        onClose={() => setIsVerifying(false)}
      /> : isEditing?<EditProfile onClose={()=>{
        setIsEditing(false)
      }}
      profileProps={profile}
      /> : <ProfileAchievements
        profile={profile}
        onEditProfile={() => setIsEditing(true)}
        onVerifyIdentity={() => setIsVerifying(true)}
        reload={()=>setProfileChanged(!profileChanged)}
      />}

    </div>
  );
}

export default ProfilePage;