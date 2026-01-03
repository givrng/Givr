
import { PageLoader } from "../../components/icons";

import type { OrganizationProfileProps, OrganizationProps, OrgContantProfileProps} from "../../interface/interfaces"
import { useEffect, useState } from "react";

import useAuthFetch from "../../components/hooks/useAuthFetch";
import OrganizationProfile from "../../components/Organization/OrgProfile";
import { EditOrgProfileModal } from "../../components/Organization/editOrgProfile";
import { EditOrgContactProfile } from "../../components/Organization/editOrgContactProfile";



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
      email:""
    }
  })
  const [isLoading, setIsLoading] = useState(false)

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
    }catch{
      return Promise.reject()
    }
  }

  const handleContactUpdate =  async (data: OrgContantProfileProps)=>{
    try{
      let response = await API().patch("/profile", data)
      setProfile(response.data as OrganizationProfileProps)
    }catch{
      return Promise.reject()
    }
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
        org={profile?.organization}
        onEditProfile={()=>{
          setIsEditing(true) 
        } }
        editOrgInfo={()=>setOrgEdit(true)}
      />}

    </div>
  );
}

export default OrganizationProfilePage;