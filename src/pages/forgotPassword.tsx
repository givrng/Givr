import { useState } from "react";
import { Button, Card } from "../components/landingPageComponents";
import type { BasicNatigationProps } from "../interface/interfaces";
import { Link } from "react-router-dom";


export const ForgotPasswordForm: React.FC<BasicNatigationProps> = ({toSignUp}) => {
  const [email, setEmail] = useState('');
  const [onSent, _] = useState(false);

  return (
    <div className="bg-[#F3FAFA] w-screen h-screen flex items-center justify-center">   
    {!onSent?
        <section className="max-w-3/4 p-10 rounded-xl shadow-2xl bg-white h-5/6 grid grid-cols-1 content-center gap-2">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
            Forgotten Password?
            </h1>
            <p className="text-sm text-gray-600 mb-6">
                Type in the email you used to open your Givr account so we can send you a reset link.
            </p>

            <form onSubmit={()=>{}}>
                <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reset-email">
                    Email
                </label>
                <input
                    type="email"
                    id="reset-email"
                    placeholder="johndoe@gmail.com"
                    className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>

                <Button
                variant="primary"
                className="w-full"
                >
                Send Link
                </Button>
            </form>

            <div className="text-center mt-8">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link
                 
                className="font-semibold text-sm text-indigo-600 hover:text-indigo-800"
                to={toSignUp? toSignUp: "/"}
                >
                Sign Up here
                </Link>
            </div>
      </section> :
        <Card>
            <div className="h-50 text-center flex-cols items-center content-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Reset Link Sent</h1>
                <p className="text-sm text-gray-600 mb-6">We have sent a link to your email</p>
            </div>
        </Card> }       
    </div>
  );

};
