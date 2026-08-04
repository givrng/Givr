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

    const loadProfile = async ()=>{
      try{
        setIsLoading(true)
        const response = await apiRef.current().get(`/profile?t=${Date.now()}`)
        if (!isMounted) return
        setProfile(prev=>({...prev, ...response.data as ProfileProps}))
      } catch (error) {
        console.error("Failed to load volunteer profile", error)
      } finally{
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const handleProfileRefresh = (event?: Event | StorageEvent) => {
      const isRelevantEvent = !event || (event as StorageEvent).key === "givr:certificate-updated" || (event as CustomEvent).detail;
      if (!isRelevantEvent) return;
      void loadProfile();
    }

    void loadProfile()

    const handleFocus = () => {
      void loadProfile()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadProfile()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("storage", handleProfileRefresh as EventListener)
    window.addEventListener("givr:certificate-updated", handleProfileRefresh as EventListener)

    return () => {
      isMounted = false
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