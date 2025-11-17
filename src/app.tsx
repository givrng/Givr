import { Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from "./pages/landingpage";
import { SignInPage } from "./pages/sign-in";
import { ForgotPasswordForm } from "./pages/forgotPassword";
import { DashboardPage } from "./pages/dashboardPage";
import { PageNotFound } from "./pages/404 Page";
import { SignUpPage } from "./pages/signup";
import Profile from "./components/Profile";

export const App:React.FC = function(){

    const navigate = useNavigate();

    return <>
      <Routes>
        <Route index element= {<LandingPage onToSignUp={()=>navigate("/signup")} onToSignIn={()=>navigate("/signin")}/>} />
        <Route path='signin' element= {<SignInPage onToDashboard={()=>navigate("/dashboard")} onToSignUp={()=>navigate("/signin") } toForgotPassword="/forgot-password" toSignUp="/signup"/>} />
        <Route path='signup/*' element= {<SignUpPage onToSignIn={()=>navigate("/signin")}/>}/>
        <Route path='forgot-password' element={<ForgotPasswordForm toSignUp="/signup"/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>
        <Route path='/profile' element={<Profile />}/>

        <Route path="*" element ={<PageNotFound toDashBoard="/dashboard" />}/>
      </Routes>

    </>

}