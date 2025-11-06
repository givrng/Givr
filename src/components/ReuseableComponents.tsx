import type { ReactNode } from "react";
import type { ButtonProps, FeatureCardProps, MetricComponentProps, MetricProps, NavLinkProps, ProjectComponentProps } from "../interface/interfaces"
import { ArrowIcon, CalendarIcon, ClockIcon, GroupIcon, LocationIcon } from "./icons";

// --- Reusable Components ---

export const Button: React.FC<ButtonProps> = ({ children, variant, className = '', onClick }) => {
  // Adjusted base classes for a cleaner look matching the image
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition duration-200 whitespace-nowrap';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-[#1877F2] text-white hover:bg-[#156cd4] shadow-md';
      break;
    case 'secondary':
      // The "Post a project" button in the image is secondary: white background, light border, text-gray
      variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-300 shadow-md';
      break;
    case 'outline':
      // Used for the Sign Up button in the header
      variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
      break;
    case 'green':
      variantClasses = 'bg-[#34A853] text-white hover:bg-green-700'
      break;
    default:
      variantClasses = 'bg-[#34A853] text-white hover:bg-[#156cd4] shadow-md';
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};


export const NavLink: React.FC<NavLinkProps> = ({ label, href }) => (
  <a href={href} className="text-gray-600 hover:text-[#1877F2] transition duration-150 py-2 text-sm font-medium">
    {label}
  </a>
);


export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => {
  let iconBgClass = '';
  let iconTextClass = '';

  switch (color) {
    case 'red':
      iconBgClass = 'bg-red-50';
      iconTextClass = 'text-red-500';
      break;
    case 'green':
      iconBgClass = 'bg-green-50';
      iconTextClass = 'text-green-500';
      break;
    case 'yellow':
      iconBgClass = 'bg-yellow-50';
      iconTextClass = 'text-yellow-600';
      break;
    case 'blue':
      iconBgClass = 'bg-blue-50';
      iconTextClass = 'text-[#1877F2]';
      break;
    case 'lock':
      iconBgClass = 'bg-red-50';
      iconTextClass = 'text-red-500';
      break;
    default:
      iconBgClass = 'bg-gray-50';
      iconTextClass = 'text-gray-500';
      break;
  }

  const cardBaseClasses = 'p-6 rounded-xl transition duration-300 h-full';


  return (
    <div className={cardBaseClasses}>
      <div className={`p-3 rounded-full inline-block mb-4 ${iconBgClass} ${iconTextClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
};


export const PlatformCategory: React.FC<FeatureCardProps> = ({ color, description, title, cta }) => {

  let listBgColor = "bg-[#1A73E8]";
  if (color == 'green') {
    listBgColor = 'bg-[#34A853]'
  }

  if (typeof description == 'object') {
    return (
      <div className='max-w-md mx-auto bg-white rounded-xl border border-blue-100 p-8 shadow-sm'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h2>

        <ol className='space-y-4'>
          {description.map((text, index) => <li key={index} className='flex gap-2 text-left'>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${listBgColor} text-white text-sm font-medium`}>{index + 1}</span>
            <span className='text-gray-700 w-full'>{text}</span>
          </li>)}
        </ol>

        <Button variant={color == 'blue' ? 'primary' : 'green'} className='w-full mt-8 py-3'>{cta}</Button>
      </div>
    )
  }

}

export const Card: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="p-8 max-w-lg w-5/6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl m-4">
    {children}
  </div>
);


