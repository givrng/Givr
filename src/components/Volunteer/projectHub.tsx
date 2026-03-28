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

    // Organization draft project
    const [organizationDraftProjects, setOrganizationDraftProjects] = useState<ProjectProps[]>([])

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

    const loadDraftProjects = async (): Promise<void> =>{

        try{
            setIsloading(true)
            let response = await API().get("/dashboard")
             const data = response.data as OrganizationDashboardProps
            setOrganizationDraftProjects(data.projects.draftProjects)
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
                setProjects(projects.filter(p=>p.id!=projectId))
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
        setIsloading(true)
        if(!isOrganization){
            (async ()=>fetchProjects())()
        }else{
            loadDraftProjects()
        }
        setIsloading(false)
    }, [change])

    const handleSave = async (projects: ProjectProps[])=>{
        setOrganizationDraftProjects(projects)
    }



    // useEffect(()=>console.log(organizationDraftProjects), [organizationDraftProjects])
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

                        <div className="text-sm font-bold text-green-800 flex flex-col justify-between">
                        
                            <p className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {organizationDraftProjects.map((project, i) => <ProjectCard {...project} key={i} isOrganization={true} isDraft={true} onEdit={onSuccessfulProjectUpdate} onPublish={handlePublish} onDelete={handleDelete}/>).reverse()}
                            </p>
                        </div>
                        {isDisabled && (
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {
                                verificaitonStatus=="UNVERIFIED" && <span>
                            Add your <strong>organization's information</strong> to complete your profile and manage projects
                            </span>
                            }
                            {
                                verificaitonStatus == "PENDING" && <span>
                            You <strong>organization's information</strong> is under review
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

                {activeCategory=="All Categories"? (projects?.map((project, index)=> <ProjectCard {...project} key={index} isOrganization={isOrganization} manage={true}/>))
                : (projects.filter((p)=> p.categories.includes(activeCategory)).map((p, i)=><ProjectCard {...p} key={i} manage={true}/>))}
                </>
                }

       </>}
    </div>
}