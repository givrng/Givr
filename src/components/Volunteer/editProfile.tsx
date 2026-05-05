import { useCallback, useEffect, useState, type FormEvent } from "react"
import type {  location, ProfileProps, VolunteerProfileProps } from "../../interface/interfaces"
import { Button } from "../ReuseableComponents"
import LocationSelect from "../form/LocationSelect"
import { interestCategories } from "../interest"
import useAuthFetch from "../hooks/useAuthFetch"
import { useAlert } from "../hooks/useAlert"
import { PageLoader } from "../icons"
import { CloudinaryUpload } from "../CloudinaryWidget"
import { useConfirmAsk } from "../hooks/useConfirm"

interface VolunteerUpdateErrors  {
    firstname:string;
    lastname:string;
    email:string;
    middlename:string;
    state:string;
    lga:string;
    interests:string;
}
const InputField:React.FC<{label:string, isRequired?:boolean, 
        value:string, placeholder:string, 
        type?:React.HTMLInputTypeAttribute, name:keyof ProfileProps, 
        isDisabled?:boolean, error?:string, handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = ({label, value, placeholder, type="text", name, isDisabled=false, isRequired=true, error, handleChange})=>{
        
        const borderClasses = error ? "border border-red-500 focus:ring-red-500": "border-ui focus:ring-blue-500";
        
        return <div>
            <label htmlFor={label} className="block text-base font-semibold text-gray-700 mb-2">
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input type={type} id="name" placeholder={placeholder} name={name} value={value} onChange={handleChange}
            disabled={isDisabled}
                   className={"w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-150 text-gray-800" + `${isDisabled?' cursor-not-allowed':`${borderClasses}`}`}/>
        </div>
    
    }
export const EditProfile:React.FC<{onClose?:()=>void, profileProps: ProfileProps}> = ({onClose, profileProps})=>{

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
        profileUrl: "",
        emailEditable: true
    })

    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:false})
    const [loading, setLoading] = useState(false);
    const {API} = useAuthFetch( "volunteer")
    const {alertMessage, AlertDialog}= useAlert({isOrg:false})
    
    const [errors, setErrors] = useState<Partial<VolunteerUpdateErrors>>({});

    const [selectedInterestCategory, setSelectedInterestCategory] = useState("")

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let key = e.currentTarget.name as keyof VolunteerProfileProps ;
        let value = e.currentTarget.value
        setProfile({...profile, [key]:value})
    }

    const handleLocationChange = useCallback((location:location)=>{
        setProfile(prev=>({...prev, location: location}))
      }, [])

    

    const ErrorMsg:React.FC<{error:string}> = ({error})=>{
        return <p className="text-red-500 text-sm mt-1">
            {error}
        </p>
    }

    useEffect(()=>{
        setProfile(profileProps)
    }, [profileProps])


    const handleCancel = (e:React.MouseEvent<HTMLButtonElement>|undefined)=>{
        if(!e || !onClose) return;

        onClose()
    }

    const handleUpdate = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        const errors = validateForm()
        console.log(profile)
        if(Object.keys(errors).length > 0){
            setErrors(errors)
            return
        }

        const userResponse = await confirmAsk({
            question:"Are you sure you want to update profile?",
            trueAnswer: "Update",
            falseAnswer: "Cancel"
        })

        if(!userResponse)
            return

        try{
            setLoading(true)
            await API().patch("/profile", profile)
            if (onClose) 
                onClose()
        }catch{
            await alertMessage("An unexptected error occured, failed to update profile")
        }finally{
            setLoading(false)
        }
    }

    const validateForm = (): Partial<VolunteerUpdateErrors> => {
          const newErrors: Partial<VolunteerUpdateErrors> = {};
    
          // First name validation
          if (!profile.firstname?.trim()) {
            newErrors.firstname = "First name is required";
          } else if (profile.firstname.trim().length < 2) {
            newErrors.firstname = "First name must be at least 2 characters";
          }
    
          // Middle name validation (optional but validate length if provided)
          if (
            profile.middleName &&
            profile.middleName.trim().length > 0 &&
            profile.middleName.trim().length < 2
          ) {
            newErrors. middlename= "Middle name must be at least 2 characters";
          }
    
          // Last name validation
          if (!profile?.lastname?.trim()) {
            newErrors.lastname = "Last name is required";
          } else if (profile.lastname.trim().length < 2) {
            newErrors.lastname = "Last name must be at least 2 characters";
          }
    
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!profile.email) {
            newErrors.email = "Email is required";
          } else if (!emailRegex.test(profile.email)) {
            newErrors.email = "Please enter a valid email address";
          }
    
    
        if (!profile.location?.state) newErrors.state = "State is required";
        if (!profile.location?.lga) newErrors.lga = "LGA is required";
    
        if(profile.skills?.length < 1){
            newErrors.interests = "Please select atleast 1 interest or skill"
        }
          return newErrors;
        };

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
        <InputField label={"First Name"} name="firstname" value={profile.firstname|| ""} placeholder="John" error={errors?.firstname} handleChange={handleChange}/>
        {errors?.firstname && <ErrorMsg error={errors?.firstname}/>}
        <InputField label="Middle Name" isRequired={false} name="middleName" value={profile.middleName || ""} placeholder="Paul" error={errors?.middlename} handleChange={handleChange}/>
         {errors?.middlename && <ErrorMsg error={errors?.middlename}/>}
        <InputField label={"Last Name"} name="lastname" value={profile.lastname || ""} placeholder="Doe" error={errors?.lastname} handleChange={handleChange}/>
         {errors?.lastname && <ErrorMsg error={errors?.lastname}/>}
        <InputField label={"Email"} name="email" value={profile.email || ""} placeholder="johndoe@gmail.com" type="email" isDisabled={!profile.emailEditable} error={errors?.email} handleChange={handleChange}/>
         {errors?.email && <ErrorMsg error={errors?.email}/>}
        
        {
            <>
                <div>
                    <label htmlFor="location"  className="block text-base font-semibold text-gray-700 mb-2">Location (State of residence) <span className="text-red-500 ml-1">*</span></label>
                    {errors?.state && <ErrorMsg error={errors?.state}/>}
                    <LocationSelect onChange={handleLocationChange} state={profile.location?.state} lga={profile.location?.lga} />
                    {errors?.lga && <ErrorMsg error={errors?.lga}/>}
                    
                </div>
                
                {/* Required Skills */}
                <div>
                    <label htmlFor="requiredSkills" className="block text-base font-semibold text-gray-700 mb-2">
                        Interests<span className="text-red-500 ml-1">*</span>
                    </label>
                    {errors?.interests && <ErrorMsg error={errors?.interests}/>}
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
                            required
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
            <Button variant={"primary"}>
                Update
            </Button>
        </div>
    </form>
</div>
</>
)
}