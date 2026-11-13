import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import SelectRole from "../components/Volunteer/sign-up/SelectRole";
import type { BasicNatigationProps } from "../interface/interfaces";
import { SignInComp } from "../components/signinComponent";
import { ForgotPasswordForm } from "../components/forgotPassword";
import { LegacyRedirect } from "../components/Auth/LegacyRedirect";

export const SignInPage:React.FC<BasicNatigationProps> = ()=>{
    const navigate = useNavigate();
    const [params] = useSearchParams()
    const redirect = params.get("redirect");

    // Used to redirect volunteers only, cause shared projects are meant for volunteers to checkout
    // I placed one inside select role to capture redirection path for volunteer role only. 
    // The idea here is this redirect will be updated last by the select role component
    let redirectSiginPath = redirect? `/volunteer?${redirect}`:"/volunteer"

    return (
        <Routes>
            <Route index element={<SelectRole isSignin={true}/>} />
            <Route path="volunteer/*" element={<SignInComp onToDashboard={()=>navigate(redirectSiginPath)} toSignUp={"/signup/volunteer"} toForgotPassword="forgot"/>} />
            <Route path='volunteer/forgot' element={<ForgotPasswordForm navProps={{
                toSignUp:"/signup"
            }} />} /> 

            <Route path="organization/*" element={<SignInComp onToDashboard={()=>navigate("/organization")} toSignUp="/signup/organization" toForgotPassword="forgot" isOrganization={true}/> } />
            <Route path='organization/forgot' element={<ForgotPasswordForm navProps={{
                toSignUp:"/signup"
            }} />} /> 

            {/* Individual accounts are now volunteer accounts; keep old links working */}
            <Route path="individual/*" element={<LegacyRedirect to="/signin/volunteer" />} />

        </Routes>
    )
}