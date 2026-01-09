import { createContext, useContext } from "react"
import useAuthFetch from "./useAuthFetch"

type AuthContextType = {
    authFetch:(url:string, init?:RequestInit)=> Promise<Response>;
    
}

const AuthContext = createContext<AuthContextType|undefined>(undefined)

export const AuthProvider:React.FC<{children:React.ReactNode} >  = ({children})=>{
    const {authFetch} = useAuthFetch("organization")

    return <AuthContext.Provider value={{authFetch}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = ()=> (useContext(AuthContext))