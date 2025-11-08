import { useEffect, useState } from "react";
import type { DashboardProps, MetricProps, OrganizationProps, QuickActions } from "../interface/interfaces";
import { Banner, MetricCard, OrganizationCard, ProjectCard, RadioButton } from "./ReuseableComponents";
import { BriefcaseIcon, ClockIcon, ShieldIcon, StarIcon } from "./icons";
import { EditProfile } from "./editProfile";

const Dashboard:React.FC<DashboardProps> = ({metrics, projects, triggerAction})=>{
    const [active, setActive] = useState("")
    const [metricState, setMetrics] = useState<MetricProps[]>([
            {
                title: "Hours Logged",
                context: "",
                icon: <ClockIcon className="w-6 h-6"/>,
                value:"",
                color: "#1A73E8"
            },
             {
                title: "Projects completed",
                context: "",
                icon: <BriefcaseIcon/>,
                value:"",
                color: "#34A853"
            },
             {
                title: "Badges Earned",
                context: "",
                icon: <ShieldIcon fill="none" color="#FBBC05" />,
                value:"",
                color: "#FBBC05"
            },
             {
                title: "Rating",
                context: "",
                icon: <StarIcon color="#237238" fill="none"/>,
                value:"",
                color: "#34A853"
            }
        ]
    )

    const [organizations, setOrganizations] = useState<OrganizationProps[]>([])


    useEffect(() => {
    if (metrics && metrics.length > 0) {
        
      setMetrics((prev) =>
        prev.map((defaultMetric) => {
          const match = metrics.find((m) => m.title === defaultMetric.title);
          return match
            ? { ...defaultMetric, value: match.value, context: match.context }
            : defaultMetric;
        })
      );
    }
  }, [metrics]);


    const quickActions = new Map<QuickActions, string>();
    quickActions.set("Find Opportunities", "Find Opportunities")
    quickActions.set("View Organizations", "View Organizations")
    quickActions.set("Update Profile", "Update Profile")
    
    const activateQuickAction = (event:React.MouseEvent<HTMLButtonElement>)=>{
        let selectedAction = event.currentTarget.value
        // Deactivate when user clicks on an active action
        if(active == selectedAction){
            setActive("")
            return
        }
        let action = selectedAction as QuickActions;

        
        setActive(quickActions.has(action)?selectedAction: "")

        switch(action){
            case "Find Opportunities":
                if(triggerAction)
                    triggerAction("Find Opportunities")
                break;
            case "View Organizations":
                handleOrganization()
                break;
            case "Update Profile":
                break;
        }
    }
    

    // Will make fetch request for organizations
    const fetchOrganization = async ():Promise<OrganizationProps[]>=>{
        // fetch 
         try{
        
            const response = await fetch("/data/organizations.json", {
            headers:{
                "content-Type":"application/json",
                 "cache-control":"no-cache"
                 }
                })
        
            if(!response.ok){
                throw new Error("Failed to fetch projects")
            }
        
            const data = await response.json()
            return data as OrganizationProps[]
        }catch(error){
            console.error("Error loading data")
            return []
        }
    }

    const handleOrganization = async ()=>{
        setOrganizations(await fetchOrganization())
    }

    const renderContent = () => {
        if (active === "Update Profile") {
            return (
            <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
                <EditProfile />
            </div>
            );
        }

        if (organizations && active === "View Organizations") {
            return (
            <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
                <p className="text-xl font-bold text-gray-800">Organizations</p>
                <span className="text-sm font-medium text-gray-500">
                Based on your skills and location
                </span>
                {organizations.map((organization, index) => (
                <OrganizationCard
                    {...organization}
                    key={`${organization.name}-${index}`}
                />
                ))}
            </div>
            );
        }

        // Default (dashboard)
        return (
            <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
            <p className="text-xl font-bold text-gray-800">Recommended for you</p>
            <span className="text-sm font-medium text-gray-500">
                Based on your skills and location
            </span>
            {projects.map((project, index) => (
                <ProjectCard {...project} key={index} />
            ))}
            </div>
        );
    };

    return <>
        <div className="w-full grid grid-cols-1 gap-4 mt-2 ">
            {/* Volunteer Metrics */}
            <div className="grid grid-cols-4 gap-5 mb-2">
                {metricState.map((metric, i)=> <MetricCard {...metric} key={i}/>)}
            </div>

            {/* Quick Actions */}
            <div className="border border-gray-300 rounded-xl p-4">
                <p className="text-xl font-bold text-gray-800">Quick Actions</p>
                <div className="flex gap-x-2">
                    {Array.from(quickActions.entries()).map((entry, index)=>{
                    const notActiveStyle = "text-grey-600 shadow-md rounded-xl hover:bg-blue-700 hover:text-white w-full"
                    const title = entry[0]
                    const content = entry[1] 
                    return <RadioButton active={active == title} value={title} key={title} 
                        activeSyle="bg-blue-600 w-full text-white rounded-xl" inActiveStyle={notActiveStyle}
                        onClick={activateQuickAction}>
                            <Banner title={title} content={content} key={index}/>
                        </RadioButton>
                    })}
                </div>
            </div>

            {/* Recommended for you */}
            <>{renderContent()}</>
           
        </div>
    </>
}


export default Dashboard;