import { Navigate } from "react-router-dom"
import { useVerifyAuth } from "./AuthContext"
import { useEffect } from "react"
import { PageLoader } from "../icons"

export const RequireAuth:React.FC<{children:React.ReactNode, user:"volunteer"|"organization"}> = ({children, user})=>{
    const verifyAuth = useVerifyAuth()
    
    useEffect(()=>{
        verifyAuth?.verify(user)
    }, [user])

    if(!verifyAuth?.authChecked)
        return <PageLoader color={user=="volunteer"?"blue":"green"}/>
    
    return verifyAuth?.isAuthenticated? children : <Navigate to={"/signin"} replace/>
}