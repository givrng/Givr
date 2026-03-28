import { useState, type ReactNode} from "react";
import type { ButtonProps, FeatureCardProps, MetricComponentProps, NavLinkProps, OrganizationComponentProps, ProjectComponentProps, ProjectFormProps } from "../interface/interfaces"
import { ArrowIcon, CalendarIcon, ClockIcon, DeleteBinIcon, GroupIcon, LocationIcon } from "./icons";
import { useConfirmAsk } from "./hooks/useConfirm";
import { useAlert } from "./hooks/useAlert";
import { useModal } from "./hooks/useModal";
import useAuthFetch from "./hooks/useAuthFetch";
import { CreateProject } from "./Organization/createProjectForm";


// --- Reusable Components ---

export const Button: React.FC<ButtonProps> = ({ children, variant, className = '', onClick }) => {
  // Adjusted base classes for a cleaner look matching the image
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition duration-200 whitespace-nowrap';
  let disabled = false
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
      variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200';
      break;
    case 'green':
      variantClasses = 'bg-[#34A853] text-white hover:bg-green-700'
      break;
    case "disabled":
      variantClasses = 'bg-[#DAF0FF] text-gray-500'
      disabled=true
      break
    case 'void':
      variantClasses= ''
      break
    case "danger":
      variantClasses = 'bg-red-600 text-white'
      break
    default:
      variantClasses = 'bg-[#34A853] text-white hover:bg-[#156cd4] shadow-md';
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick} disabled={disabled}>
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


export const PlatformCategory: React.FC<FeatureCardProps> = ({ color, description, title, cta, action }) => {

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

        <Button variant={color == 'blue' ? 'primary' : 'green'} className='w-full mt-8 py-3' onClick={action}>{cta}</Button>
      </div>
    )
  }

}

export const Card: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="p-8 max-w-lg w-5/6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl m-4">
    {children}
  </div>
);

/**Used to display the performance information */
export const MetricCard: React.FC<MetricComponentProps> = ({title, context, icon, value, className = "w-full ", color})=>{
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg max-w-sm ${className}`}>

    <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-700">{title? title: "Hours Logged"}</h2>
        {icon}
    </div>

    <div className="flex flex-col">
        <span className={`text-2xl font-extrabold text-[${color}] leading-none`}>{value?value:"124"}</span>
        <span className="text-sm font-medium text-gray-500 mt-2">{context? context: "+12 hours this month"}</span>
    </div>
</div>
  )
}

/**Displays quick actions in title - content pairs */
export const Banner:React.FC<{className?:string; title:string; content:string}> = ({title, content})=>(
  <div
   className="p-3 transition duration-300 ease-in-out cursor-pointer w-full max-w-lg">

    <div className="flex justify-between items-center gap-x-2">
        <div className="flex flex-col">
            <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            <p className="text-xs font-normal opacity-90 mt-1">{content}</p>
        </div>
        <ArrowIcon className="w-6 h-6"/>
    </div>
</div>
)

export const InfoCell:React.FC<{icon:ReactNode, info:string}> = ({icon, info})=>(
  <div className="flex items-center text-sm text-gray-600">
    {icon}
    <span>{info}</span>
  </div>

)

/**Displays an organization's information */
export const OrganizationCard: React.FC<OrganizationComponentProps> = ({name, description, numOfActiveProjects,location, category, status, hasVolunteered=false})=>{
  const {confirmAsk, ConfirmDialog} = useConfirmAsk({})
  const {alertMessage, AlertDialog} = useAlert({isOrg:true})


  const handleApplication = async ()=>{
    const ok = hasVolunteered? await confirmAsk({
      question: "Are you sure you want to cancel your application for this particular project?",
      trueAnswer: "Proceed",
      falseAnswer: "Cancel"
    }): await await confirmAsk({
      question: "Are you sure you want to apply for this particular project?",
      trueAnswer: "Apply",
      falseAnswer: "Cancel"
    })

    if(ok){
      let message =hasVolunteered?`Your application to ${name} has been cancelled`:`Your application to ${name} has been submitted`
      await alertMessage(message)
    }
  }

  return <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full ">

    <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col pr-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
            {/* <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Applied
            </span> */}
            <span className={`${status=="VERIFIED"?"bg-green-600": "bg-red-600"} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
               {status}
            </span>
        </div>
    </div>

    <div className="text-sm text-gray-700 space-y-2 mb-4">
        <p>
            <span className="font-semibold text-blue-600">Adress: </span> 
            {`${location?.lga}, ${location?.state}`}
        </p>
        <p>
            <span className="font-semibold text-blue-600">Active Projects: </span>
            {numOfActiveProjects? numOfActiveProjects: 0}
        </p>
    </div>

    <div className="flex justify-between items-end">
        <div className="flex space-x-2">
            <span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">{category}</span>
        </div>
        <Button variant="primary">View Projects</Button>
        {hasVolunteered?<Button variant="outline" onClick={handleApplication} > Cancel Application</Button>: null}
    </div>
    <ConfirmDialog/>
    <AlertDialog/>
</div>
}

