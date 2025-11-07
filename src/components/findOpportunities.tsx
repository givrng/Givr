import { useEffect, useState } from "react"
import type { ProjectProps } from "../interface/interfaces"
import { ProjectCard, RadioButton } from "./ReuseableComponents"


export const FindOpportunity:React.FC<{projects:ProjectProps[]}>= ({projects})=>{
    const[itemsCategories, setItemCategories] = useState<string[]>([])
    const [activeCategory, setActiveCategory] = useState<string>("All Categories")


    useEffect(()=>{
        const categories = new Set<string>()
        projects.forEach((project)=>project.categories.forEach((category)=>categories.add(category)))
        categories.keys()
        setItemCategories(["All Categories" , ...Array.from(categories).sort()])
    }, [projects])
    
    const activatecategory = (e:React.MouseEvent<HTMLButtonElement>)=>{
        setActiveCategory(e.currentTarget.value)
    }

    return <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
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
            {activeCategory=="All Categories"? (projects.map((project, index)=> <ProjectCard {...project} key={index} viewDetails={true}/>))
            : (projects.filter((p)=> p.categories.includes(activeCategory)).map((p, i)=><ProjectCard {...p} key={i} viewDetails={true}/>))}
    </div>
}