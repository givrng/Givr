import { useState, type ReactNode } from "react"
import useScrollLock from "./scrollLock"


export function useModal(){
    const[child, setChild] = useState<ReactNode>(null)
    //const resolverRef = useRef<{resolve:()=>void}>(null)

    const modal = (child:ReactNode)=>{
        setChild(child)
    }

    const DisplayModal = ()=> child? <Modal>{child}</Modal>:null

    const Modal:React.FC<{children:ReactNode}> = ({children})=>{
    useScrollLock(true)
    return <div 
        className="fixed inset-0 bg-[#24242569] bg-opacity-100 items-center justify-center z-50  flex p-4"
        onClick={()=>setChild(null)} // Close on backdrop click
        >
            <div onClick={(e)=>e.stopPropagation()}>
                {children}
            </div>
        </div>
    }

    return {modal, DisplayModal}
}