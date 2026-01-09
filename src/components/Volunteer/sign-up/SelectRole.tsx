import { Link } from "react-router-dom";
import { HeartHandIcon, OrganizationIcon } from "../../icons";

type rolesprops ={
    id: string;
    icon: React.FC<{
        className?: string;
    }>;
    title: string;
    desc: string;
    path:string
};

const SelectRole:React.FC<{isSignin:boolean}> = ({isSignin}) => {

    const roles: rolesprops[] = [
        { id: "volunteer", icon: HeartHandIcon, title: 'Volunteer', desc: "Find and Join volunteering oportunities", path:"volunteer" },
        { id: "organisation", icon: OrganizationIcon, title: 'Organization', desc: "Post projects and recruit volunteers", path:"organization" },
    ]

    return (
      <div className=" mx-auto  flex flex-col pt-10  items-center h-screen bg-[#F3FAFA] ">
        <h2 className="md:text-5xl text-3xl text-[#323338] font-semibold ">{isSignin?"Log into":"Join"} Givr.ng</h2>
        <h4 className="text-lg  text-[#676879] ">{isSignin?"Log in as":"I want to join as a"}</h4>
        <div className="mt-10 md:w-xl w-full px-5 ">
          {roles.map((role) => (
            <Link to={role.path} key={role.id}>
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
            </Link>
          ))}
        </div>
      </div>
    );
}
export default SelectRole