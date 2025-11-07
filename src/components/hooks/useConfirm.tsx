import { useCallback, useRef, useState } from "react";
import { Button} from "../ReuseableComponents";
import useScrollLock from "./scrollLock";

export function useConfirmAsk(){
    interface confirmProps {question:string; trueAnswer:string; falseAnswer:string}
    
    const [props, setProps] = useState<confirmProps>({
        question: "",
        trueAnswer:"",
        falseAnswer: ""
    })
    const resolverRef = useRef<(value: boolean) => void>(null);

    const confirmAsk = useCallback((props:confirmProps) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve 
        setProps(props);
    });
  }, []);

  const handleConfirm = (result: boolean) => {
    resolverRef.current?.(result);
    setProps( {...props, question: ""} );
  };

  const ConfirmationDailog:React.FC<{onApply:()=>void; onCancel:()=>void;}> = ({onApply, onCancel})=>{
    useScrollLock(true)
    return <div className="fixed top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50 p-6 rounded-xl shadow-xl w-full max-w-sm border border-blue-100">
      
      <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6 text-blue-600 mr-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Apply to project</h3>
          </div>
          <Button onClick={onCancel} variant="void" className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
          </Button>
      </div>
  
      <p className="text-gray-700 mb-6">
          {props.question}
      </p>
  
      <div className="flex justify-end space-x-3">
          <Button variant="primary" onClick={onApply}>
              {props.trueAnswer}
          </Button>
          <Button variant="outline" onClick={onCancel}>
              {props.falseAnswer}
          </Button>
      </div>
  </div>
  }

  const ConfirmDialog:React.FC = () => props.question ? (<ConfirmationDailog onApply={()=>handleConfirm(true)} onCancel={()=>handleConfirm(false)}/>) : null;

  return { confirmAsk, ConfirmDialog };
}

