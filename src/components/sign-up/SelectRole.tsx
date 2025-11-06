import { NavLink } from "react-router-dom";
import {HeartHandIcon, OrganizationIcon, SuperVolunteer} from "../icons"
import type { BasicNatigationProps } from "../../interface/interfaces";

type rolesprops ={
    id: string;
    icon: React.FC<{
        className?: string;
    }>;
    title: string;
    desc: string;

};

const SelectRole:React.FC<BasicNatigationProps> = ({toVolunteerDetails}) => {
    const roles: rolesprops[] = [
        { id: "volunteer", icon: HeartHandIcon, title: 'Volunteer', desc: "Find and Join volunteering oportunities" },
        { id: "organisation", icon: OrganizationIcon, title: 'Organization', desc: "Post projects and recruit volunteers" },
        { id: "super-volunteer", icon: SuperVolunteer, title: 'Super Volunteer', desc: "Find and Join volunteering oportunities" },
    ]
    return (
      <div className=" mx-auto  flex flex-col pt-10  items-center h-screen bg-[#F3FAFA] ">
        <h2 className="md:text-5xl text-3xl text-[#323338] font-semibold ">Join Givr.ng</h2>
        <h4 className="text-lg  text-[#676879] ">I want to join as a</h4>
        <div className="mt-10 md:w-xl w-full px-5 ">
          {roles.map((role) => (
            <NavLink to={toVolunteerDetails?toVolunteerDetails:""} key={role.id}>
              <div
                key={role.id}
                className="border border-ui flex items-center rounded-lg md:pl-7 pl-4  mb-4  h-20 hover:shadow-ui hover:bg-(--primary-color) hover:text-white cursor-pointer "
              >
                <div>
                  <role.icon className="w-6 h-6 group-hover:text-white " />
                </div>
                <div className="ml-5  ">
                  <h3 className="text-base  group-hover:text-white">
                    {role.title}
                  </h3>
                  <p className=" text-sm  group-hover:text-white ">
                    {role.desc}
                  </p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    );
}
export default SelectRole