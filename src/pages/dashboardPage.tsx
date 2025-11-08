import {  BriefcaseIcon, ClockIcon, ShieldIcon, StarIcon } from "../components/icons"
import React, { useEffect, useState } from "react";
import UserDashboardInformation from "../components/userDashBoardInfo";
import Dashboard from "../components/dashboard";

import type { MetricProps, NavTypes, ProjectProps, QuickActions } from "../interface/interfaces";
import { FindOpportunity } from "../components/findOpportunities";
import { DashboardHeader } from "../components/dashboardHeader";

export const DashboardPage = ()=>{
    
    const [active, setActive] = useState<NavTypes>("Dashboard");
    const [projects, setProjects] = useState<ProjectProps[]>([])
    const buttons = new Map<string, string>()
    buttons.set("Dashboard", "Dashboard")
    buttons.set("Find Opportunities", "Find Opportunities")
    buttons.set("My Volunteering", "My Volunteering")
    buttons.set("Profile & Achievements", "Profile & Achievements")

    // const projects = rawProjects as ProjectProps[]
    const activateNavButton = (event: React.MouseEvent<HTMLButtonElement>)=>{
        let selectButtonValue = buttons.get(event.currentTarget.textContent);
        setActive(selectButtonValue? selectButtonValue as NavTypes: "Dashboard")
    }
    const fetchProjects = async(): Promise<ProjectProps[]>=>{
        try{

            const response = await fetch("/data/projects.json", {
            headers:{
                "content-Type":"application/json",
                "cache-control":"no-cache"
            }
        })

            if(!response.ok){
                throw new Error("Failed to fetch projects")
            }

            const data = await response.json()
            console.log(data)
            return data as ProjectProps[]
        }catch(error){
            console.error("Error loading data")
            return []
        }
    }

    const metrics: MetricProps[] = [
        {
            title: "Hours Logged",
            context: "+12 hours this month",
            icon: <ClockIcon/>,
            value:"124",
            
        },
         {
            title: "Projects completed",
            context: "+2 this month",
            icon: <BriefcaseIcon/>,
            value:"8"
        },
         {
            title: "Badges Earned",
            context: "One more project for your next batch",
            icon: <ShieldIcon fill="none" color="#FBBC05" />,
            value:"5"
        },
         {
            title: "Rating",
            context: "From 8 Organizations",
            icon: <StarIcon color="#237238" fill="none"/>,
            value:"4.8"
        }
    ]

    const quickAction = (action:QuickActions)=>{
        switch(action){
            case "Find Opportunities":
                setActive(action as NavTypes)
                break;
            
        }
    }

    
    useEffect(()=>{
       (async ()=>{
        const data = await fetchProjects()
        setProjects(data)
       })()
    }, [])

    return <>
    <main className="">
        <DashboardHeader/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-15">
            <UserDashboardInformation activeButton={active} buttons={[...buttons.keys()]} onClick={activateNavButton} username="Daniel"/>
            {active=="Dashboard" &&projects&& <Dashboard projects={projects} metrics={metrics} triggerAction={quickAction}/>}
            {active=="Find Opportunities" && <FindOpportunity projects={projects}/>}
        </div>
    </main>
    </>
}