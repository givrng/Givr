import ProfileAchievements from "./ProfileAchievement";
import {  PageLoader } from "./icons";

import type { ProfileProps} from "../interface/interfaces"
import { useEffect, useRef, useState } from "react";
import { EditProfile } from "./Volunteer/editProfile";
import useAuthFetch from "./hooks/useAuthFetch";


export const ProfilePage:React.FC<{editing?:boolean}> = ({editing = false})=> {

  const [isEditing, setIsEditing] = useState(editing)
  const [profile, setProfile] = useState<ProfileProps>({
    skills:[],
    rating: 5
  })
  const [isLoading, setIsLoading] = useState(false)
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

    // Poll for certificate updates every 30s while profile tab is open
    // This ensures cross-device updates (org admin on another machine) are picked up
    pollTimer = setInterval(() => {
      void loadProfile(true)
    }, 30000)

    return () => {
      isMounted = false
      if (pollTimer) clearInterval(pollTimer)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("storage", handleProfileRefresh as EventListener)
      window.removeEventListener("givr:certificate-updated", handleProfileRefresh as EventListener)
    }

  }, [profileChanged, isEditing])

  return (
    <div className="space-y-6 flex flex-col justify-center items-center">
      {isLoading && <PageLoader message="Loading your profile"/> }

      { isEditing?<EditProfile onClose={()=>{
        setIsEditing(false)
      }}
      profileProps={profile}
      /> : <ProfileAchievements
        profile={profile}
        onEditProfile={() => setIsEditing(true)}
        reload={()=>setProfileChanged(!profileChanged)}
      />}

    </div>
  );
}

export default ProfilePage;