import { Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from "./pages/landingpage"
import { SignInPage } from "./pages/signIn"
import { SignUpPage } from "./pages/signup"
import { ForgotPasswordForm } from "./components/forgotPassword"
import { VolunteerApp } from "./volunteerApp"
import { OrganizationApp } from "./organizationApp"
import { PageNotFound } from "./pages/Volunteer/404 Page"



export const IndexPage = ()=>{
    const navigate = useNavigate()

    return <>
        <Routes>

          <Route index element={<LandingPage onToSignUp={() => navigate("/signup")} onToSignIn={() => navigate("/signin")} />} />
          <Route path='signin/*' element={<SignInPage onToDashboard={() => navigate("/dashboard")} onToSignUp={() => navigate("/signin")} toForgotPassword="/forgot-password" toSignUp="/signup" />} />
          <Route path='signup/*' element={<SignUpPage />} />
          <Route path='forgot-password' element={<ForgotPasswordForm toSignUp="/signup" />} />   
               
          <Route path='/volunteer/*' element={<VolunteerApp/>}/>
          <Route path='/organization/*' element={<OrganizationApp/>}/>

          <Route path="*" element={<PageNotFound toDashBoard="/dashboard" />} />
        </Routes>
        </>
}