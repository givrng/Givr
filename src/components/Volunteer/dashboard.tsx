import { useState } from "react";
import type { DashboardProps, OrganizationProps, OrganizationQuickActions, VolunteerQuickActions } from "../../interface/interfaces";
import { Banner, MetricCard, OrganizationCard, ProjectCard, RadioButton } from "../ReuseableComponents";
import { EditProfile } from "./editProfile";
import useAuthFetch from "../hooks/useAuthFetch";

const Dashboard:React.FC<DashboardProps> = ({metrics, projects, triggerAction, orgTriggerAction})=>{
    const [active, setActive] = useState("")
    const {API} = useAuthFetch("volunteer")

    const [organizations, setOrganizations] = useState<OrganizationProps[]>([])


//     useEffect(() => {
//     if (metrics && metrics.length > 0) {
        
//       setMetrics((prev) =>
//         prev.map((defaultMetric) => {
//           const match = metrics.find((m) => m.title === defaultMetric.title);
//           return match
//             ? { ...defaultMetric, value: match.value, context: match.context }
//             : defaultMetric;
//         })
//       );
//     }
//   }, [metrics]);


    let quickActions = new Map<OrganizationQuickActions|VolunteerQuickActions, string>(); 
    if(triggerAction){
        quickActions.set("Find Opportunities", "Find Opportunities")
        quickActions.set("View Organizations", "View Organizations")
        quickActions.set("Update Profile", "Update Profile")
    }else{
        quickActions.set("Create New Project", "Create New Project")
        quickActions.set("Review pending applications", "Review pending applications")
        quickActions.set("View Analytics", "View Analytics")
    }
    
    const activateQuickAction = (event:React.MouseEvent<HTMLButtonElement>)=>{
        let selectedAction = event.currentTarget.value
        // Deactivate when user clicks on an active action
        if(active == selectedAction){
            setActive("")
            return
        }
        let action = selectedAction as VolunteerQuickActions| OrganizationQuickActions;

        
        setActive(quickActions.has(action)?selectedAction: "")

        switch(action){
            // Volunteer Actions
            case "Find Opportunities":
                if(triggerAction)
                    triggerAction("Find Opportunities")
                break;
            case "View Organizations":
                handleOrganization()
                break;
            case "Update Profile":
                break;

            // Organization Actions
            case "Create New Project":
                if(orgTriggerAction)
                    orgTriggerAction(action)
                break;
            case "Review pending applications":
                if(orgTriggerAction)
                    orgTriggerAction(action)
                break;
            case "View Analytics":
                if(orgTriggerAction)
                    orgTriggerAction(action)
                break;
        }
    }
    

    // Will make fetch request for organizations
    const fetchOrganization = async ()=>{
        // fetch 
        await API().get("/organizations")
        .then((response)=>{
            setOrganizations(response.data as OrganizationProps[])
        })
        
    }

    const handleOrganization = async ()=>{
        await fetchOrganization()
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
            <p className="text-xl font-bold text-gray-800">{triggerAction? "Recommended for you": "Your Projects"}</p>
            <span className="text-sm font-medium text-gray-500">
                {triggerAction && "Based on your skills and location"}
            </span>
            {projects.map((project, index) => (
                <ProjectCard {...project} key={index} isOrganization={true}/>
            ))}
            </div>
        );
    };

    return <>
        <div className="w-full grid grid-cols-1 gap-4 mt-2 ">
            {/* Volunteer Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-2">
                {metrics?.map((metric, i)=> <MetricCard {...metric} key={i}/>)}
            </div>

            {/* Quick Actions */}
            <div className="border border-gray-300 rounded-xl p-4">
                <p className="text-xl font-bold text-gray-800">Quick Actions</p>
                <div className="flex flex-col sm:flex-row gap-x-2">
                    {Array.from(quickActions.entries()).map((entry, index)=>{
                    const notActiveStyle = `text-grey-600 shadow-md rounded-xl hover:${triggerAction?"bg-blue-700":"bg-green-700"} hover:text-white w-full`
                    const title = entry[0]
                    const content = entry[1] 
                    return <RadioButton active={active == title} value={title} key={title} 
                        activeSyle={`${triggerAction?"bg-blue-600":"bg-green-600"} w-full text-white rounded-xl`} inActiveStyle={notActiveStyle}
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