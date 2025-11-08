import { Link} from "react-router-dom"
import type { BasicNatigationProps } from "../interface/interfaces"


export const PageNotFound:React.FC<BasicNatigationProps> = ({toDashBoard})=>{
    
    return <main className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
    <div className="bg-white p-10 md:p-16 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-gray-200">
        <p className="text-7xl md:text-9xl font-extrabold text-blue-600 mb-6">
            404
        </p>

       
        <div className="flex justify-center mb-8">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-20 h-20 text-blue-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.948 3.374c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            You have strayed from the pack.<br/> Let's get you back shall we?
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={toDashBoard?toDashBoard : "/"} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition duration-150">
                Go to Dashboard
            </Link>
            {/* <Link to={toOppurtunities?toOppurtunities:"/"} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition duration-150">
                Find New Opportunities
            </Link> */}
        </div>
    </div>
</main>
}