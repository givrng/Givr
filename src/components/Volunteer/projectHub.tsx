import { useEffect, useState } from "react"
import type { ProjectProps } from "../../interface/interfaces"
import { Button, ProjectCard, RadioButton } from "../ReuseableComponents"
import { CreateProject } from "../Organization/createProjectForm"


export const ProjectHub:React.FC<{projects:ProjectProps[], isOrganization?:boolean}>= ({projects, isOrganization=false})=>{
    const[itemsCategories, setItemCategories] = useState<string[]>([])
    const [activeCategory, setActiveCategory] = useState<string>("All Categories")
    const [newProject, setNewProject] = useState<boolean>(false);

    if(!isOrganization){
        useEffect(()=>{
            const categories = new Set<string>()
            projects.forEach((project)=>project.categories.forEach((category)=>categories.add(category)))
            categories.keys()
            setItemCategories(["All Categories" , ...Array.from(categories).sort()])
        }, [projects])
    }


    const activatecategory = (e:React.MouseEvent<HTMLButtonElement>)=>{
        setActiveCategory(e.currentTarget.value)
    }


    const createProject = ()=>{
        setNewProject(true)
    }

    return <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
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
        {newProject?<CreateProject onClose={()=>{setNewProject(false)}}/>:<>
        {isOrganization && <p className="text-xl font-bold text-green-800 flex justify-between">
            <span>Project Management</span>
            <Button variant="green" onClick={createProject}>+ Create Project</Button>
        </p>}

        {activeCategory=="All Categories"? (projects.map((project, index)=> <ProjectCard {...project} key={index} isOrganization={isOrganization} manage={true}/>))
        : (projects.filter((p)=> p.categories.includes(activeCategory)).map((p, i)=><ProjectCard {...p} key={i} manage={true}/>))}
        </>
        }
        
    </div>
}