import { Route, Routes, useNavigate } from "react-router-dom"
import { SignupProvider } from "../../components/Volunteer/sign-up/SignupContext"
import UserDetails from "../../components/sign-up/UserDetails"
import PickInterests from "../../components/sign-up/PickInterests"

export const VolunteerSignup = ()=>{

    const navigate = useNavigate();
    return <SignupProvider>
        <Routes>
            <Route index element={<UserDetails onToInterest={() => navigate("interests", {relative: "path"})} />} />
            <Route path="interests" element={<PickInterests onToSignIn={() => navigate("/signin")} />} />
        </Routes>
        </SignupProvider>
    
}