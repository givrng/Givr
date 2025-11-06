import { useEffect, useState } from "react";
import type { DashboardProps, MetricProps } from "../interface/interfaces";
import { Banner, MetricCard, ProjectCard, RadioButton } from "./ReuseableComponents";
import { BriefcaseIcon, ClockIcon, ShieldIcon, StarIcon } from "./icons";

const Dashboard:React.FC<DashboardProps> = ({metrics, projects})=>{
    const [active, setActive] = useState("")
    const [metricState, setMetrics] = useState<MetricProps[]>([
            {
                title: "Hours Logged",
                context: "",
                icon: <ClockIcon/>,
                value:"",
                
            },
             {
                title: "Projects completed",
                context: "",
                icon: <BriefcaseIcon/>,
                value:""
            },
             {
                title: "Badges Earned",
                context: "",
                icon: <ShieldIcon fill="none" color="#FBBC05" />,
                value:""
            },
             {
                title: "Rating",
                context: "",
                icon: <StarIcon color="#237238" fill="none"/>,
                value:""
            }
        ]
    )
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

    const quickActions = new Map<string, string>();
    quickActions.set("Find Opportunities", "Browse new projects")
    quickActions.set("View Organizations", "Browse Organizations")
    quickActions.set("Update Profile", "Browse new Project")
    
    const activateQuickAction = (event:React.MouseEvent<HTMLButtonElement>)=>{
        let selectedAction = event.currentTarget.value
        
        // Select no quick action by default
        setActive(quickActions.has(selectedAction)?selectedAction: "")

        // Deactivate when user clicks on an active action
        if(active == selectedAction)
            setActive("")
    }
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
                    const notActiveStyle = "text-grey-600 shadow-md rounded-xl hover:bg-blue-700 w-full"
                    const title = entry[0]
                    const content = entry[1]
                    console.log(title)  
                    return <RadioButton active={active == title} value={title} key={title} 
                        activeSyle="bg-blue-600 w-full rounded-xl" inActiveStyle={notActiveStyle}
                        onClick={activateQuickAction}>
                            <Banner title={title} content={content} key={index}/>
                        </RadioButton>
                    })}
                </div>
            </div>

            {/* Recommended for you */}

            <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
                <p className="text-xl font-bold text-gray-800">
                    Recommended for you
                </p>
                <span className="text-sm font-medium text-gray-500">Based on your skills and location</span>
                {projects.map((project, index)=> <ProjectCard {...project} key={index}/>)}
            </div>
        </div>
    </>
}


export default Dashboard;