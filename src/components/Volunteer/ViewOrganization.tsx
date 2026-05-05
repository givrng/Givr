import React, { useCallback,  useEffect,  useState,} from 'react';
import { 
  Globe, 
  MapPin, 
  ExternalLink, 
  ShieldCheck,  
  ChevronRight, 
  Building2, 
  Star,
  FolderDot,
  LayoutDashboard,
  ArrowLeft,
  CalendarIcon,
  Hourglass,
  
} from 'lucide-react';
import type { OrganizationProps, ProjectProps } from '../../interface/interfaces';
import useAuthFetch from '../hooks/useAuthFetch';
import {  Button, InfoCell } from '../ReuseableComponents';
import { GroupIcon, LocationIcon } from '../icons';
import { useApplicationForm } from './ApplicationForm';

/** * Interfaces based on your requirements 
 */
interface OrganizationViewComponentProps {
  organization?: OrganizationProps;
  onBack: () => void;
  isOpen: boolean;
}

export const useOrganizationView = ()=>{

    const [isOpen, setIsOpen] = useState(false)
    const [organization, setOrganization] = useState<OrganizationProps>()
    const [customOnClose, setCustomOnClose] = useState<() => void>();
    
    /**
     * OrganizationView Component (TypeScript)
     * Renders a detailed profile page for an organization.
     */
    const OrganizationView: React.FC<OrganizationViewComponentProps> = ({ organization, onBack, isOpen }) => {
        const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');
        const {API} = useAuthFetch("volunteer")
        const [projects, setProjects] = useState<ProjectProps[]>([])
        let numOfProjects = projects.length
        // Destructuring with defaults
        let {
            name = "Unnamed Organization",
            description = "No description provided.",
            location = { lga: "Unknown", state: "Unknown" },
            category = [],
            status = "PENDING",
            website = "#",
            address = "No physical address provided",
            rating = 0,
            profileUrl = ""
        } = organization || {};

        
        const handleViewProjects = (): void => {
            setActiveTab('projects');
            window.scrollTo({ top: 500, behavior: 'smooth' });
        };

        useEffect(()=>{
            (async ()=>{
                try{
                    let response = await API().get(`/organizations/${organization?.organizationId}/projects/active`)
                    let data = response.data as ProjectProps[];
                    
                    setProjects(()=>{
                        return data.length>0? data: [];
                    }) 
                    
                }catch(err){
                    console.error(err)
                }
            })()
        }, [])

        if(!isOpen)
            return null;

        return (
            <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors group"
                >
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors text-slate-400 group-hover:text-indigo-600">
                    <ArrowLeft size={20} />
                    </div>
                    Back to Organizations
                </button>
                </div>
            </nav>

            {/* Header Section */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                    
                    {/* Logo / Profile Image */}
                    <div className="relative shrink-0">
                    <div className="h-40 w-40 rounded-3xl bg-gradient-to-br from-green-500 to-orange-600 flex items-center justify-center text-white overflow-hidden shadow-xl border-4 border-white">
                        {profileUrl ? (
                        <img src={profileUrl} alt={name} className="h-full w-full object-cover" />
                        ) : (
                        <Building2 size={64}/>
                        )}
                    </div>
                    {status === 'VERIFIED' && (
                        <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-lg">
                        <ShieldCheck size={22} />
                        </div>
                    )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{name}</h1>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {status}
                        </span>
                    </div>
                    
                    <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mb-6">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-indigo-500" />
                        {address}
                        </div>
                        <div className="flex items-center gap-2">
                        
                        {website && <>
                        <Globe size={18} className="text-indigo-500" />
                        <a href={website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 transition-colors flex items-center gap-1">
                            Official Website <ExternalLink size={14} />
                        </a></>}
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                        <Star size={16} fill="currentColor" />
                        {rating.toFixed(1)} Rating
                        </div>
                    </div>
                    </div>

                    {/* View Projects Action */}
                    <div className="flex flex-col gap-3 min-w-[220px]">
                    <button 
                        onClick={handleViewProjects}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        View Projects
                        <ChevronRight size={20} />
                    </button>
                    </div>
                </div>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex gap-8 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 font-bold text-sm transition-all relative ${
                    activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    OVERVIEW
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                </button>
                <button 
                    onClick={() => setActiveTab('projects')}
                    className={`pb-4 font-bold text-sm transition-all relative ${
                    activeTab === 'projects' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    PROJECTS ({numOfProjects})
                    {activeTab === 'projects' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Classification Card */}
                    <div className="space-y-6">
                    <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-slate-900 font-bold mb-5 flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-indigo-500" />
                        Classification
                        </h3>
                        <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categories</label>
                            <div className="flex flex-wrap gap-2 mt-3">
                            {category.map((cat, i) => (
                                <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-100">
                                {cat}
                                </span>
                            ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance</label>
                            <div className="flex items-center gap-3 mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className={`w-3 h-3 rounded-full ${status === 'VERIFIED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                            <span className="text-slate-700 font-bold text-sm capitalize">{status} Entity</span>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
                        <div className="relative z-10 flex items-center gap-5">
                        <div className="bg-indigo-500 p-4 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <FolderDot size={28} className="text-white" />
                        </div>
                        <div>
                            <div className="text-slate-400 text-xs font-bold tracking-widest mb-1 uppercase">Projects</div>
                            <div className="text-3xl font-black">{numOfProjects}</div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* About Bio Section */}
                    <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">About the Organization</h3>
                        <div className="space-y-6">
                        <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-indigo-100 pl-6">
                            {description}
                        </p>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Headquartered in <strong>{location?.state}, Nigeria</strong>, {name} operates with a commitment to high standards. 
                            The organization currently maintains an excellent public performance rating. 
                            {status === 'VERIFIED' 
                            ? " As a verified entity, all registration documents and contact points have been validated by our compliance team." 
                            : " This profile is currently in the verification pipeline."}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                ) : (
                /* Projects List */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))
                    ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-inner">
                        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
                        <FolderDot size={56} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No active projects</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">This organization hasn't published any active project listings at this time.</p>
                    </div>
                    )}
                </div>
                )}
            </main>
            </div>
        );
    };

    interface ProjectCardProps {
    project: ProjectProps;
    }

    
    /**
     * Sub-component for individual project cards
     */
    const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
        let duration = (Date.parse(project.endDate) - Date.parse(project.startDate))/(1000 * 60 *60 * 24)
        const viewApplicationForm = () =>{
            setApplicationFormOpen(true)
            openApplicationForm({
                onCancel: ()=>setApplicationFormOpen(false),
                projectId: project.id,
                organization: organization?.name
            })
        }  

        const [applicationFormOpen, setApplicationFormOpen] = useState(false)
        const {openApplicationForm, ApplicationModal} = useApplicationForm()

        return (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col h-full">
               {applicationFormOpen? <ApplicationModal/>: <>
                    <div className="flex justify-between items-start mb-6">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight pr-4">
                        {project.title || "Untitled Project"}
                        </h4>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-100 shrink-0">
                        {project.status || 'Active'}
                        </span>
                    </div>
                    <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                        {project.description || "No project description available."}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 py-4 border-y border-gray-200">
                        <InfoCell icon={<CalendarIcon/>} info={project.startDate? project.startDate.split(",")[0]: "Jan 20, 2025"}/>
                        {/* <InfoCell icon={<ClockIcon color="#676879" className="w-6 w-6"/>} info={attendanceHours && `${attendanceHours.from.toUpperCase()}-${attendanceHours.to.toUpperCase()}`}/> */}
                        <InfoCell icon= {<Hourglass/>} info={`${Math.round(duration)} days`}/>
                        <InfoCell icon={<LocationIcon/>} info={project.address? `${project.address}`: "Wuse District, Abuja"}/>
                        {project.status == "OPEN"? <InfoCell icon={<GroupIcon/>} info={`${project.totalApplicants?project.totalApplicants: 0 }/${project.maxVolunteers?project.maxVolunteers: 20}` }/>
                            : <InfoCell icon={<Star/>} info={`${project.rating}/5`}/>}
                    </div>
                    {
                        project.status == "OPEN" && <div className="flex items-center justify-end pt-6 border-t border-slate-100">
                        <Button variant='primary' onClick={viewApplicationForm}>Apply Now</Button>
                    </div>
                    }
                    
                </>}
            </div>
        );
    };

    const OpenOrganizationView = useCallback((organization: OrganizationProps, onBack:()=>void)=>{
        setOrganization(organization)
        
        setCustomOnClose(()=>onBack)
        setIsOpen(true)
    }, [])

    const closeModal = useCallback(()=>{
        setIsOpen(false)
        
        if(customOnClose){
            customOnClose()
        }
            

        setTimeout(()=> setOrganization({}), 300)
    }, [customOnClose])

    const OrganizationViewModal = ()=>(
        <OrganizationView onBack={closeModal} organization={organization} isOpen={isOpen}/>
    )

    return {OpenOrganizationView, OrganizationViewModal}
}