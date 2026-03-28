import { useEffect, useMemo, useState } from "react"
import type { ParticipantProps,  ParticipationStatus,  ProjectProps, VolunteerApplicationProps } from "../../interface/interfaces"
import { useConfirmAsk } from "../hooks/useConfirm"
import { Button } from "../ReuseableComponents"
import useAuthFetch from "../hooks/useAuthFetch"
import { ParticipantCard, ProjectGroupHeader } from "./Participant"
import { PageLoader } from "../icons"
import {  Filter, Inbox, Search, Users } from "lucide-react"

interface GroupedData {
    [projectId: number]: {
    project: ProjectProps;
    members: ParticipantProps[];
  };
}
const VolunteerCard:React.FC<{applicant:VolunteerApplicationProps, onApprove: (applicant:VolunteerApplicationProps, perm:boolean)=>void, onDecline: (applicant:VolunteerApplicationProps, perm:boolean)=>void}> = ({applicant, onApprove, onDecline})=>{
    const {confirmAsk, ConfirmDialog} = useConfirmAsk({})
    
    const date = new Date(applicant.projectApplied.appliedAt)
    const months = ["Jan", "Feb", "March", "Apr", "May","June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    
    const approve = async ()=>{
        let response = await confirmAsk({
            question: "Are you sure you want to approve this applicant?",
            trueAnswer: "Approve",
            falseAnswer: "Cancel"
        })
        
        onApprove(applicant, response)
    }

    const decline = async ()=>{
        let response = await confirmAsk({
            question: "Are you sure you want to decline this applicant?",
            trueAnswer: "Decline",
            falseAnswer: "Cancel"
        })
        
        onDecline(applicant, response)
    }
    return <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full ">
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col pr-4"> 
                <h3 className="text-xl font-bold text-gray-900 mb-1">{`${applicant.firstname} ${applicant.lastname}`}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Appplied for: {applicant.projectApplied?.title}
                </p>
            </div>

            <div className="flex-shrink-0 flex space-x-2"> 
                <span className="text-sm text-gray-600 leading-relaxed">
                    Applied {`${months[date.getMonth()-1]} ${date.getDay()}, ${date.getFullYear()}`}
                </span>
            </div>
        </div>

        <div className="text-sm text-gray-700 space-y-2 mb-4">
            <span className="font-semibold">Skills & Interests </span> 
            <div className="flex space-x-2">
                {applicant.skills?.map((category)=><span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">{category}</span>)}
            </div>
        </div>

        <div className="flex gap-x-2">
            <Button variant="primary" onClick={approve}>Approve</Button>
            <Button variant="outline" onClick={decline}> Decline</Button>
            {/* <Button variant="outline">View Profile</Button> */}
        </div>
        <ConfirmDialog/>
        
    </div>
}

export const ApplicationHub = ()=>{
    const [applicants, setApplications] = useState<VolunteerApplicationProps[]>()
    const {API} = useAuthFetch("organization")
    const [isLoading, setIsLoading] = useState(false)
    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:true})

    // Fetch list of applications when mounted
    useEffect(()=>{
        API().get("/projects/applicants")
        .then((response)=>{
            setApplications(response.data as VolunteerApplicationProps[])
        })
        fetchParticipants()
    }, [])

    const removeApplicantFromList = (applicant: VolunteerApplicationProps)=>{
        setApplications(applicants?.filter(appl=>appl.projectApplied.id != applicant.projectApplied.id))
    }
    const onApprove = (applicant: VolunteerApplicationProps, perm:boolean)=>{
        // Make request to backend server to update application 
        if(!perm)return;

        API().patch(`/projects/application/${applicant.projectApplied.id}/accept`, null)
        .then(()=>{
            removeApplicantFromList(applicant)
        })
        
    }

    const onDecline = (applicant: VolunteerApplicationProps, perm:boolean)=>{
        // Make request to backend server to update application 
        if(!perm)return;
        API().patch(`/projects/application/${applicant.projectApplied.id}/reject`, null)
        .then(()=>{
            removeApplicantFromList(applicant)
        })
        
    }


    // Mock
    const [participants, setParticipants] = useState<ParticipantProps[]>([])

    // Group participants by project ID
    const groupedParticipants = useMemo<GroupedData>(() => {
        return participants.reduce((acc: GroupedData, curr:ParticipantProps) => {
        const projectId = curr.project.id;
        if (!acc[projectId]) {
            acc[projectId] = {
            project: curr.project,
            members: []
            };
        }
        acc[projectId].members.push(curr);
        return acc;
        }, {});
    }, [participants]);

    
   

    const fetchParticipants = async ()=>{
        try{
            let participants = await API().get("/projects/participants") 
            setParticipants(participants.data as ParticipantProps[])
        }catch{
            
        }
    }

    const updatestatus = async (participant:ParticipantProps, status: ParticipationStatus)=>{
        let response = await confirmAsk({
            question: `Are you sure you want to mark pariticipant as ${status == "REJECTED"? 'rejected': 'completed'}. This cannot be undone`,
            falseAnswer: "Cancel",
            trueAnswer: "Confirm"
        })
        if(!participant.reviewable && status == "COMPLETED")
            return

        try{
            setIsLoading(true)
           if(response){
             await API().patch("/projects/participant", {
                id:participant.id,
                status
            })
           }
        }finally{
            setIsLoading(false)
        }
    }

    const markProjectCompleted = async (project: ProjectProps)=>{
        let response = await confirmAsk({
            question: `Are you sure you want to close this project? Project will be marked completed`, 
            falseAnswer: "Cancel", 
            trueAnswer: "Proceed"
        })
        project.status = "COMPLETED"

        if(response){
            await API().patch(`/projects/${project.id}`, {...project})
        }
    }

    return <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
        {isLoading && <PageLoader/>}
        <ConfirmDialog/>
        {/* 1. Dashboard Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Application Management Hub</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200">
                <Search size={16} className="text-gray-400 mr-2" />
                <input type="text" placeholder="Search volunteers..." className="bg-transparent border-none text-sm focus:ring-0 w-48" />
             </div>
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Filter size={20}/></button>
          </div>
        </div>
      </div>

      <main>
        {/* 2. Pending Applications Section (The Inbox Style) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox size={20} className="text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">New Applications</h2>
              <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-0.5 rounded-full">
                {applicants?.length || 0}
              </span>
            </div>
            {/* <button className="text-sm font-bold text-green-700 hover:underline">View All</button> */}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-1">
                {(applicants && applicants.length > 0) ? (
                  <div className="grid grid-cols-1 divide-y divide-gray-100">
                    {applicants?.map((applicant: any, index: number) => (
                      <VolunteerCard applicant={{...applicant}} key={index} onApprove={onApprove} onDecline={onDecline}/>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                    <Inbox size={40} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">Your inbox is clear! No pending applications.</p>
                  </div>
                )}
             </div>
          </div>
        </section>

        {/* 3. Active Participants Section */}
        <section className="flex flex-col gap-2 mb-6">
            <div >
                <div>
                    <Users size={20} className="text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Project Participants</h2>
                </div>
                <div >
                {Object.values(groupedParticipants).length > 0 ? (
                    Object.values(groupedParticipants).map(({ project, members }) => (
                        <div key={project.id} className="mb-14">
                        <ProjectGroupHeader project={project} count={members.length}  onComplete={markProjectCompleted}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {members.map((member:ParticipantProps) => (
                            <ParticipantCard 
                                key={member.id} 
                                participant={member}
                                onComplete={() =>{ 
                                    updatestatus(member, "COMPLETED")
                                }
                                    
                                }
                                onReject={() => {
                                    updatestatus(member, "REJECTED")
                                }}
                            />
                            ))}
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No participants found.</p>
                    </div>
                    )}
            </div>
            </div>
        </section>

      </main>
</div>
}

