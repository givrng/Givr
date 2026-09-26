import React, { createContext, useContext, useRef, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import type { UserTypes } from "../../interface/interfaces";

export type AuthenticatedContextType= {
    isAuthenticated: boolean;
    verify:(user:UserTypes)=>void;
    authChecked:boolean;
    logout:()=>void;
    signin: ()=>void;
    currentUser: AuthDetails|null;
    setCurrentUser:(user:AuthDetails)=>void
}

export interface AuthDetails {
    userId: string;
    email: string;
}
const AuthContext = createContext<AuthenticatedContextType | undefined>(undefined)

export const AuthenticatedFlagProvider: React.FC<{children:React.ReactNode}> = ({children})=>{

    const authUser = useRef<AuthDetails|null>(null)
    let currentUser = authUser.current
    const [isAuthenticated, setIsAuthenicated] = useState<boolean>(false);
    const [authChecked, setAuthChecked] = useState<boolean>(false);

    const {API} = useAuthFetch("")

    const verify = async (user:UserTypes)=>{
        try{
            let response = await API().get(`${user}/me/details`)
            let authDetails = response.data as AuthDetails;
            setCurrentUser(authDetails)
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
    
    const setCurrentUser = (user:AuthDetails)=>{
        authUser.current = user;
    }
    

    return <AuthContext.Provider value={{isAuthenticated, logout, signin, verify, authChecked, currentUser, setCurrentUser}}>
        {children}
    </AuthContext.Provider>
}

export const useVerifyAuth = ()=>useContext(AuthContext)