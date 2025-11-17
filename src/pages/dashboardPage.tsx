import {
  BriefcaseIcon,
  ClockIcon,
  ShieldIcon,
  StarIcon,
} from "../components/icons";
import React, { useEffect, useState } from "react";
import UserDashboardInformation from "../components/userDashBoardInfo";
import Dashboard from "../components/dashboard";
import MyVolunteering from "../components/MyVolunteering";
import Profile from "../components/Profile";

import type {
  MetricProps,
  NavTypes,
  ProjectProps,
  VolunteerQuickActions, VolunteerDashboardProps,
} from "../interface/interfaces";
import { FindOpportunity } from "../components/findOpportunities";
import { DashboardHeader } from "../components/dashboardHeader";
import { useAuth } from "../components/hooks/useAuth";

export const DashboardPage = ()=>{
    
    const [active, setActive] = useState<NavTypes>("Dashboard");
    const [volunteerDashboard, setVolunteerDashboard] = useState<VolunteerDashboardProps>({
        firstname:"",
        projectApplications: []
    });
    const [projects, setProjects] = useState<ProjectProps[]>([])
    const [metrics, setMetrics] = useState<MetricProps[]>( [
        {
            title: "Projects Applied",
            context: "+12 hours this month",
            icon: <ClockIcon/>,
            value:"124",
            color: "#1A73E8"
        },
         {
            title: "Approved Projects",
            context: "+2 this month",
            icon: <BriefcaseIcon/>,
            value:"8",
            color: "#34A853"
        },
        {
        title: "Badges Earned",
        context: "0 badges earned",
        icon: <ShieldIcon fill="none" color="#FBBC05" />,
        value:"0",
        color: "#FBBC05"
    },
        {
        title: "Rating",
        context: "0.0 rating from organizations",
        icon: <StarIcon color="#237238" fill="none"/>,
        value:"0",
        color: "#34A853"
    }
    ])


    const buttons = new Map<string, string>()
    buttons.set("Dashboard", "Dashboard")
    buttons.set("Find Opportunities", "Find Opportunities")
    buttons.set("My Volunteering", "My Volunteering")
    buttons.set("Profile & Achievements", "Profile & Achievements")


    // Makes requests with automatic refresh logic when access token expires
    const authFetch = useAuth()


  // const projects = rawProjects as ProjectProps[]
  const activateNavButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    let selectButtonValue = buttons.get(event.currentTarget.textContent);
    setActive(
      selectButtonValue ? (selectButtonValue as NavTypes) : "Dashboard"
    );
  };
  const fetchProjects = async (): Promise<ProjectProps[]> => {
    try {
      const response = await fetch("/data/projects.json", {
        headers: {
          "content-Type": "application/json",
          "cache-control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      return data as ProjectProps[];
    } catch (error) {
      console.error("Error loading data");
      return [];
    }
  };


    const quickAction = (action:VolunteerQuickActions)=>{
        switch(action){
            case "Find Opportunities":
                setActive(action as NavTypes)
                break;
            
        }
    }

    const loadUserProfile = async (): Promise<VolunteerDashboardProps | null>=>{
        const baseUrl = import.meta.env.VITE_API_BASE_VOLUNTEER_URL
        let response = await authFetch?.authFetch(`${baseUrl}/dashboard`, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response?.ok)
            return await response.json() as VolunteerDashboardProps   
        else
            return null
    }

    
    useEffect(()=>{
       (async ()=>{
        const data = await loadUserProfile()
        if(data)
            setVolunteerDashboard(data)
       })()
    }, [])

    useEffect(()=>{

        if(!volunteerDashboard.projectApplications) return;

        const applications = volunteerDashboard.projectApplications;
        const approvedApplicatins = applications.filter((app)=> app.status === "APPROVED");

        const totalApplied = applications.length;
        const approvedThisMonth = approvedApplicatins.filter((app)=>{
            const appliedDate = new Date(app.appliedAt)
            const now = new Date();

            return (
                appliedDate.getMonth() == now.getMonth() &&
                appliedDate.getFullYear() === now.getFullYear()
            )
        }).length

        setMetrics((prev)=>prev.map((metric)=>{
            if(metric.title === "Projects Applied"){
            return {
                ...metric,
                value: totalApplied.toString(),
                context: `${approvedThisMonth} approved this month`,
            }
           }

           if(metric.title == "Approved Projects"){
            return {
                ...metric,
                value: approvedApplicatins.length.toString(),
                context: `${approvedThisMonth} this month`
            }
           }
           return metric
        }))
    }, [volunteerDashboard])

    
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
            <UserDashboardInformation activeButton={active} buttons={[...buttons.keys()]} onClick={activateNavButton} username={volunteerDashboard?.firstname}/>
            {active=="Dashboard" &&projects&& <Dashboard projects={projects} metrics={metrics} triggerAction={quickAction}/>}
            {active=="Find Opportunities" && <FindOpportunity projects={projects}/>}
        </div>
      </main>
    </>
};
