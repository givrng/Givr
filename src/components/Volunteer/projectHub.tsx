import { useEffect, useState } from "react"
import type { OrganizationDashboardProps, ProjectProps } from "../../interface/interfaces"
import { Button, ProjectCard, RadioButton } from "../ReuseableComponents"
import { CreateProject } from "../Organization/createProjectForm"
import useAuthFetch from "../hooks/useAuthFetch"
import { useAlert } from "../hooks/useAlert"
import { useConfirmAsk } from "../hooks/useConfirm"
import  { PageLoader } from "../icons"

export const ProjectHub:React.FC<{ isOrganization?:boolean, isDisabled?:boolean}>= ({ isOrganization=false, isDisabled=false})=>{
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

    const loadDraftProjects = async (): Promise<ProjectProps[]> =>{
        
        try{
            setIsloading(true)
            let response = await API().get("/dashboard")
             const data = response.data as OrganizationDashboardProps
            setOrganizationDraftProjects(data.projects.draftProjects)
            return data.projects.draftProjects
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

    useEffect(() => {
        if (!isOrganization || !isDisabled) return;

        const timeout = setTimeout(() => {
            alertMessage("Complete organization profile to create projects");
        }, 500);

        return () => clearTimeout(timeout);
    }, [isOrganization, isDisabled]);
        
    useEffect(()=>{

        let timeout;
        if(isDisabled){
        timeout = setTimeout(()=>{
            alertMessage("Complete organization profile to create projects")
        }, 100)

        return clearTimeout(timeout)
    }
    }, [])
    

    useEffect(()=>{
        setIsloading(true)
        if(!isOrganization){
            (async ()=>fetchProjects())()
        }else{
            loadDraftProjects()
        }
        setIsloading(false)
    }, [change])

    const handleSave = (projects: ProjectProps[])=>{
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
            <p className="text-xl font-bold text-green-800 flex justify-between">
                <span>Project Management</span>
                <Button variant={isDisabled?"disabled":"green"} onClick={createProject}>+ Create Project</Button>
            </p>

                <div className="text-sm font-bold text-green-800 flex flex-col justify-between">
                    <span>Draft Projects</span>

                    <p className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {organizationDraftProjects.map((project, i) => <ProjectCard {...project} key={i} isOrganization={true} isDraft={true} onEdit={onSuccessfulProjectUpdate} onPublish={handlePublish} onDelete={handleDelete}/>).reverse()}
                    </p>
                </div>
            </div>}

        {activeCategory=="All Categories"? (projects?.map((project, index)=> <ProjectCard {...project} key={index} isOrganization={isOrganization} manage={true}/>))
        : (projects.filter((p)=> p.categories.includes(activeCategory)).map((p, i)=><ProjectCard {...p} key={i} manage={true}/>))}
        </>
        }
        
       </>}
    </div>
}