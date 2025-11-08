import { NavLink } from "react-router-dom";
import type { BasicNatigationProps } from "../interface/interfaces";
import { GivrLogoIcon, LogoutIcon, MenuIcon } from "./icons";
import { useState } from "react";
import { Button } from "./ReuseableComponents";

export const DashboardHeader: React.FC<BasicNatigationProps> = () => {

    let [isOpen, setIsOpen] = useState(false)

  // Fixed header with slightly off-white background
    return <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7FAFC] backdrop-blur-sm border-b border-gray-100 mb-1 shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 font-semibold lg:px-8 flex justify-between items-center h-15">
        <div className="flex items-center space-x-1  text-xl text-gray-800">
            <GivrLogoIcon className='w-20 h-auto max-w-full' />
            <span className="text-xs bg-[#1877F2] rounded-lg text-white p-1">Volunteer</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={""}>Organizations</NavLink>
            <NavLink to={"certificates"}>Certificates</NavLink>
        </nav>
        {/* Drop down menu hidden for large screens*/}
        <div className="md:hidden flex space-x-2">
            <Button variant="void" onClick={()=>setIsOpen(!isOpen)}>
                {!isOpen?<MenuIcon className="transform rotate-360 transition duration-150 ease-in-out w-10 h-10"/> : <MenuIcon className="transform rotate-90 transition duration-150 ease-in-out w-10 h-10"/>}
            </Button>

        </div>

        {/* Logout button, visible for large screens*/}
        <div className="hidden md:inline text-lg font-bold">
           <NavLink to={"/logout"}><LogoutIcon/></NavLink>
        </div>
     </div>

     {isOpen&&(
        <div className="md:hidden bg-gray-50 border-t border-gray-200 py-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center font-bold">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={""}>Organizations</NavLink>
            <NavLink to={"certificates"}>Certificates</NavLink>
            <NavLink to={"/logout"}>Logout</NavLink>
          </div>
        </div>
        )}
    </header>
};