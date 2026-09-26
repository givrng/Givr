import { useEffect, useState } from "react"
import type { OrganizationDashboardProps, OrganizationQuickActions, ProjectProps, VerificationStatus } from "../../interface/interfaces"
import { Button, ProjectCard, RadioButton } from "../ReuseableComponents"
import { CreateProject } from "../Organization/createProjectForm"
import useAuthFetch from "../hooks/useAuthFetch"
import { useAlert } from "../hooks/useAlert"
import { useConfirmAsk } from "../hooks/useConfirm"
import  { PageLoader } from "../icons"

export const ProjectHub:React.FC<{ isOrganization?:boolean, orgTriggerAction?:(action: OrganizationQuickActions)=>void}>= ({ isOrganization=false, orgTriggerAction})=>{
    const[itemsCategories, setItemCategories] = useState<string[]>([])
    const [activeCategory, setActiveCategory] = useState<string>("All Categories")
    const [newProject, setNewProject] = useState<boolean>(false);
    const {alertMessage, AlertDialog} = useAlert({isOrg:isOrganization})

    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:true})
    const [change, setChange] = useState(false)
    // Projects are for volunteers
    const [projects, setProjects] = useState<ProjectProps[]>([]);

    // Organization draft projects
    const [organizationDraftProjects, setOrganizationDraftProjects] = useState<ProjectProps[]>([])

    // Organization all published projects (OPEN, ONGOING, COMPLETED)
    const [organizationAllProjects, setOrganizationAllProjects] = useState<ProjectProps[]>([])

    // Status filter for organization published projects
    const [orgProjectStatusFilter, setOrgProjectStatusFilter] = useState<string>("OPEN")

    const {API} = useAuthFetch(isOrganization? "organization": "volunteer");
    const [isLoading, setIsloading] = useState(true)
    const [verificaitonStatus, setVerificationStatus] = useState<VerificationStatus>()
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(()=>{
        if(isOrganization)
            return
        const categories = new Set<string>()
        projects.forEach((project)=>project.categories.forEach((category)=>categories.add(category)))
        categories.keys()
        setItemCategories(["All Categories" , ...Array.from(categories).sort()])
    }, [projects])



    const activatecategory = (e:React.MouseEvent<HTMLButtonElement>)=>{
        setActiveCategory(e.currentTarget.value)
    }

    const createProject = ()=>{
        setNewProject(true)
    }

    const fetchProjects = async ()=>{
        try{
            setIsloading(true)
            let res = await API().get("/projects")
            setProjects(res.data as ProjectProps[])
        }finally{
            setIsloading(false)
        }
    }

    const loadOrganizationProjects = async (): Promise<void> =>{
        try{
            setIsloading(true)
            let response = await API().get("/dashboard")
             const data = response.data as OrganizationDashboardProps
            setOrganizationDraftProjects(data.projects.draftProjects)

            // Combine OPEN, ONGOING, and COMPLETED projects for project management view
            const allPublished = [
                ...data.projects.openProjects,
                ...data.projects.ongoingProjects,
                ...data.projects.completedProjects,
                ...data.projects.closedProjects
            ]
            setOrganizationAllProjects(allPublished)
            setVerificationStatus(data.status)
            setIsDisabled(data.status != "VERIFIED")
        }finally{
            setIsloading(false)
        }
    }

    const onSuccessfulProjectUpdate = (updatedProject:ProjectProps)=>{
        setOrganizationDraftProjects(prev=> prev.map(p=>p.id == updatedProject.id? updatedProject: p))
    }

    const handlePublish = async (projectId:number, title:string)=>{
         let userConfirmed = await confirmAsk({
            question: `Are you sure you want to publish ${title} project?`,
            trueAnswer: "Publish",
            falseAnswer: "Cancel"
        })

        if(userConfirmed){
            API().patch(`/projects/${projectId}/publish`)
            .then(()=>{
                setChange(!change)
            }, ()=>alertMessage(`Failed to publish ${title} project, please try again`))
        }
    }

    const handleDelete = async (projectId:number, title:string)=>{

        let userConfirmed = await confirmAsk({
            question: `Are you sure you want to delete "${title}" project?`,
            trueAnswer: "Delete",
            falseAnswer: "Cancel"
        })

        if(!userConfirmed) return

        try{
            await API().delete(`/projects/${projectId}`)
            setOrganizationDraftProjects(prev=>prev.filter(p=>p.id !== projectId))
        }catch{
            alertMessage(`Failed to delete ${title} project, please try again`)
        }
    }


    useEffect(()=>{
        if(!isOrganization){
            (async ()=>fetchProjects())()
        }else{
            loadOrganizationProjects()
        }
    }, [change])

    const handleSave = async (projects: ProjectProps[])=>{
        setOrganizationDraftProjects(projects)
    }

    // Filter published projects by selected status
    const filteredOrgProjects = orgProjectStatusFilter === "All"
        ? organizationAllProjects
        : organizationAllProjects.filter(p => p.status === orgProjectStatusFilter)

    const orgStatusFilters = ["All", "OPEN", "ONGOING", "COMPLETED"]

    return <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
        {<AlertDialog/>}
        {<ConfirmDialog/>}
       {isLoading? <PageLoader color={isOrganization?"green":"blue"}/>:<>
        {/**Volunteer View */}
        {!isOrganization&&
             <>
            <p className="text-xl font-bold text-gray-800">
                Find Volunteering opportunities
            </p>
            <span className="text-sm font-medium text-gray-500">Discover verfied projects that match your skill and availability</span>

            <div className="flex flex-wrap gap-2">
                {itemsCategories.map((category, i)=>(<RadioButton key={i} inActiveStyle="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700"
                value={category} active={category==activeCategory} onClick={activatecategory}
                activeSyle="bg-white rounded-xl text-black shadow-md rounded-t-lg py-2"
                >
                {category}
            </RadioButton>))}
            </div>
            </>
        }

        {/* Organization view */}
        {newProject?<CreateProject onClose={()=>{
            setNewProject(false)
            }}
            handlesave={handleSave}
             />:<>
                {isOrganization && <div>
                    <div  className="flex items-center justify-between gap-3">
                        <span className="text-xl font-bold text-green-800">Project Management</span>
<Button variant={isDisabled?"disabled":"green"} onClick={createProject}>+ Create Project</Button>
                    </div>

                        {/* Draft Projects Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-green-700 mb-3">Draft Projects</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {organizationDraftProjects.length > 0 ? (
                                    organizationDraftProjects.map((project, i) => <ProjectCard {...project} key={i} isOrganization={true} isDraft={true} onEdit={onSuccessfulProjectUpdate} onPublish={handlePublish} onDelete={handleDelete}/>).reverse()
                                ) : (
                                    <p className="text-sm text-gray-500 col-span-2">No draft projects</p>
                                )}
                            </div>
                        </div>

                        {/* Published Projects Section with Status Filters */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                                <h3 className="text-lg font-bold text-green-700">Published Projects</h3>
                                <div className="flex flex-wrap gap-2">
                                    {orgStatusFilters.map((status, i) => (
                                        <RadioButton
                                            key={i}
                                            inActiveStyle="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700"
                                            value={status}
                                            active={orgProjectStatusFilter === status}
                                            onClick={(e) => setOrgProjectStatusFilter(e.currentTarget.value)}
                                            activeSyle="bg-green-600 text-white rounded-full text-xs px-3 py-1 shadow-md"
                                        >
                                            {status === "All" ? "All" : status}
                                        </RadioButton>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredOrgProjects.length > 0 ? (
                                    filteredOrgProjects.map((project, i) =>
                                        <ProjectCard {...project} key={i} isOrganization={true} manage={true} />
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500 col-span-2">
                                        No {orgProjectStatusFilter === "All" ? "published" : orgProjectStatusFilter.toLowerCase()} projects
                                    </p>
                                )}
                            </div>
                        </div>

                        {isDisabled && (
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 mt-6">
                            {
                                verificaitonStatus=="UNVERIFIED" && <span>
                            Add your <strong>organization's information</strong> to complete your profile and manage projects
                            </span>
                            }
                            {
                                verificaitonStatus == "PENDING" && <span>
                            Your <strong>organization's information</strong> is under review
                            </span>
                            }
                            <button className="whitespace-nowrap font-medium underline hover:opacity-80"
                                onClick={()=>{
                                   if(orgTriggerAction)
                                    orgTriggerAction("Edit Profile")
                                }}
                            >
                            Update profile
                            </button>
                        </div>
                        )}
                    </div>}

                {!isOrganization && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeCategory=="All Categories"
                            ? (projects?.map((project, index)=> <ProjectCard {...project} key={index} isOrganization={isOrganization} manage={true}/>))
                            : (projects.filter((p)=> p.categories.includes(activeCategory)).map((p, i)=><ProjectCard {...p} key={i} manage={true}/>))
                        }
                    </div>
                )}
                </>
                }

       </>}
    </div>
}