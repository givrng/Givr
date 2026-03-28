import { Route, Routes, useNavigate } from "react-router-dom";
import SelectRole from "../components/Volunteer/sign-up/SelectRole";
import type { BasicNatigationProps } from "../interface/interfaces";
import { SignInComp } from "../components/signinComponent";
import { ForgotPasswordForm } from "../components/forgotPassword";

export const SignInPage:React.FC<BasicNatigationProps> = ()=>{
    const navigate = useNavigate();

    return (
        <Routes>
            <Route index element={<SelectRole isSignin={true}/>} />
            <Route path="volunteer/*" element={<SignInComp onToDashboard={()=>navigate("/volunteer")} toSignUp="/signup/volunteer" toForgotPassword="forgot"/>} />
            <Route path='volunteer/forgot' element={<ForgotPasswordForm navProps={{
                toSignUp:"/signup"
            }} />} /> 

            <Route path="organization/*" element={<SignInComp onToDashboard={()=>navigate("/organization")} toSignUp="/signup/organization" toForgotPassword="forgot" isOrganization={true}/> } />
            <Route path='organization/forgot' element={<ForgotPasswordForm navProps={{
                toSignUp:"/signup"
            }} />} /> 

        </Routes>
    )
}