import { NavLink } from "react-router-dom";
import type { BasicNatigationProps } from "../interface/interfaces";
import { GivrLogoIcon } from "./icons";
import { Button } from "./ReuseableComponents";

export const GenericHeader: React.FC<BasicNatigationProps> = ({ onToSignIn, onToSignUp }) => (
  // Fixed header with slightly off-white background
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7FAFC] backdrop-blur-sm border-b border-gray-100 mb-1">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-15">
      <div className="flex items-center space-x-1 font-semibold text-xl text-gray-800">
        <GivrLogoIcon className='w-20 h-auto max-w-full' />
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-8">
        <NavLink to={"certs"}>Opportunities</NavLink>
        <NavLink to={"organization"}>Organizations</NavLink>
        <NavLink to={"certificates"}>Certificates</NavLink>
      </nav>
      {/* Action Buttons: Sign In (Primary), Sign Up (Outline) */}
      <div className="flex space-x-2">
        <Button variant="primary" className="text-sm px-3 py-1 shadow-none" onClick={onToSignIn}>Sign In</Button>
        <Button variant="outline" className="text-sm px-3 py-1 shadow-none" onClick={onToSignUp}>Sign Up</Button>
      </div>
    </div>
  </header>
);