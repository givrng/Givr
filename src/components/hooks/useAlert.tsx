import { useCallback, useRef, useState } from "react";
import { Button } from "../ReuseableComponents";
import useScrollLock from "./scrollLock";

export function useAlert(){
    const [message, setMessage] = useState("")
    const resolverRef = useRef<(() => void) | null>(null);
    const alertMessage = useCallback((organization:string)=>{
        return new Promise<void>((resolve)=>{
            resolverRef.current = resolve
           setMessage(organization)
        })  
    }, [])

    const handleConfirm = ()=>{
        setMessage("")
        resolverRef.current?.()
        resolverRef.current = null
    }

    const SuccessAlert:React.FC<{onClose:()=>void, message:string}> = ({onClose, message})=>{
        useScrollLock(true)
        return <div className="fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-200">
        
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-7 h-7 text-gray-700 mr-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Done</h3>
            </div>
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
            {message}
        </p>

        <div className="flex justify-end">
            <Button onClick={onClose} variant="primary">
                Close
            </Button>
        </div>
    </div>
    }


    const AlertDialog = ()=> message? (<SuccessAlert onClose={handleConfirm} message={message}/>): null

    return {alertMessage, AlertDialog}
}