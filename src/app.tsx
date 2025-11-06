import { Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from "./pages/landingpage";
import { SignInPage } from "./pages/sign-in";
import { ForgotPasswordForm } from "./pages/forgotPassword";
import { DashboardPage } from "./pages/dashboardPage";
import { PageNotFound } from "./pages/404 Page";

export const App:React.FC = function(){

    const navigate = useNavigate();

    return <Routes>
        <Route path='/' element= {<LandingPage onBackToSignUp={()=>navigate("/sign-up")} onBackToSignIn={()=>navigate("/sign-in")}/>} />
        <Route path='/sign-in' element= {<SignInPage onBackToSignUp={()=>navigate("/sign-in")} toForgotPassword="/forgot-password" toSignUp="/sign-up"/>} />
        <Route path='/forgot-password' element={<ForgotPasswordForm toSignUp="/sign-up"/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>

        <Route path="*" element ={<PageNotFound/>}/>
      </Routes>

}