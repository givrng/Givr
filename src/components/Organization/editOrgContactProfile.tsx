import { useEffect, useState, type FormEvent } from "react"
import type {  EmailExistProps, OrgContantProfileProps } from "../../interface/interfaces"
import { Button } from "../ReuseableComponents"

import { useAlert } from "../hooks/useAlert"
import { PageLoader } from "../icons"
import useAuthFetch from "../hooks/useAuthFetch"
import { useConfirmAsk } from "../hooks/useConfirm"

export const InputField:React.FC<{label:string, value:string, placeholder:string, type?:React.HTMLInputTypeAttribute, name:keyof OrgContantProfileProps, errors?:OrgProfilePropsErr, handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void, disabled?:boolean}> = ({label, value, placeholder, type="text", name, handleChange, errors, disabled=false})=>(
        <div>
            <label htmlFor={label} className="block text-base font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input type={type} id="name" placeholder={placeholder} name={name} value={value} onChange={handleChange} 
            disabled={disabled}
                   className={"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800" + `${disabled? ' cursor-not-allowed': ''}`}/>
                   {(errors && errors.active) && <span className="text-red-500 ml-1">{errors.errMsg}</span>}
        </div>
    )

type OrgProfilePropsErr = {
    errMsg: string;
    active:boolean;
}

type Errors = {
    firstName?: OrgProfilePropsErr;
    lastName?: OrgProfilePropsErr;
    email?: OrgProfilePropsErr;
}

export const EditOrgContactProfile:React.FC<{onClose?:()=>void, profileProps: OrgContantProfileProps, onSubmit:(data: OrgContantProfileProps)=>Promise<undefined>}> = ({onClose, profileProps, onSubmit})=>{

    const [profile, setProfile] = useState<OrgContantProfileProps>({
        contactFirstname:"",
        contactLastname: "",
        contactMiddleName:"",
        contactPersonProfileUrl:"",
        email: "",
        phoneNumber:"",
        emailVerified:false,
        emailEditable: true
    })
    let [emailChanged, setEmailChanged] = useState(false);
    const [profileErrors, setProfileErrors] = useState<Errors>({
        email: {
            active:false,
            errMsg: ""
        },
        firstName: {
            active: false,
            errMsg: ""
        },
        lastName: {
            active:false,
            errMsg: ""
        }
    })

    const {API} = useAuthFetch("organization")

    useEffect(()=>{
        setProfile(profileProps)
    }, [profileProps])

    const [loading, setLoading] = useState(false);
    
    const {alertMessage, AlertDialog}= useAlert({isOrg:false})

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let key = e.currentTarget.name as keyof OrgContantProfileProps;
        if(key == "email")
            setEmailChanged(!emailChanged)
        let value = e.currentTarget.value
        setProfile({...profile, [key]:value})
    }
    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:true})
  
    const handleCancel = (e:React.MouseEvent<HTMLButtonElement>|undefined)=>{
        if(!e || !onClose) return;

        onClose()
    }

    const handleUpdate = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        if(formErrorExists() || profileErrors.email?.active)
            return;

        let response = await confirmAsk({
            question: "Are you sure you want to update profile?",
            trueAnswer: "Update",
            falseAnswer: "Cancel"
        })

        if(!response)
            return 
        
        try{
            setLoading(true)
            await onSubmit(profile)
            if (onClose) 
                onClose()
        }catch{
            await alertMessage("An unexptected error occured, failed to update profile")
        }finally{
            setLoading(false)
        }
    }

    const formErrorExists = ()=>{
        const err:Errors = {} 

        if(profile.contactFirstname == "")
            err.firstName = {active: true, errMsg: "Firstname is required"}
        
        if(profile.contactLastname == "")
            err.lastName = {active: true, errMsg: "Lastname is required"}
        
        return Object.keys(err).length != 0;
    } 

    useEffect(()=>{
        
        const delay = setTimeout(async ()=>{
            let response = await API().get(`profile/email/exists?email=${profile.email}`)
            let data = response.data as EmailExistProps
            setProfileErrors(prev =>({
                ...prev, 
                email: {
                    active: data.exists,
                    errMsg: data.exists? "A user with email exists": ""
                }
            }))
        }, 500)

        return ()=>{
            clearTimeout(delay)
        }
        
    }, [emailChanged])
    return(
    <>
    <AlertDialog/>
    <ConfirmDialog/>
    {loading && <PageLoader/>}
    <div className="bg-white p-8 rounded-xl shadow-2xl  w-full border border-gray-200">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
        Edit Profile
    </h2>
    <form className="space-y-6" onSubmit={handleUpdate}> 
            
        {/* Name Input */}
        <InputField label={"First Name"} name="contactFirstname" value={profile.contactFirstname|| ""} placeholder="John" handleChange={handleChange} errors={profileErrors.firstName}/>
        <InputField label="Middle Name" name="contactMiddleName" value={profile.contactMiddleName || ""} placeholder="Paul" handleChange={handleChange} />
        <InputField label={"Last Name"} name="contactLastname" value={profile.contactLastname || ""} placeholder="Doe" handleChange={handleChange} errors={profileErrors.lastName}/>
        <InputField label={"Email"} name="email" value={profile.email || ""} placeholder="johndoe@gmail.com" type="email" handleChange={handleChange} errors={profileErrors.email} disabled={!profile.emailEditable}/>
        
        {/* Action Buttons */}
        <div className="flex justify-end pt-4 space-x-4">
            <Button variant="outline"
            onClick={(e)=>{
                handleCancel(e)
            }}
            >
                Cancel
            </Button>
            <Button variant={"green"} >
                Update
            </Button>
        </div>
    </form>
</div>
</>
)
}