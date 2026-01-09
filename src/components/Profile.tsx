import ProfileAchievements from "./ProfileAchievement";
import { BadgeIcon, PageLoader } from "./icons";

import type { ProfileProps} from "../interface/interfaces"
import { useEffect, useState } from "react";
import { EditProfile } from "./Volunteer/editProfile";
import useAuthFetch from "./hooks/useAuthFetch";

// const data: MyCertificationProps[] = [
//   {
//     id: "1",
//     title: "Frontend Developer",
//     organization: {
//       name: "TechCorp Ltd",
//       status: "VERIFIED",
//       category: ["Technology", "Education"],
//     },
//     earned: "2025-11-10",
//     hoursContributed: 5,
//     userName: "Habib Yusuf",
//     role: "super volunteer",
//   },
//   {
//     id: "2",
//     title: "Graphic Designer",
//     organization: {
//       name: "Designify Studios",
//       status: "VERIFIED",
//       category: ["Technology", "Education"],
//     },
//     earned: "2025-11-10",
//     hoursContributed: 7,
//     userName: "Habib Yusuf",
//     role: "super volunteer",
//   },
//   {
//     id: "3",
//     title: "UI/UX Designer",
//     organization: {
//       name: "SoftBridge",
//       status: "VERIFIED",
//       category: ["Technology", "Education"],
//     },
//     earned: "2025-11-10",
//     hoursContributed: 5,
//     userName: "Habib Yusuf",
//     role: "super volunteer",
//   },
// ];


const sampleBadges = [
  {
    id: 1,
    icon: <BadgeIcon  />,
    description: "Community Helper",
    earned: true,
  },
  {
    id: 2,
    icon: <BadgeIcon />,
    description: "Community Helper",
    earned: false,
  },
  {
    id: 3,
    icon: <BadgeIcon />,
    description: "Community Helper",
    earned: false,
  },
  {
    id: 4,
    icon: <BadgeIcon />,
    description: "Community Helper",
    earned: false,
  },
];

export const ProfilePage:React.FC<{editing?:boolean}> = ({editing = false})=> {

  const [isEditing, setIsEditing] = useState(editing)
  const [profile, setProfile] = useState<ProfileProps>({
    skills:[],
    rating: 5,
  })
  const [isLoading, setIsLoading] = useState(false)


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

  }, [])

  return (
    <div className="p-6 space-y-6 flex flex-col justify-center items-center">
      {isLoading && <PageLoader message="Loading your profile"/> }

      { isEditing?<EditProfile onClose={()=>{
        setIsEditing(false)
      }}
      profileProps={profile}
      /> : <ProfileAchievements
        profile={profile}
        badges={sampleBadges}
        onEditProfile={() => setIsEditing(true)}
      />}

    </div>
  );
}

export default ProfilePage;