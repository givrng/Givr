import { useState, type ReactNode} from "react";
import type { ButtonProps, FeatureCardProps, MetricComponentProps, NavLinkProps, OrganizationComponentProps,  ProjectComponentProps, ProjectFormProps, ProjectProps } from "../interface/interfaces"
import { ArrowIcon, CalendarIcon, DeleteBinIcon, LocationIcon, PageLoader } from "./icons";
import { useConfirmAsk } from "./hooks/useConfirm";
import { useAlert } from "./hooks/useAlert";
import { useModal } from "./hooks/useModal";
import useAuthFetch from "./hooks/useAuthFetch";
import { CreateProject } from "./Organization/createProjectForm";
import ProjectDetailsModal from "./ProjectModalDetails";
import { Download, LucideShare2, ZoomIn } from "lucide-react";
import  { useShareModal } from "./shareModal";
import { useApplicationForm } from "./Volunteer/ApplicationForm";
import { useImageViewer } from "./hooks/useImageViewer";
import { downloadFile } from "../utils/fileDownload";

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

/** Color map for MetricCard - avoids dynamic Tailwind classes that JIT can't resolve */
const METRIC_COLOR_MAP: Record<string, string> = {
  "#1A73E8": "text-[#1A73E8]",
  "#34A853": "text-[#34A853]",
  "#FBBC05": "text-[#FBBC05]",
  "#B86705": "text-[#B86705]",
  "#237238": "text-[#237238]",
};

/**Used to display the performance information */
export const MetricCard: React.FC<MetricComponentProps> = ({title, context, icon, value, className = "w-full ", color})=>{
  const isLoading = value === undefined || value === null || value === "" || value === "undefined";
  const colorClass = color ? METRIC_COLOR_MAP[color] ?? "text-gray-900" : "text-gray-900";

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg max-w-sm ${className}`}>

    <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-700">{title || "—"}</h2>
        {icon}
    </div>

    <div className="flex flex-col">
        {isLoading ? (
          <>
            <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-36 bg-gray-100 rounded-sm animate-pulse mt-2" />
          </>
        ) : (
          <>
            <span className={`text-2xl font-extrabold ${colorClass} leading-none`}>{value}</span>
            <span className="text-sm font-medium text-gray-500 mt-2">{context || "—"}</span>
          </>
        )}
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
export const OrganizationCard: React.FC<OrganizationComponentProps> = (orgComponentProps)=>{
  const {confirmAsk, ConfirmDialog} = useConfirmAsk({})
  const {alertMessage, AlertDialog} = useAlert({isOrg:true})

  const handleApplication = async ()=>{
    const ok = orgComponentProps.hasVolunteered
      ? await confirmAsk({
          question: "Are you sure you want to cancel your application for this particular project?",
          trueAnswer: "Proceed",
          falseAnswer: "Cancel"
        })
      : await confirmAsk({
          question: "Are you sure you want to apply for this particular project?",
          trueAnswer: "Apply",
          falseAnswer: "Cancel"
        })

    if(ok){
      const orgName = orgComponentProps.name || "this organization";
      const message = orgComponentProps.hasVolunteered
        ? `Your application to ${orgName} has been cancelled`
        : `Your application to ${orgName} has been submitted`
      await alertMessage(message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full ">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col pr-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{orgComponentProps.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{orgComponentProps.description}</p>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          {/* <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Applied
            </span> */}
          <span
            className={`${orgComponentProps.status == "VERIFIED" ? "bg-green-600" : "bg-red-600"} text-white text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {orgComponentProps.status}
          </span>
        </div>
      </div>


      <div className="flex flex-col justify-between gap-y-2">
        <div className="flex space-x-2">
          <span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">
            {orgComponentProps.organizationType}
          </span>
        </div>
        <div className="flex gap-x-2 justify-end">
          <Button variant="outline" onClick={()=>{
              // Only call if method is not null
              orgComponentProps.showOrganizationDetails && orgComponentProps.showOrganizationDetails({...orgComponentProps})
          }}>View</Button>
        </div>
        {orgComponentProps.hasVolunteered ? (
          <Button variant="outline" onClick={handleApplication}>
            {" "}
            Cancel Application
          </Button>
        ) : null}
      </div>
      <ConfirmDialog />
      <AlertDialog />
    </div>
  );
}

