import {  useNavigate } from "react-router-dom"
import { SignupProvider } from "../../components/Volunteer/sign-up/SignupContext"
import UserDetails from "../../components/sign-up/UserDetails"
import PickInterests from "../../components/sign-up/PickInterests"
import { useState } from "react"

export interface FormFields {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  state: string;
  lga: string;
  profileUrl:string;
}

export const VolunteerSignup = ()=>{
    const navigate = useNavigate();
    const [step, setStep] = useState(0)
      const [formData, setFormData] = useState<FormFields>({
          firstname: "",
          middlename: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          state: "",
          lga: "",
          profileUrl:""
        });

        const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
        
    return <SignupProvider>
        <>
            {step == 0 && <UserDetails formData={formData} setFormData={setFormData} next={()=>setStep(1)}/>}
            {step == 1 && <PickInterests nav={{onToSignIn: () => navigate("/signin/volunteer")}} back={()=>setStep(0)} selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests}/>} 
        </>
        </SignupProvider>
    
}