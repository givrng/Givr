import { Route, Routes, useNavigate } from "react-router-dom"
import SelectRole from "../components/sign-up/SelectRole";
import UserDetails from "../components/sign-up/UserDetails";
import PickInterests from "../components/sign-up/PickInterests";
import type { BasicNatigationProps } from "../interface/interfaces";

export const SignUpPage:React.FC<BasicNatigationProps> = ()=>{
    const navigate = useNavigate();

    return (
        <Routes>
            <Route index element={<SelectRole toVolunteerDetails="details"/>} />
            <Route path="details" element={<UserDetails onToInterest={(userId)=>navigate("../interests", {relative: "path", state: {userId: userId}})}/>} />
            <Route path="interests" element={<PickInterests onToSignIn={()=>navigate("/sign-in")} />} />
        </Routes>
    )
}