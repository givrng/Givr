import { useState } from "react";
import { Button } from "./ReuseableComponents";
import type { BasicNatigationProps, SignInFormProps } from "../interface/interfaces";
import backgroundImage from "../assets/sign-in-background.svg"
import { GoogleIcon, LoadingEffect } from "./icons";
import { Link } from "react-router-dom";
import useAuthFetch from "./hooks/useAuthFetch";

const SignInForm: React.FC<SignInFormProps> = ({ toSignUp, onSignInAttempt, toForgotPassword, isOrganization}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate a sign-in attempt with dummy data/logic
        setTimeout(() => {
            if (!onSignInAttempt(email, password)) {
                setError('Invalid email or password. (Simulated error)');
                setIsLoading(false);
            }

        }, 1500);
    };

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
                    <Link className={`font-medium text-[#${isOrganization? "34A853":"1877F2"}] hover:underline hover:cursor-pointer`} to={toForgotPassword ? toForgotPassword : "/"}>
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
            <Button variant="secondary" className="w-full py-3 flex items-center justify-center space-x-2">
                <GoogleIcon />
                <span>Continue with Google</span>
            </Button>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?
                <Link className={`font-semibold text-[#${isOrganization? "34A853":"1877F2"}] hover:underline ml-1`} to={toSignUp ? toSignUp : "/"}>
                    Sign Up here
                </Link>
            </p>
        </div>

    );
};


export const SignInComp: React.FC<BasicNatigationProps> = function ({ toSignUp, toForgotPassword, onToDashboard, isOrganization=false }) {

    const {API} = useAuthFetch(isOrganization?"organization": "volunteer")

    const handleSignIn = async (email: string, password: string) => {

        API().post(`/auth/login`, {email, password}, {
            withCredentials: true
        })
        .then(()=>{
            if(onToDashboard)
                onToDashboard()
            return true
        })

        return false;
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

                <SignInForm toForgotPassword={toForgotPassword} toSignUp={toSignUp} onSignInAttempt={handleSignIn} isOrganization={isOrganization}/>
            </div>
        </section>
    )
}
