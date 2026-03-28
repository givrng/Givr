import { useEffect, useState } from "react";

export const ShowToast:React.FC<{message:string}> = ({message})=>{
    const [showToast, setShowToast] = useState(false)

     useEffect(() => {
        if (showToast) {
          const timer = setTimeout(() => {
            setShowToast(false)
          
          }, 3000);
    
          return () => clearTimeout(timer);
        }
      }, [showToast]);


      return (
        <div 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 bg-white/[0.05] backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-2xl transition-all duration-500 ${
            showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">{message}</span>
        </div>
      )
}