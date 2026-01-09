import React, { createContext, useContext, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import type { UserTypes } from "../../interface/interfaces";

export type AuthenticatedContextType= {
    isAuthenticated: Boolean;
    verify:(user:UserTypes)=>void;
    authChecked:boolean;
    logout:()=>void;
    signin: ()=>void;
}
const AuthContext = createContext<AuthenticatedContextType | undefined>(undefined)

export const AuthenticatedFlagProvider: React.FC<{children:React.ReactNode}> = ({children})=>{

    const [isAuthenticated, setIsAuthenicated] = useState<Boolean>(false);
    const [authChecked, setAuthChecked] = useState<boolean>(false);

    const {API} = useAuthFetch("")

    const verify = async (user:UserTypes)=>{
        try{
            await API().get(`${user}/dashboard`)
            console.log("Resolved")
            setIsAuthenicated(true)
        }catch{
            setIsAuthenicated(false)
        }finally{
            setAuthChecked(true)
        }
    }

    const logout = ()=>{
        setIsAuthenicated(false)
    }

    const signin = ()=>{
        setIsAuthenicated(true)
    }
    


    return <AuthContext.Provider value={{isAuthenticated, logout, signin, verify, authChecked}}>
        {children}
    </AuthContext.Provider>
}

export const useVerifyAuth = ()=>useContext(AuthContext)