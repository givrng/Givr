import { useEffect, useMemo, useState } from "react"
import type { ParticipantProps,  ParticipationStatus,  ProjectProps, VolunteerApplicationProps } from "../../interface/interfaces"
import { useConfirmAsk } from "../hooks/useConfirm"
import { Button } from "../ReuseableComponents"
import useAuthFetch from "../hooks/useAuthFetch"
import {  ProjectGroupHeader } from "./Participant"
import { PageLoader } from "../icons"
import {  Filter, Inbox, Search, Users } from "lucide-react"
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  User, 
  Briefcase,
  FileText,
  Clock
} from 'lucide-react';
import { parseZonedDateTime } from "../hooks/ParseDate"

interface GroupedData {
    [projectId: number]: {
    project: ProjectProps;
    members: ParticipantProps[];
  };
}

/**
 * Enhanced Volunteer Card Component
 * Features:
 * - Professional layout with profile image placeholder
 * - Expandable "View More" section for deep-dive info
 * - Clear action buttons
 * - Responsive design with Tailwind CSS
 */

const VolunteerCard:React.FC<{applicant:VolunteerApplicationProps, onApprove: (applicant:VolunteerApplicationProps, perm:boolean)=>void, onDecline: (applicant:VolunteerApplicationProps, perm:boolean)=>void}> = ({ applicant, onApprove, onDecline }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Custom hooks mock (as referenced in your snippet)
  // Assuming these are provided by your environment or custom library
  const { confirmAsk, ConfirmDialog } = useConfirmAsk({});

  const formattedDate = parseZonedDateTime(applicant.projectApplied.appliedAt)
  const handleApprove = async () => {
    let response = await confirmAsk({
            question: "Are you sure you want to approve this applicant?",
            trueAnswer: "Approve",
            falseAnswer: "Cancel"
        })
    if(response)
        onApprove(applicant, true);
  };

  const handleDecline = async () => {
    let response = await confirmAsk({
            question: "Are you sure you want to decline this applicant?",
            trueAnswer: "Decline",
            falseAnswer: "Cancel"
        })

    if(response)
        onDecline(applicant, true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md w-full">
      <div className="p-6">
        {/* Header Section: Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              {applicant.profileUrl ? (
                <img 
                  src={applicant.profileUrl} 
                  alt={applicant.firstname} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User size={28} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {applicant.firstname} {applicant.lastname}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Briefcase size={14} />
                <span>Applying for: <span className="font-medium text-gray-700">{applicant.projectApplied?.title}</span></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg self-start md:self-center border border-gray-100">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Applied {formattedDate}
            </span>
          </div>
        </div>

        {/* Core Reason Preview */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed italic text-sm border-l-4 border-blue-200 pl-4 py-1">
            "{applicant.reason}"
          </p>
        </div>

        {/* Skills Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {applicant.specialSkills?.map((skill, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wide border border-indigo-100"
              >
                {skill}
              </span>
            ))}
            {applicant.isAvailable && (
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-md uppercase tracking-wide border border-green-100">
                Immediate Start
              </span>
            )}
          </div>
        </div>

        {/* Expanded Content Section */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* About Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FileText size={14} /> About Volunteer
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                {applicant.aboutVolunteer || "No detailed bio provided."}
              </p>
            </div>
            

            {/* Special Skills / Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(applicant.specialSkills) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Proficiencies</h4>
                  <p className="text-sm text-gray-600">Applicant Skills: {applicant.skills.join(", ").toLocaleLowerCase()}</p>
                </div>
              )}

              {(applicant.specialSkills) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Proficiencies</h4>
                  <p className="text-sm text-gray-600">Additional Skills: {applicant.specialSkills.join(", ").toLocaleLowerCase()}</p>
                </div>
              )}
              {applicant.additionalInfo && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Context</h4>
                  <p className="text-sm text-gray-600">{applicant.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors py-2"
          >
            {isExpanded ? (
              <>Hide Details <ChevronUp size={18} /></>
            ) : (
              <>View Full Application <ChevronDown size={18} /></>
            )}
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
                variant="outline"
              onClick={handleDecline}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
            >
              <XCircle size={18} className="text-red-500" />
              Decline
            </Button>
            <Button 
            variant="primary"
              onClick={handleApprove}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-sm shadow-blue-200 active:scale-95 transition-all"
            >
              <CheckCircle size={18} />
              Approve
            </Button>
          </div>
        </div>
      </div>
      
      {/* Optional: Status bar or progress line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20"></div>
      <ConfirmDialog/>
    </div>
  );
};

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

    // Group participants by project ID, filtering out COMPLETED projects
    const groupedParticipants = useMemo<GroupedData>(() => {
        return participants
        .filter(p => p.project.status !== 'COMPLETED')
        .reduce((acc: GroupedData, curr:ParticipantProps) => {
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
            question: `Are you sure you want to mark participant as ${status == "REJECTED"? 'rejected': 'completed'}. This cannot be undone`,
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

    return <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
        {isLoading && <PageLoader/>}
        <ConfirmDialog/>
        {/* 1. Dashboard Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Volunteer Management</h1>
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
                    {applicants?.map((applicant: VolunteerApplicationProps, index: number) => (
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
                        <ProjectGroupHeader project={project} members={members}  
                          updatestatus={updatestatus}/>
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