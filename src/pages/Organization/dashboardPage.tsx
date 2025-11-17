import { ClockIcon, GroupIcon, StarIcon, VerifiedIcon } from "../../components/icons"
import React, { useEffect, useState } from "react";
import UserDashboardInformation from "../../components/Volunteer/userDashBoardInfo";
import Dashboard from "../../components/Volunteer/dashboard";

import type { MetricProps, OrganizationDashboardProps, OrganizationNavTypes, OrganizationQuickActions, ProjectProps } from "../../interface/interfaces";
import { ProjectHub } from "../../components/Volunteer/projectHub";
import { DashboardHeader } from "../../components/dashboardHeader";

import { ApplicationHub } from "../../components/Organization/applicationHub";
import useAuthFetch from "../../components/hooks/useAuthFetch";


export const DashboardPage = () => {

    const [active, setActive] = useState<OrganizationNavTypes>("Dashboard");
   
    const [dashboard, setDashboard] = useState<OrganizationDashboardProps>({
        name: "", 
        projects: []
    });
    
    const [metrics, _] = useState<MetricProps[]>([
        {
            title: "Active Projects",
            context: "+12 hours this month",
            icon: <ClockIcon color="#34A853" />,
            value: "5",
            color: "#34A853"
        },
        {
            title: "Total Volunteers",
            context: "+2 this month",
            icon: <GroupIcon color="#1A73E8" />,
            value: "84",
            color: "#1A73E8"
        },
        {
            title: "Average Rating",
            context: "0.0 rating from organizations",
            icon: <StarIcon color="#FBBC05" fill="none" />,
            value: "0",
            color: "#FBBC05"
        },
        {
            title: "Completed Projects",
            context: "8 completed this month",
            icon: <VerifiedIcon color="#B86705" />,
            value: "4",
            color: "#B86705"
        }
    ])
    const {API} = useAuthFetch("organization")

    const buttons = new Map<string, string>()
    buttons.set("Dashboard", "Dashboard")
    buttons.set("Project Management", "Project Management")
    buttons.set("Applications", "Applications")
    buttons.set("Analytics", "Analytics")


    // Makes requests with automatic refresh logic when access token expires
    // const authFetch = useAuth()


    // const projects = rawProjects as ProjectProps[]
    const activateNavButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        let selectButtonValue = buttons.get(event.currentTarget.textContent);
        setActive(selectButtonValue ? selectButtonValue as OrganizationNavTypes : "Dashboard")
    }



    const fetchProjects = async (): Promise<ProjectProps[]> => {
        API().get("/projects")
        .then((response)=>{
            return response.data as ProjectProps[]
        }) 
        return []
    }


    const fetchOrganizationDashboard = async ()=>{
        API().get("/dashboard")
        .then((response)=>{
            return setDashboard(response.data)
        })
        return null
    }
    const quickAction = (action: OrganizationQuickActions) => {
        switch (action) {
            case "Create New Project":
                setActive("Project Management" as OrganizationNavTypes)
                break;
            case "Review pending applications":
                setActive("Applications")
                break;
            case "View Analytics":
                setActive("Analytics")
                break;
        }
    }



    useEffect(() => {
        (async () => {
            await fetchOrganizationDashboard()
            
        })()
    }, [])



    return <>
        <main className="">
            <DashboardHeader isOrganization={true} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-15">
                <UserDashboardInformation activeButton={active} buttons={[...buttons.keys()]} onClick={activateNavButton} username={dashboard.name} />
                {active == "Dashboard" && dashboard && <Dashboard projects={dashboard.projects} metrics={metrics} orgTriggerAction={quickAction} />}
                {active == "Project Management" && <ProjectHub projects={dashboard.projects} isOrganization={true}/>}
                {active == "Applications" && <ApplicationHub/>}
            </div>
        </main>
    </>
}