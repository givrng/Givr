import { useEffect, useState } from "react";
import { Button, Card } from "./ReuseableComponents";
import type { BasicNatigationProps } from "../interface/interfaces";
import { Link, useNavigate } from "react-router-dom";
import { ResendOtpTimer } from "./ResendOtpTimer";
import useAuthFetch from "./hooks/useAuthFetch";
import { PageLoader } from "./icons";
import { useAlert } from "./hooks/useAlert";

interface ForgotPasswordProps{
    email:string;
    role:"VOLUNTEER"|"ORGANIZATION";
    newPassword:string;
    rePassword:string;
}

export const ForgotPasswordForm: React.FC<{navProps:BasicNatigationProps, isOrg?:boolean}> = ({ navProps, isOrg=false }) => {
    const [onSent, setOnSent] = useState(false);
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {alertMessage, AlertDialog} = useAlert({isOrg:false})
    const navigate  = useNavigate()
    const [formInput, setFormInput] = useState<ForgotPasswordProps>({
        email: "",
        role: isOrg?"ORGANIZATION":"VOLUNTEER",
        newPassword: "",
        rePassword:""
    })

    const {API} = useAuthFetch("")

    const requestOtp = async ()=>{        
        try{
            setIsLoading(true)
            await API().post("/password/forgot")
            setOnSent(true)
        }catch{
            alertMessage("OTP Request failed")
        }finally{
            setIsLoading(false)
        }
    }

    const handleReset = async (e: React.FormEvent)=>{
        e.preventDefault()

        try{
            setIsLoading(true)
            await API().post("/password/reset", formInput)
            navigate("../", {
                replace:true
            })
        }catch{
            alertMessage("An unexpected error occured")
        }finally{
            setIsLoading(false)
        
        }
    }


    useEffect(()=>{
       if(formInput["newPassword"] != formInput["rePassword"])
        setError("Passwords do not match")
       else
        setError("")

    }, [formInput["rePassword"], formInput["newPassword"]])


    return (
        <div className="bg-[#F3FAFA] w-screen h-screen flex items-center justify-center">
            <AlertDialog/>
            {isLoading&& <PageLoader color={isOrg?"green":"blue"}/>}
            {!onSent ?
                <section className="max-w-3/4 p-10 rounded-xl shadow-2xl bg-white h-5/6 grid grid-cols-1 content-center gap-2">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                        Forgotten Password?
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Type in the email you used to open your Givr account so we can send an OTP.
                    </p>

                    <form onSubmit={(e) => { 
                        e.preventDefault();
                        requestOtp()
                        }}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reset-email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="reset-email"
                                placeholder="johndoe@gmail.com"
                                className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                value={formInput["email"]}
                                onChange={(e) => setFormInput(prev=>({
                                    ...prev,
                                    email:e.target.value
                                }))}
                                required
                            />
                        </div>

                        <Button
                            variant={isOrg?"green":"primary"}
                            className="w-full"
                        >
                            Send OTP
                        </Button>
                    </form>

                    <div className="text-center mt-8">
                        <span className="text-sm text-gray-600">Don't have an account? </span>
                        {
                        !isOrg?
                            <Link
                            className={`font-semibold text-sm text-indigo-500 hover:text-indigo-700`}
                            to={navProps.toSignUp ? navProps.toSignUp : "/"}
                            >
                                Sign Up here
                            </Link>:
                            <Link
                            className={`font-semibold text-sm text-green-500 hover:text-green-700`}
                            to={navProps.toSignUp ? navProps.toSignUp : "/"}
                            >
                                Sign Up here
                            </Link>
                        }
                    </div>
                </section> :
                <Card>
                    <form onSubmit={handleReset}>
                        <div className="h-70 grid grid-cols-1 gap-y-2 text-center">
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">OTP has been Sent</h1>
                            <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter new password"
                                    className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                    value={formInput["newPassword"]}
                                    onChange={(e) => setFormInput(prev=>({
                                        ...prev,
                                        newPassword:e.target.value
                                    }))}
                                    required
                                />
                            <input
                                type="password"
                                id="rePassword"
                                placeholder="Re-enter password"
                                className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                value={formInput["rePassword"]}
                                onChange={(e) => setFormInput(prev=>({
                                    ...prev,
                                    rePassword:e.target.value
                                }))}
                                required
                            />
                            {error&& <span className="text-left px-2 text-red-500 h-7 bg-gray-300 rounded-sm">{error}</span>}
                            <Button variant={error?"disabled": isOrg?"green":"primary"} className="h-10">Reset Password</Button>
                        </div>
                    </form>
                    <ResendOtpTimer onResend={requestOtp}/>
                </Card>}
        </div>
    );

};
