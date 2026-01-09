import React, { createContext, useContext, useState } from "react";
import type { FormDataProps } from "../../../interface/interfaces";


export type SignupContextType = {
    formData : Partial<FormDataProps>;
    setFormPayload: React.Dispatch<React.SetStateAction<Partial<FormDataProps>>>
}

const SignupContext = createContext<SignupContextType|undefined>(undefined);

export const SignupProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
    const [formData, setFormPayload] = useState<Partial<FormDataProps>>({})

    return <SignupContext.Provider value={{formData, setFormPayload}}>
        {children}
    </SignupContext.Provider>
}

export const useSignup = ()=> useContext(SignupContext)