import ProfileAchievements from "./ProfileAchievement";
import {  PageLoader } from "./icons";

import type { ProfileProps} from "../interface/interfaces"
import { useEffect, useState } from "react";
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

  useEffect(()=>{
    const loadProfile = async ()=>{
      try{
        setIsLoading(true)
        let response = await API().get("/profile")
        setProfile(prev=>({...prev, ...response.data as ProfileProps}))
      }finally{
        setIsLoading(false)
      }
    }

    loadProfile()

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