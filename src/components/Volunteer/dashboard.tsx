import { useEffect, useState } from "react";
import { projectStatuses, type DashboardProps, type OrganizationProps, type OrganizationQuickActions, type ProjectProps, type VolunteerQuickActions } from "../../interface/interfaces";
import { Banner, MetricCard, OrganizationCard, ProjectCard, RadioButton } from "../ReuseableComponents";
import useAuthFetch from "../hooks/useAuthFetch";
import { useOrganizationView } from "./ViewOrganization";
// import useAuthFetch from "../hooks/useAuthFetch";

const Dashboard:React.FC<DashboardProps> = ({metrics, triggerAction, orgTriggerAction, hasMounted, profileCompleted})=>{
    const [active, setActive] = useState("")
    const {API} = useAuthFetch(orgTriggerAction?"organization":"volunteer")
    const [projects, setProjects] = useState<ProjectProps[]>([])
    const [organizations, setOrganizations] = useState<OrganizationProps[]>([])
    const [selectedProjectCategory, setSelectedProjectCategory] = useState("")

    // ------------- View organization properties start ----------------
    // Hook to render the details of a specific organization
    const {OpenOrganizationView, OrganizationViewModal} = useOrganizationView()
    const [viewOpen, setViewOpen] = useState(false)
    // --------- View organization properties end ---------

    useEffect(()=>{
        // Fetch projects when component is mounted
        (async ()=> fetchProjects())();
        hasMounted()
    }, [])

    let quickActions = new Map<OrganizationQuickActions|VolunteerQuickActions, string>(); 
    if(triggerAction){
        quickActions.set("Find Opportunities", "Find Opportunities")
        quickActions.set("View Organizations", "View Organizations")
        quickActions.set("Update Profile", "Update Profile")
    }else{
        quickActions.set("Create New Project", "Create New Project")
        quickActions.set("Review pending applications", "Review pending applications")
        quickActions.set("Edit Profile", "Modify Profile Information")
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
                fetchOrganization()
                break;
            case "Update Profile":
                if(triggerAction)
                    triggerAction("Update Profile")
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
            case "Edit Profile":
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


    const fetchProjects = async ()=>{
        await API().get(orgTriggerAction?"/projects":"/projects/recommended")
            .then((val)=>{
                setProjects(val.data as ProjectProps[])
            })
    }

    const handleOpenViewOrganization = (organization: OrganizationProps)=>{
        setViewOpen(true)
        OpenOrganizationView(organization, ()=>setViewOpen(false))
    }

    useEffect(() => {
    const handleBack = () => {
        // unmount logic (e.g. set state)
        if(viewOpen)
            setViewOpen(false);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
        window.removeEventListener("popstate", handleBack);
    };
    }, []);

    
    const renderContent = () => {
        if (organizations && active === "View Organizations") {
        
            return (
                <>
                {viewOpen? <OrganizationViewModal/>: <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
                <p className="text-xl font-bold text-gray-800">Organizations</p>
                <span className="text-sm font-medium text-gray-500">
                Based on your skills and location
                </span>
                {organizations.map((organization, index) => (
                <OrganizationCard
                    {...organization}
                    key={`${organization.name}-${index}`}
                    showOrganizationDetails={handleOpenViewOrganization}
                />
                ))}
            </div>}
                </>
            );
        }

    const activateSelectedProjectCategory = (event: React.MouseEvent<HTMLButtonElement>)=>{
        let selectButtonValue = event.currentTarget.textContent;
    
        setSelectedProjectCategory(selectButtonValue != selectedProjectCategory? selectButtonValue : "")
    }

        // Organization dashboard: no project cards here (moved to Project Management tab)
        if (orgTriggerAction) {
            return null;
        }

        // Volunteer dashboard: show projects with recommendations
        return (
            <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
            <p className="text-xl font-bold text-gray-800">{triggerAction? "Recommended for you": "Your Projects"}</p>
            <span className="text-sm font-medium text-gray-500">
                {triggerAction && "Based on your skills and location"}
            </span>
            <div className="flex gap-x-2">
                {triggerAction && projectStatuses
                    .filter(status => status !== "DRAFT")
                    .map((status, index)=><RadioButton 
                        key={index}
                        active={selectedProjectCategory == status}
                        value={status}
                        onClick={activateSelectedProjectCategory}
                        >{status}</RadioButton>)}
            </div>
            {!profileCompleted && triggerAction && (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    <span>
                    Add your <strong>location</strong> and <strong>interests</strong> to complete your profile and get better recommendations.
                    </span>
                    <button className="whitespace-nowrap font-medium underline hover:opacity-80"
                        onClick={()=>{
                            if(triggerAction)
                                triggerAction("Update Profile")
                        }}
                    >
                    Update profile
                    </button>
                </div>
                )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {projects?.filter(prj=>{
                    if(selectedProjectCategory != "")
                        return prj.status == selectedProjectCategory
                    return true
                }).map((project, index) => (
                    <ProjectCard {...project} key={index} isOrganization={false} manage={true}  onEdit={(project)=>{
                        setProjects(prev =>[project, ...prev.filter(prj=>prj.id != project.id)])
                    }}/>
                ))}
            </div>

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

            {/* Lists projects for both volunteer or organizations*/}
            <>{renderContent()}</>
           
        </div>
    </>
}


export default Dashboard;