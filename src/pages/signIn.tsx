import { Route, Routes, useNavigate } from "react-router-dom";
import SelectRole from "../components/Volunteer/sign-up/SelectRole";
import type { BasicNatigationProps } from "../interface/interfaces";
import { SignInComp } from "../components/signinComponent";

export const SignInPage:React.FC<BasicNatigationProps> = ()=>{
    const navigate = useNavigate();

    return (
        <Routes>
            <Route index element={<SelectRole isSignin={true}/>} />
            <Route path="volunteer" element={<SignInComp onToDashboard={()=>navigate("/volunteer")} toSignUp="/signup/volunteeer" toForgotPassword="forgot"/>} />
            <Route path="organization" element={<SignInComp onToDashboard={()=>navigate("/organization")} toSignUp="/signup/organization" toForgotPassword="forgot" isOrganization={true}/> } />
        </Routes>
    )
}