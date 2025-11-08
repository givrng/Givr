import { useState } from "react"
import type { VolunteerProfileProps } from "../interface/interfaces"
import { Button } from "./ReuseableComponents"

export const EditProfile = ()=>{

    const [profile, setProfile] = useState<VolunteerProfileProps>({
        firstName:"",
        lastName: "",
        email: "",
        Location:""
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let key = e.currentTarget.name as keyof VolunteerProfileProps;
        let value = e.currentTarget.value
        setProfile({...profile, [key]:value})
    }

    const InputField:React.FC<{label:string, value:string}> = ({label, value})=>(
        <div>
            <label htmlFor={label} className="block text-base font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input type="text" id="name" placeholder="John Doe" name={label} value={value} onChange={handleChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"/>
        </div>
    )
    return(
    <div className="bg-white p-8 rounded-xl shadow-2xl  w-full border border-gray-200">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
        Edit Profile
    </h2>
    <form className="space-y-6">
        {/* Name Input */}
        <InputField label={profile.firstName} value={profile.firstName} key={profile.firstName}/>
        <InputField label={profile.lastName} value={profile.lastName} key={profile.lastName}/>
        <InputField label={profile.lastName} value={profile.lastName} key={profile.email}/>
        <InputField label={profile.Location} value={profile.Location} key={profile.Location}/>

        {/* Action Buttons */}
        <div className="flex justify-start pt-4 space-x-4">
            <Button variant="primary">
                Update
            </Button>
            <Button variant="outline">
                Cancel
            </Button>
        </div>
    </form>
</div>
)
}