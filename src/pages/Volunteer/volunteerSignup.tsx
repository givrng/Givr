import {  useNavigate, useSearchParams } from "react-router-dom"
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
      const baseUrl = import.meta.env.VITE_API_BASE_URL

      const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
      const submitRequest = (payload:any)=>{
         return  fetch(`${baseUrl}/volunteer/auth/signup`, {
            method: 'POST', 
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(payload), 
            signal: AbortSignal.timeout(7000)
          }
    )
      }
    const [param] = useSearchParams()
    const redirect = param.get("redirect")
    const signinPath = redirect? `/signin/volunteer?redirect=${redirect}`: "/signin/volunteer"
      
    return <SignupProvider>
        <>
            {step == 0 && <UserDetails redirect={redirect} formData={formData} setFormData={setFormData} next={()=>setStep(1)}/>}
            {step == 1 && <PickInterests nav={{onToSignIn: () => navigate(signinPath)}} back={()=>setStep(0)} selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} submitRequest={submitRequest}/>} 
        </>
        </SignupProvider>
    
}