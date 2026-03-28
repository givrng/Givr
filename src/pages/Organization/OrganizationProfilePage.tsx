
import { PageLoader } from "../../components/icons";

import type { OrganizationProfileProps, OrganizationProps, OrgContantProfileProps} from "../../interface/interfaces"
import { useEffect, useState } from "react";

import useAuthFetch from "../../components/hooks/useAuthFetch";
import OrganizationProfile from "../../components/Organization/OrgProfile";
import { EditOrgProfileModal } from "../../components/Organization/editOrgProfile";
import { EditOrgContactProfile } from "../../components/Organization/editOrgContactProfile";
import { useAlert } from "../../components/hooks/useAlert";


type CheckoutResponse = {
  checkoutUrl:string;
}
export const OrganizationProfilePage:React.FC<{editing?:boolean}> = ({editing = false})=> {

  const [isEditing, setIsEditing] = useState(editing)
  const {alertMessage, AlertDialog} = useAlert({
    isOrg: true
  })
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
      email:"",
      emailEditable:true,
      emailVerified:false
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [reload, setReload] = useState(false)

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
  
      let response = await API().post("/verification/initiate", data)
      let checkout = response.data as CheckoutResponse
      if(response.status == 200){
        setTimeout(()=>{
          alertMessage("You will be redirected to Paystack to complete payment")
        }, 1000)

        window.location.href = checkout.checkoutUrl
      }
      return response;
  }

  const handleContactUpdate =  async (data: OrgContantProfileProps)=>{
    try{
      let response = await API().patch("/profile", data)
      setProfile(response.data as OrganizationProfileProps)
    }catch {
      return Promise.reject()
    }
  }

  return (
    <div className="space-y-6 flex flex-col justify-center items-center">
      <AlertDialog/>
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
        emailChange={setProfile}
        save={handleContactUpdate}
        editOrgInfo={()=>setOrgEdit(true)}
        reload={()=>setReload(!reload)}
      />}

    </div>
  );
}

export default OrganizationProfilePage;