export const MetricCard: React.FC<MetricComponentProps> = ({title, context, icon, value, className = "w-full "})=>{
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg max-w-sm ${className}`}>
    
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-700">{title? title: "Hours Logged"}</h2>
        {icon? icon: <ClockIcon/>}
    </div>

    <div className="flex flex-col">
        <span className="text-2xl font-extrabold text-blue-600 leading-none">{value?value:"124"}</span>
        <span className="text-sm font-medium text-gray-500 mt-2">{context? context: "+12 hours this month"}</span>
    </div>
</div>
  )
}


export const Banner:React.FC<{className?:string; onClick?:()=>void; title:string; content:string}> = ({title, content, onClick})=>(
  <button
  onClick={onClick}
   className="p-3 transition duration-300 ease-in-out cursor-pointer w-full max-w-lg">
    
    <div className="flex justify-between items-center gap-x-2">
        <div className="flex flex-col">
            <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            <p className="text-xs font-normal opacity-90 mt-1">{content}</p>
        </div>
        <ArrowIcon className="w-6 h-6 text-black"/>
    </div>
</button>
)

export const InfoCell:React.FC<{icon:ReactNode, info:string}> = ({icon, info})=>(
  <div className="flex items-center text-sm text-gray-600">
    {icon}
    <span>{info}</span>
  </div>

)

export const ProjectCard:React.FC<ProjectComponentProps> = ({title, organization, categories, attendanceHours, location, maxApplicants, startDate,status, totalApplicants, superVolunteer})=>(
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full">
    
    <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-800">{title?title: "Community Health Screening"}</h3>
            <p className="text-sm font-medium text-gray-500">{organization? organization: "Abuja Health Initiative"}</p>
        </div>
       
        <span className={`${status=="Verified"? "bg-green-600": "bg-red-600 "} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
            {status? status: "Verified"}
        </span>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 py-4 border-y border-gray-200">
        <InfoCell icon={<CalendarIcon/>} info={startDate? startDate: "Jan 20, 2025"}/>
        <InfoCell icon={<ClockIcon color="#676879" className="w-6 w-6"/>} info={attendanceHours? attendanceHours: "9:00 AM - 3:00 PM"}/>
        <InfoCell icon={<LocationIcon/>} info={location? location: "Wuse District, Abuja"}/>
        <InfoCell icon={<GroupIcon/>} info={`${totalApplicants?totalApplicants: 15 }/${maxApplicants?maxApplicants: 20}` }/>
    </div>
    
    <div className="flex justify-between items-end pt-4">
        
        <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
            
                {categories? categories.map((category, i)=>(<span key= {i} className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">{category}</span>)): <>
                <span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">Healthcare</span>
                <span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">Community Outreach</span>
                </>}
            </div>
            
            {superVolunteer&& (<p className="text-sm font-normal text-gray-600">Super Volunteer: <span className="font-medium text-gray-800">{superVolunteer}</span></p>)}
        </div>
        
        <Button variant="primary">Apply Now</Button>
    </div>
</div>
)
 {/*Highlights only active button, used for navigation, allowing user toggle*/}
export const RadioButton: React.FC<{children: React.ReactNode;  value?:string; activeSyle?:string; inActiveStyle?:string; active?: boolean; onClick?: (event:React.MouseEvent<HTMLButtonElement>) => void;}> = ({ children, active, onClick, activeSyle, inActiveStyle, value}) => {
  let activeStyle_ = activeSyle;
  let notActiveStyle = inActiveStyle;

  if(!activeSyle)  
    activeStyle_ = "bg-white rounded-xl w-full text-black shadow-md rounded-t-lg py-2"
  if(!inActiveStyle)
    notActiveStyle = "bg-[#E7E9EF] rounded-xl w-full text-gray-600 hover:bg-gray-300 py-2"

  return (
        <button
        onClick={onClick}
        className={`font-semibold text-sm  px-4 relative z-10 transition-all 
            ${active 
            ? activeStyle_ 
            : notActiveStyle}`}
        value={value}
        >
        {children}
        </button>
    );
};
// // Runtime validation function using regex
// function isValidAttendanceHours(hours: string): hours is AttendanceHours {
//     const regex = /^(1[0-2]|[1-9])(Am|Pm) - (1[0-2]|[1-9])(Am|Pm)$/;
//     return regex.test(hours);
// }
