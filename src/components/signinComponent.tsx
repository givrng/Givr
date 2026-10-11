import { useEffect, useState } from "react";
import { Button } from "./ReuseableComponents";
import type { BasicNatigationProps, SignInFormProps } from "../interface/interfaces";
import backgroundImage from "../assets/sign-in-background.svg"
import { GoogleIcon, LoadingEffect } from "./icons";
import { Link, useSearchParams } from "react-router-dom";
import useAuthFetch from "./hooks/useAuthFetch";
import { useVerifyAuth } from "./Auth/AuthContext";

const SignInForm: React.FC<SignInFormProps> = ({ toSignUp, onSignInAttempt, toForgotPassword, isOrganization, onSignInWithGoogle, redirect}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [requestParams] = useSearchParams()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const status = await onSignInAttempt(email, password)
        
        switch(status){
            case 401:
                setError("The email or password you entered is incorrect. Please check and try again.")
                break
            case 403:
                setError("Your account has been temporarily locked due to too many failed attempts. Please try again later or reset your password.")
                break
            case 409:
                setError("This email was registered using Google Sign-In. Please click \"Sign-in / Sign-up with Google\" below to continue.")
                break
            case 422:
                setError("Please enter a valid email address and password.")
                break
            default:
                if (status && status >= 500) {
                    setError("We're having trouble signing you in right now. Please try again in a moment.")
                } else if (status){
                    setError("We couldn't sign you in. Please check your email and password, then try again.")
                }
        }
        setIsLoading(false)      
    };

    useEffect(()=>{
        const errMsg = requestParams.get("error")
        setError(errMsg?errMsg: "")
    }, [])

    return (
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back!</h1>
                <p className="text-gray-600">We're glad to have you back, let's look up some projects you can contribute to.</p>
            </div>

            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition duration-150"
                        placeholder="johndoe@gmail.com"
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition duration-150"
                        placeholder="**********"
                    />
                </div>

                {/* Checkbox and Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-[#1877F2] border-gray-300 rounded focus:ring-[#1877F2]"
                        />
                        <label htmlFor="remember-me" className="ml-2 text-gray-600">
                            Remember Me
                        </label>
                    </div>
                    <Link className={`font-medium hover:underline hover:cursor-pointer ${isOrganization ? "text-[#34A853]" : "text-[#1877F2]"}`} to={toForgotPassword ? toForgotPassword : "/"}>
                        Forgot Password?
                    </Link>
                </div>

                {/* Sign In Button */}
                <Button variant={isOrganization?"green":"primary"} className="w-full py-3" >
                    {isLoading ? (
                        <LoadingEffect message="Signing In..." />
                    ) : 'Sign In'}
                </Button>
            </form>

            {/* Separator */}
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Continue with Google */}
            <Button variant="secondary" className="w-full py-3 flex items-center justify-center space-x-2"
                onClick={onSignInWithGoogle}
            >
                <GoogleIcon />
                <span>Sign-in / Sign-up with Google</span>
            </Button>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
                No Gmail account?
                <Link className={`font-semibold hover:underline ml-1 ${isOrganization ? "text-[#34A853]" : "text-[#1877F2]"}`} to={toSignUp ? redirect?`${toSignUp}?redirect=${redirect}`:toSignUp : "/"}>
                    Sign Up manually here
                </Link>
            </p>
        </div>

    );
};


export const SignInComp: React.FC<BasicNatigationProps> = function ({ toSignUp, toForgotPassword, onToDashboard, isOrganization=false }) {

    const {API} = useAuthFetch(isOrganization?"organization": "volunteer")
    const verifyAuth = useVerifyAuth()
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [requestParam] = useSearchParams()
    const redirect = requestParam.get("redirect");
    const handleSignIn = async (email: string, password: string):Promise<number> => {
    
        try{
                        
            let res = await API().post(`/auth/login`, {email, password}, {
                withCredentials: true
            });
        
            // Allow route guard render dashboard
            verifyAuth?.signin()

            if(onToDashboard)
                onToDashboard()
            
            return res.status
        }catch(err:any){
            return err?.response?.status;
        }
    }
    const handleSignInWithGoogle = async ()=>{
        // include redirection when signing in with google
        let path = !redirect? `${apiBaseUrl}/${isOrganization? "organization":"volunteer"}/oauth2/authorization/${isOrganization?"google-org":"google-volunteer"}`
            :`${apiBaseUrl}/${isOrganization? "organization":"volunteer"}/oauth2/authorization/${isOrganization?"google-org":"google-volunteer"}?redirect=${redirect}`

       window.location.href = path
        
    }

    return (
        <section className="flex items-center justify-center min-h-screen bg-none p-4 sm:p-6 lg:p-10 pt-20" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="grid lg:grid-cols-2 max-w-5xl">
                <div className="hidden lg:flex flex-col justify-end p-12 text-white">
                    <div className="max-w-sm">
                        <h2 className="text-5xl font-extrabold leading-tight mb-4">
                            Volunteering at it's best
                        </h2>
                        <p className="text-lg">
                            Whether you're giving your time or leading a project, Givr.ng helps you make every act of service count.
                        </p>
                    </div>
                </div>

                <SignInForm toForgotPassword={toForgotPassword} toSignUp={toSignUp} onSignInAttempt={handleSignIn} 
                    isOrganization={isOrganization} onSignInWithGoogle={handleSignInWithGoogle} redirect={redirect}/>
            </div>
        </section>
    )
}
