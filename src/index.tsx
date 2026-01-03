import { Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from "./pages/landingpage"
import { SignInPage } from "./pages/signIn"
import { SignUpPage } from "./pages/signup"
import { VolunteerApp } from "./volunteerApp"
import { OrganizationApp } from "./organizationApp"
import { PageNotFound } from "./pages/Volunteer/404 Page"

import { AuthenticatedFlagProvider } from "./components/Auth/AuthContext"



export const IndexPage = ()=>{
    const navigate = useNavigate()

    return <>
        <AuthenticatedFlagProvider>
          <Routes>
          <Route index element={<LandingPage onToVolunteerSignUp={() => navigate("/signup/volunteer")} onToOrgSignUp={() => navigate("/signup/organization")} onToSignIn={()=>navigate("/signin")} onToSignUp={()=>navigate("/signup")}/>} />
          <Route path='signin/*' element={<SignInPage onToDashboard={() => navigate("/dashboard")} onToSignUp={() => navigate("/signin")} toForgotPassword="/forgot-password" toSignUp="/signup" />} />
          <Route path='signup/*' element={<SignUpPage />} />  
          <Route path='volunteer/*' element={<VolunteerApp/>}/>
          <Route path='organization/*' element={<OrganizationApp/>}/>

          <Route path="*" element={<PageNotFound toDashBoard="/dashboard" />} />
        </Routes>
        </AuthenticatedFlagProvider>
        </>
}