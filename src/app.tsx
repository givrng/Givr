import { Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from "./pages/landingpage";
import { SignInPage } from "./pages/sign-in";
import { ForgotPasswordForm } from "./pages/forgotPassword";
import { DashboardPage } from "./pages/dashboardPage";
import { PageNotFound } from "./pages/404 Page";
import { SignUpPage } from "./pages/signup";

export const App:React.FC = function(){

    const navigate = useNavigate();

    return <>
      <Routes>
        <Route index element= {<LandingPage onToSignUp={()=>navigate("/sign-up")} onToSignIn={()=>navigate("/sign-in")}/>} />
        <Route path='sign-in' element= {<SignInPage onToSignUp={()=>navigate("/sign-in")} toForgotPassword="/forgot-password" toSignUp="/sign-up"/>} />
        <Route path='sign-up/*' element= {<SignUpPage onToSignIn={()=>navigate("/sign-in")}/>}/>
        <Route path='forgot-password' element={<ForgotPasswordForm toSignUp="/sign-up"/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>

        <Route path="*" element ={<PageNotFound toDashBoard="/dashboard" />}/>
      </Routes>
  
    </>

}