import {  BriefcaseIcon, ClockIcon, ShieldIcon, StarIcon } from "../components/icons"
import React, { useState } from "react";
import UserDashboardInformation from "../components/userDashBoardInfo";
import Dashboard from "../components/dashboard";
import rawProjects from "../data/projects.json" assert {type: 'json'}
import type { MetricProps, ProjectProps } from "../interface/interfaces";
import { FindOpportunity } from "../components/findOpportunities";

export const DashboardPage = ()=>{
    type NavTypes = "Dashboard" | "Find Opportunities"| "My Volunteering"| "Profile & Achievements";
    const [active, setActive] = useState<NavTypes>("Dashboard");
    
    const buttons = new Map<string, string>()
    buttons.set("Dashboard", "Dashboard")
    buttons.set("Find Opportunities", "Find Opportunities")
    buttons.set("My Volunteering", "My Volunteering")
    buttons.set("Profile & Achievements", "Profile & Achievements")

    const projects = rawProjects as ProjectProps[]
    const activateNavButton = (event: React.MouseEvent<HTMLButtonElement>)=>{
        let selectButtonValue = buttons.get(event.currentTarget.textContent);
        setActive(selectButtonValue? selectButtonValue as NavTypes: "Dashboard")
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

    return <>
    <main className="">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UserDashboardInformation activeButton={active} buttons={[...buttons.keys()]} onClick={activateNavButton} username="Daniel"/>
            {active=="Dashboard" &&<Dashboard projects={projects} metrics={metrics}/>}
            {active=="Find Opportunities" && <FindOpportunity projects={projects}/>}
        </div>
    </main>
    </>
}