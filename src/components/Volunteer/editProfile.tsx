import { useCallback, useEffect, useState } from "react"
import type {  location, ProfileProps, VolunteerProfileProps } from "../../interface/interfaces"
import { Button } from "../ReuseableComponents"
import LocationSelect from "../form/LocationSelect"
import { interestCategories } from "../interest"
import useAuthFetch from "../hooks/useAuthFetch"
import { useAlert } from "../hooks/useAlert"
import { PageLoader } from "../icons"
import { CloudinaryUpload } from "../CloudinaryWidget"

export const 
EditProfile:React.FC<{onClose?:()=>void, profileProps: ProfileProps}> = ({onClose, profileProps})=>{

    const [profile, setProfile] = useState<ProfileProps>({
        firstname:"",
        lastname: "",
        middleName:"",
        email: "",
        location:{
            state: "",
            lga: ""
        },  
        skills:[],
        profileUrl: ""
    })

    useEffect(()=>{
        setProfile(profileProps)
    }, [profileProps])

    const [loading, setLoading] = useState(false);
    const {API} = useAuthFetch( "volunteer")
    const {alertMessage, AlertDialog}= useAlert({isOrg:false})

    const [selectedInterestCategory, setSelectedInterestCategory] = useState("")

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let key = e.currentTarget.name as keyof VolunteerProfileProps ;
        let value = e.currentTarget.value
        setProfile({...profile, [key]:value})
    }

     const handleLocationChange = useCallback((location:location)=>{
        setProfile(prev=>({...prev, location: location}))
      }, [])
    const InputField:React.FC<{label:string, value:string, placeholder:string, type?:React.HTMLInputTypeAttribute, name:keyof ProfileProps}> = ({label, value, placeholder, type="text", name})=>(
        <div>
            <label htmlFor={label} className="block text-base font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input type={type} id="name" placeholder={placeholder} name={name} value={value} onChange={handleChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"/>
        </div>
    )

    const handleCancel = (e:React.MouseEvent<HTMLButtonElement>|undefined)=>{
        if(!e || !onClose) return;

        onClose()
    }

    const handleUpdate = async ()=>{
        try{
            setLoading(true)
            await API().patch("/profile", profile)
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
    <form className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-6">
            <img
                src={profile.profileUrl || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-600">
                Profile photo
                </span>

                <CloudinaryUpload
                folder="avatars"
                buttonText="Change Photo"
                onUploadSuccess={(url) => {
                    setProfile(prev => ({
                    ...prev,
                    profileUrl: url,
                    }));
                }}
                />

                <p className="text-xs text-gray-400">
                JPG, PNG or WEBP. Max 2MB.
                </p>
            </div>
        </div>
        


        {/* Name Input */}
        <InputField label={"First Name"} name="firstname" value={profile.firstname|| ""} placeholder="John" />
        <InputField label="Middle Name" name="middleName" value={profile.middleName || ""} placeholder="Paul"/>
        <InputField label={"Last Name"} name="lastname" value={profile.lastname || ""} placeholder="Doe"/>
        <InputField label={"Email"} name="email" value={profile.email || ""} placeholder="johndoe@gmail.com" type="email"/>
        {
            <>
                <div>
                    <label htmlFor="location"  className="block text-base font-semibold text-gray-700 mb-2">Location</label>
                    <LocationSelect onChange={handleLocationChange} state={profile.location?.state} lga={profile.location?.lga} />
                </div>
                
                {/* Required Skills */}
                <div>
                    <label htmlFor="requiredSkills" className="block text-base font-semibold text-gray-700 mb-2">
                        Interests 
                    </label>
                    <div className="grid grid-cols-2 gap-6">
                        <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8"
                        value={selectedInterestCategory}
                        onChange={e=>setSelectedInterestCategory(e.target.value)}
                        >
                            <option selected={true} hidden={true}>Category</option>
                            {interestCategories.map((interest, index)=><option value={interest.title} key={index}>{interest.title}</option>)}
                        </select>

                        <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8"
                        onChange={e=>setProfile(p=>({...p, skills: [...p.skills, e.target.value]}))}
                        >
                            <option selected={true} hidden={true}>Interest</option>
                            {
                                interestCategories
                                    .filter((cat=>cat.title == selectedInterestCategory))
                                    .flatMap(value =>value.items.filter(skill=>!profile.skills.includes(skill)).map((skill, index)=><option value={skill} key={index}>{skill}</option>)
                                    )
                            }
                        </select>
                    </div>
                    <div id="skills" className="flex gap-x-2 px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800">
                        {profile.skills.map((skill, i)=><span className="px-2 py-1 text-xs bg-gray-200 rounded-full flex items-center" key={skill}>
                            {skill}
                            <button className="ml-1 text-red-500" onClick={()=>setProfile(prev=>({...prev, skills: prev.skills.filter(s=>s != skill)}))} key={`${skill} ${i}`}>×</button>
                        </span>)}
                    </div>
                </div>
            </>
        }

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