/**Displays details of a project */
export const ProjectCard:React.FC<ProjectComponentProps> = ({ id, title, organization, specialRequirements,applicationDeadline,description,categories, attendanceHours, location,address,requiredSkills, maxVolunteers, startDate, endDate,status, totalApplicants, superVolunteer, manage=false, applied=false, isOrganization=false, isDraft=false, onEdit, onDelete, onPublish, projectFlierUrl})=>{

  const [displayForm, setDisplayForm] = useState(false)
  const {modal, DisplayModal} = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {API} = useAuthFetch(isOrganization? "organization": "volunteer")
  const {openImage, ImageViewerModal} = useImageViewer()

  const project:ProjectProps = {
    id,
    title, organization, 
    specialRequirements,applicationDeadline,
    description,categories, attendanceHours, 
    location,address,requiredSkills, maxVolunteers, 
    startDate, endDate,status, totalApplicants, 
    superVolunteer, projectFlierUrl
  }

  const {openShare, ShareModalComponent} = useShareModal()
  const {alertMessage, AlertDialog} = useAlert({isOrg: isOrganization})
  // Makes request to backend to get organization information
  const handleView = ()=>{
    modal(<ProjectDetailsModal project={project}/>)

  }
  // const {state, lga} = location

  const closeEditing = ()=>{
    setIsEditing(false);
  }
  

  const handleShareProject = async ()=>{
    try{
      setIsLoading(true)
      let response = await API().get(`/share/project/${project.id}`);
      let url = response.data as string

      // Open share modal only when there's a link
      openShare({
        text: "",
        title: project.title, 
        url
      })
      
    }catch(err){
      await alertMessage("Failed to create link")
    }finally{
      setIsLoading(false)
    }
  }
  // Project data to prepopulate when editing
  const projectData:ProjectFormProps = {
    id: id,
    title: title,
    startDate: startDate.split(",")[0].split("/").reverse().join("-"),
    attendanceHours: attendanceHours,
    categories: categories,
    applicationDeadline: applicationDeadline.split(",")[0].split("/").reverse().join("-"),
    description: description?description:"",
    endDate: endDate.split(",")[0].split("/").reverse().join("-"),
    location,
    maxVolunteers: maxVolunteers,
    address,
    requiredSkills: requiredSkills,
    specialRequirements: specialRequirements,
    projectFlierUrl: projectFlierUrl,
  }

  const {openApplicationForm, ApplicationModal} = useApplicationForm()
  
  const handleApply = ()=>{
    setDisplayForm(true)

    openApplicationForm({
      onCancel: ()=>setDisplayForm(false),
      projectId: id,
      organization: organization?.name
    })
  }
  return <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full">
    {isLoading && <PageLoader/>}
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
      {projectFlierUrl && (
        <div className="group/img relative mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-xl cursor-pointer">
          <img
            src={projectFlierUrl}
            alt={`${title} flier`}
            className="w-full h-40 object-cover"
            onClick={() => openImage({ url: projectFlierUrl, title, downloadName: `${title}-flier` })}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow pointer-events-none">
              <ZoomIn size={14} /> View
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); void downloadFile(projectFlierUrl, `${title}-flier`); }}
              className="inline-flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-100"
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      )}
      <div className=" flex justify-between items-start mb-4">
          <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-800">{title || "—"}</h3>
              {!isOrganization && <p className="text-sm font-medium text-gray-500">{organization?.name || "—"}</p>}
          </div>
          <div className="flex justify-between gap-x-2">
            <span className={`${status=="OPEN"? "bg-green-600": "bg-red-600 "} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
                {status || "—"}
            </span>
            {
              status != "DRAFT" && <button onClick={handleShareProject}>
              <LucideShare2 className={`${isOrganization? 'hover:text-green-500':'hover:text-blue-500'}`}/> 
            </button>
            }
          </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 py-4 border-y border-gray-200">
          <InfoCell icon={<CalendarIcon/>} info={startDate ? startDate.split(",")[0] : "—"}/>
          <InfoCell icon={<LocationIcon/>} info={address || location?.state || "—"}/>
      </div>

      <div className="flex flex-col justify-between pt-4 gap-y-2">

          <div className="flex flex-col space-y-3 box-border">
            <div className="flex flex-wrap gap-2 justify-start">
                {categories && categories.length > 0
                  ? categories.map((cat, i)=>(<span key={i} className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">{cat}</span>))
                  : <span className="text-xs text-gray-400">No categories assigned</span>
                }
            </div>
              {superVolunteer&& (<p className="text-sm font-normal text-gray-600">Super Volunteer: <span className="font-medium text-gray-800">{superVolunteer}</span></p>)}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button variant="outline" className="w-full" onClick={handleView}>View Full Details</Button>
            {!isOrganization ? (
              !applied ? (
                <Button variant="primary" onClick={handleApply}>Apply Now</Button>
              ) : (
                <Button variant="disabled">Applied</Button>
              )
            ) : (
              status !== "COMPLETED" && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditing(true)}>Edit</Button>
                  {isDraft && (
                    <Button variant="green" className="flex-1" onClick={() => { if (onPublish) onPublish(id, title); }}>
                      Publish
                    </Button>
                  )}
                </div>
              )
            )}
          </div>
      </div>

      {/* Volunteer can views details of an organization after applying, therefore, application form should not be shown */}
      {(displayForm && (!manage || !applied))&& <ApplicationModal/>}
      <DisplayModal/>
    </>}
    <ShareModalComponent/>
    <AlertDialog/>
    <ImageViewerModal/>
</div>
}


{/*Highlights only active button, used for navigation, allowing user toggle*/}
export const RadioButton: React.FC<{children: React.ReactNode;  value?:string; activeSyle?:string; inActiveStyle?:string; active?: boolean; onClick?: (event:React.MouseEvent<HTMLButtonElement>) => void; notificationCount?:number}> = ({ children, active, onClick, activeSyle, inActiveStyle, value}) => {
  let activeStyle_ = activeSyle;
  let notActiveStyle = inActiveStyle;

  if(!activeSyle)
    activeStyle_ = "bg-white rounded-xl w-full text-black shadow-md rounded-t-lg py-2"
  if(!inActiveStyle)
    notActiveStyle = "bg-[#E7E9EF] w-full rounded-xl text-gray-600 hover:bg-gray-300 py-2"

  return (
        <button
        onClick={onClick}
        className={`relative z-10 flex items-center justify-center gap-2 px-4 text-sm font-semibold transition-all
            ${active
            ? activeStyle_
            : notActiveStyle}`}
        value={value}
        >
        <span>{children}</span>

        
        </button>
    );
};