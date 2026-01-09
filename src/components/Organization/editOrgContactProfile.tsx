import { useEffect, useState } from "react"
import type {  OrgContantProfileProps } from "../../interface/interfaces"
import { Button } from "../ReuseableComponents"

import { useAlert } from "../hooks/useAlert"
import { PageLoader } from "../icons"

const InputField:React.FC<{label:string, value:string, placeholder:string, type?:React.HTMLInputTypeAttribute, name:keyof OrgContantProfileProps, handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = ({label, value, placeholder, type="text", name, handleChange})=>(
        <div>
            <label htmlFor={label} className="block text-base font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input type={type} id="name" placeholder={placeholder} name={name} value={value} onChange={handleChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"/>
        </div>
    )

export const EditOrgContactProfile:React.FC<{onClose?:()=>void, profileProps: OrgContantProfileProps, onSubmit:(data: OrgContantProfileProps)=>Promise<void>}> = ({onClose, profileProps, onSubmit})=>{

    const [profile, setProfile] = useState<OrgContantProfileProps>({
        contactFirstname:"",
        contactLastname: "",
        contactMiddleName:"",
        email: "",
        phoneNumber:"",
        emailVerified: false,
    })

    useEffect(()=>{
        setProfile(profileProps)
    }, [profileProps])

    const [loading, setLoading] = useState(false);
    
    const {alertMessage, AlertDialog}= useAlert({isOrg:false})
 
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let key = e.currentTarget.name as keyof OrgContantProfileProps ;
        let value = e.currentTarget.value
        setProfile({...profile, [key]:value})
    }


    const handleCancel = (e:React.MouseEvent<HTMLButtonElement>|undefined)=>{
        if(!e || !onClose) return;

        onClose()
    }

    const handleUpdate = async ()=>{
        
        try{
            setLoading(true)
            await onSubmit(profile)
            if (onClose) 
                onClose()
        }catch{
            await alertMessage("An unexptected error occured, failed to update profile")
        }finally{
            setLoading(false)
            console.log(profile)
        }
    }
    return(
    <>
    <AlertDialog/>
    {loading && <PageLoader/>}
    <div className="bg-white p-8 rounded-xl shadow-2xl  w-full border border-gray-200">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
        Edit Profile
    </h2>
    <form className="space-y-6" >     
        {/* Name Input */}
        <InputField label={"First Name"} name="contactFirstname" value={profile.contactFirstname|| ""} placeholder="John" handleChange={handleChange}/>
        <InputField label="Middle Name" name="contactMiddleName" value={profile.contactMiddleName || ""} placeholder="Paul" handleChange={handleChange}/>
        <InputField label={"Last Name"} name="contactLastname" value={profile.contactLastname || ""} placeholder="Doe" handleChange={handleChange}/>
        <InputField label={"Email"} name="email" value={profile.email || ""} placeholder="johndoe@gmail.com" type="email" handleChange={handleChange}/>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 space-x-4">
            <Button variant="outline"
            onClick={(e)=>{
                handleCancel(e)
            }}
            >
                Cancel
            </Button>
            <Button variant={"primary"} onClick={handleUpdate}>
                Update
            </Button>
        </div>
    </form>
</div>
</>
)
}