import { Route, Routes, useNavigate, } from "react-router-dom"
import SelectRole from "../components/Volunteer/sign-up/SelectRole";

import type { BasicNatigationProps } from "../interface/interfaces";
import { SignupProvider } from "../components/Volunteer/sign-up/SignupContext";
import { VolunteerSignup } from "./Volunteer/volunteerSignup";
import { OrganizationSignup } from "./Organization/OrganizationSignupPage";
import { IndividualProfileSignup } from "./Individual/IndividualProfilePage";


export const SignUpPage: React.FC<BasicNatigationProps> = () => {
    const navigate = useNavigate()
    return (
        <SignupProvider>
            <Routes>
                <Route index element={<SelectRole isSignin={false} />} />
                <Route path="volunteer/" element={<VolunteerSignup />} />
                
                <Route path="organization/*" element={<OrganizationSignup onToSignIn={()=>navigate("/signin/organization")}/>} />
                <Route path="individual/*" element={<IndividualProfileSignup />} />

                <Route path="organization/*" element={<OrganizationSignup onToSignIn={()=>navigate("/signin/organization")}/>} />
            </Routes>
        </SignupProvider>
    )
}