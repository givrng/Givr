import { ClockIcon, GroupIcon, StarIcon, VerifiedIcon } from "../../components/icons"
import React, { useEffect, useMemo, useState } from "react";
import UserDashboardInformation from "../../components/Volunteer/userDashBoardInfo";
import Dashboard from "../../components/Volunteer/dashboard";

import type { MetricProps, OrganizationDashboardProps, OrganizationNavTypes, OrganizationQuickActions } from "../../interface/interfaces";
import { ProjectHub } from "../../components/Volunteer/projectHub";
import { DashboardHeader } from "../../components/dashboardHeader";

import { ApplicationHub } from "../../components/Organization/applicationHub";
import useAuthFetch from "../../components/hooks/useAuthFetch";
import OrganizationProfilePage from "./OrganizationProfilePage";
import { useSocketConnection } from "../../components/Chat/socketConnection";

export const DashboardPage = () => {

    const loadSocketConnection = useSocketConnection()

    const [active, setActive] = useState<OrganizationNavTypes>("Dashboard");
    const [dashboardIsMounted, setDashboardIsMounted] = useState(false);
    const [dashboard, setDashboard] = useState<OrganizationDashboardProps>({
        name: "", 
        projects: {
            
            draftProjects: [],
            openProjects: [],
            ongoingProjects: [],
            completedProjects: []
        },
    
        rating: 0.0,
        applicationStats: {
            numApplied: 0,
            numApproved: 0,
            numRejected:0
        },
        status: "PENDING"

    });
    
    const metrics = useMemo<MetricProps[]>(()=>[
        {
            title: "Active Projects",
            context: `${dashboard.projects.openProjects.length} projects open for applicants`,
            icon: <ClockIcon color="#34A853" />,
            value: `${dashboard.projects.ongoingProjects.length}`,
            color: "#34A853"
        },
        {
            title: "Total Volunteers",
            context: `${dashboard.applicationStats.numApplied} applicants`,
            icon: <GroupIcon color="#1A73E8" />,
            value: `${dashboard.applicationStats.numApproved}`,
            color: "#1A73E8"
        },
        {
            title: "Average Rating",
            context: ` `,
            icon: <StarIcon color="#FBBC05" fill="none" />,
            value: `${dashboard.rating}`,
            color: "#FBBC05"
        },
        {
            title: "Completed Projects",
            context: `${dashboard.projects.draftProjects.length} draft projects`,
            icon: <VerifiedIcon color="#B86705" />,
            value: `${dashboard.projects.completedProjects.length}`,
            color: "#B86705"
        }
    ], [dashboard])

    const {API} = useAuthFetch("organization")
    // const verifyAuth = useVerifyAuth()
    const buttons = new Map<string, string>()
    buttons.set("Dashboard", "Dashboard")
    buttons.set("Project Management", "Project Management")
    buttons.set("Applications", "Applications")
    buttons.set("Profile", "Profile")


    const activateNavButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        let selectButtonValue = buttons.get(event.currentTarget.textContent);
        setActive(selectButtonValue ? selectButtonValue as OrganizationNavTypes : "Dashboard")
    }
    
    const fetchOrganizationDashboard = ()=>{
        API().get("/dashboard")
        .then((response)=>{
            setDashboard(response.data as OrganizationDashboardProps)
        })
        
    }
    const quickAction = (action: OrganizationQuickActions) => {
        switch (action) {
            case "Create New Project":
                setActive("Project Management" as OrganizationNavTypes)
                break;
            case "Review pending applications":
                setActive("Applications")
                break;
            case "Edit Profile":
                setActive("Profile")
                break;
        }
    }

    useEffect(() => {
        (async () => {
            await fetchOrganizationDashboard()  
        })()

        // loadSocketConnection?.setHasMounted(true)
    }, [dashboardIsMounted])

    const notificationCount = loadSocketConnection?.totalCount || 0
    return <>
        <main>
            <DashboardHeader isOrganization={true}/>
            {<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-15 ">
                <UserDashboardInformation notificationCount={notificationCount} activeButton={active} buttons={[...buttons.keys()]} onClick={activateNavButton} username={dashboard.name} isOrganization={true}/>
                {active == "Dashboard" && dashboard && <Dashboard projects={[]} metrics={metrics} orgTriggerAction={quickAction} hasMounted={()=>setDashboardIsMounted(!dashboardIsMounted)} />}
                {active == "Project Management" && <ProjectHub isOrganization={true} orgTriggerAction={quickAction}/>}
                {active == "Applications" && <ApplicationHub/>}
                {active == "Profile" && <OrganizationProfilePage/>}
            </div>}
        </main>
    </>
}