/**Displays details of a project */
export const ProjectCard:React.FC<ProjectComponentProps> = ({id, title, organization, specialRequirements,applicationDeadline,description,categories, attendanceHours, location,requiredSkills, maxVolunteers, startDate, endDate,status, totalApplicants, superVolunteer, manage=false, applied=false, isOrganization=false, isDraft=false, onEdit, onDelete, onPublish})=>{

  const [displayForm, setDisplayForm] = useState(false)
  const {modal, DisplayModal} = useModal()
  const [isEditing, setIsEditing] = useState(false)

  // Makes request to backend to get organization information
  const handleView = ()=>{
    modal(<OrganizationCard {...organization} description={organization?.description!}  hasVolunteered={false} />)

  }
  const {state, lga} = location

  const closeEditing = ()=>{
    setIsEditing(false);
  }

  // Project data to prepopulate when editing 
  const projectData:ProjectFormProps = {
    id: id,
    title: title,
    startDate: startDate.split(",")[0].split("/").reverse().join("-"),
    attendanceHours: attendanceHours,
    category: categories[0],
    applicationDeadline: applicationDeadline.split(",")[0].split("/").reverse().join("-"),
    description: description?description:"",
    endDate: endDate.split(",")[0].split("/").reverse().join("-"),
    location: location,
    maxVolunteers: maxVolunteers,
    requiredSkills: requiredSkills,
    specialRequirements: specialRequirements,
  }

  return <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full">
    {isEditing?<CreateProject onClose={closeEditing} projectData={projectData} isCreating={false} onSuccessfulEdit={onEdit}/>:<>
      {isDraft&&<button
      className="absolute top-0 right-0 m-1
      rounded-full
      border border-red-500
      p-1
      text-red-500
      cursor-pointer
      transition-all duration-200
      hover:bg-red-500
      hover:text-white
      hover:scale-110"
      onClick={()=>{
        if(onDelete)
          onDelete(id, title)
      }}
      ><DeleteBinIcon/></button>}
      <div className=" flex justify-between items-start mb-4">
          <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-800">{title?title: "Community Health Screening"}</h3>
              {!isOrganization && <p className="text-sm font-medium text-gray-500">{organization? organization.name: "Abuja Health Initiative"}</p>}
          </div>
        
          <span className={`${status=="OPEN"? "bg-green-600": "bg-red-600 "} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
              {status? status: "Verified"}
          </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 py-4 border-y border-gray-200">
          <InfoCell icon={<CalendarIcon/>} info={startDate? startDate.split(",")[0]: "Jan 20, 2025"}/>
          <InfoCell icon={<ClockIcon color="#676879" className="w-6 w-6"/>} info={attendanceHours && typeof attendanceHours !="string"? `${attendanceHours.from.toUpperCase()}-${attendanceHours.to.toUpperCase()}`: "9:00 AM - 3:00 PM"}/>
          <InfoCell icon={<LocationIcon/>} info={location? `${lga}, ${state}`: "Wuse District, Abuja"}/>
          <InfoCell icon={<GroupIcon/>} info={`${totalApplicants?totalApplicants: 0 }/${maxVolunteers?maxVolunteers: 20}` }/>
      </div>

      <div className="flex flex-col justify-between pt-4 gap-y-2">

          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
                {categories? categories.map((cat, i)=>(<span key= {i} className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">{cat}</span>)): <>
                <span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">Healthcare</span>
                <span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">Community Outreach</span>
                </>}
            </div>
              {superVolunteer&& (<p className="text-sm font-normal text-gray-600">Super Volunteer: <span className="font-medium text-gray-800">{superVolunteer}</span></p>)}
          </div>
          
          {!isOrganization?
        <div className="flex gap-x-2 self-end">
              {manage && <Button variant="outline" onClick={handleView}>View details</Button>}
              {!applied?(<Button variant="primary" onClick={()=>setDisplayForm(true)}>Apply Now</Button>): <Button variant="disabled">Applied</Button>}
          </div>:
          <div className="flex gap-x-2 self-end">
            {status!="COMPLETED" &&<Button variant="outline" onClick={()=>setIsEditing(true)}>Edit</Button>}
              {status!="COMPLETED" &&manage&&<Button variant="outline" > Manage Volunteers</Button>}  
              {isDraft && <Button variant="green" onClick={()=>{
                if(onPublish)
                  onPublish(id, title)

              }}>Publish</Button>}
          </div>  
        }
      </div>

      {/* Volunteer can views details of an organization after applying, therefore, application form should not be shown */}
      {(displayForm && (!manage || !applied))&& <ApplicationForm organization={organization?.name} onCancel={()=>setDisplayForm(false)} projectId={id}/>}
      <DisplayModal/>
    </>}

</div>
}


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

/**Promts volunteer to provide their reason for applying for a project before application */
export const ApplicationForm:React.FC<{onCancel:()=>void, organization?:string, projectId:number}> = ({onCancel, organization, projectId})=>{
  interface ApplicationFields {
    projectId:number;
    reason: string;
    availableDays:string
  }
  const [applicationForm, setApplicationForm] = useState<ApplicationFields>({
    projectId: projectId,
    reason: "",
    availableDays: ""
  })

  const {API} = useAuthFetch("volunteer")

  let {confirmAsk, ConfirmDialog}= useConfirmAsk({})
  let {alertMessage, AlertDialog} = useAlert({isOrg:false})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    console.log(applicationForm)
    // Prompt the volunteer to confirm their application
    const ok = await confirmAsk({
      question: "Are you sure you want to apply for this particular project?",
      trueAnswer: "Apply",
      falseAnswer: "Cancel"
    })
    if(ok){
      let message = `Thank you for Applying! ${organization} will reach out to you if you fit the selection criteria`
      await API().post("/projects/apply", applicationForm ) 
      .then(async ()=>{
        await alertMessage(message)
      }, async ()=>{
        await alertMessage(`Application ${organization}'s project failed. Please try again`)
      })     
      
    }

    onCancel()
  }


  return <>
    <div className="bg-white p-8 rounded-xl mt-2 shadow-2xl w-full max-full">
      {/* <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">Appply for {project}</h2> */}
      <form onSubmit={handleSubmit} className="space-y-6">

        <label htmlFor="reason" className="block text-base font-semibold text-gray-700 mb-2">Why do you want to volunteer for this project?</label>

        <textarea name="reason" rows={5}  value={applicationForm["reason"]} onChange={(e)=>setApplicationForm({...applicationForm, reason:e.currentTarget.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y text-gray-800" required></textarea>
        <label htmlFor="availability" className="block text-base font-semibold text-gray-700 mb-2">Confirm you availability</label>
        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800" type="text" name="availability" placeholder="e.g available all day" value={applicationForm.availableDays} onChange={e=>setApplicationForm({...applicationForm, availableDays: e.currentTarget.value})} required/>

        <div className="flex justify-between pt-2 space-x-4">
          <Button variant="primary" className="w-full">Submit application</Button>
           <Button variant="outline"  className="w-full" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
      <ConfirmDialog/>
      <AlertDialog/>
    </div>
  </>
}


// // Runtime validation function using regex
// function isValidAttendanceHours(hours: string): hours is AttendanceHours {
//     const regex = /^(1[0-2]|[1-9])(Am|Pm) - (1[0-2]|[1-9])(Am|Pm)$/;
//     return regex.test(hours);
// }
