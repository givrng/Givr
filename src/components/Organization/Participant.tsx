import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  Layers,
  Info,
 
} from 'lucide-react';
import type { ParticipantProps, ParticipationStatus, ProjectProps } from '../../interface/interfaces';
import { Button } from '../ReuseableComponents';
import useMessageThread from '../Chat/MessageThread';
import { ChatNavItem } from '../ChatNavItem';
import { useSocketConnection } from '../Chat/socketConnection';

export interface ParticipantCardComponentProps{
    participant: ParticipantProps;
    onComplete: (id:number)=>void;
    onReject: (id:number)=>void;
}
/**
 * ParticipantCard Component
 * * Handles display and actions for project participants including:
 * - Volunteer details (Name, skills, profile link)
 * - Project context (Title, dates, location)
 * - Status indicators (IN_PROGRESS, COMPLETED, REJECTED)
 * - Management actions (Mark Complete, Reject)
 */

export const ParticipantCard: React.FC<ParticipantCardComponentProps> = ({ participant, onComplete, onReject }) => {
  const { volunteer, project, status } = participant;

  // Status Badge Configuration
  const statusConfig = {
    IN_PROGRESS: {
      label: 'In Progress',
      classes: 'bg-green-50 text-green-700 border-green-200',
      icon: <Clock size={14} className="mr-1" />
    },
    COMPLETED: {
      label: 'Completed',
      classes: 'bg-green-50 text-green-700 border-green-200',
      icon: <CheckCircle size={14} className="mr-1" />
    },
    REJECTED: {
      label: 'Rejected',
      classes: 'bg-red-50 text-red-700 border-red-200',
      icon: <XCircle size={14} className="mr-1" />
    }
  };

  const currentStatus = statusConfig[status];

  // Utility to format date strings
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const isReviewable = (endDate: string): { daysRemaining: number } => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Can review if we are within 7 days of completion or already past it
        return {
            daysRemaining: diffDays
        };
    };
    const {daysRemaining} = isReviewable(project.endDate)

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full hover:border-green-300 transition-colors duration-200">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-5">
        <div className="flex gap-4 min-w-0">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
             {volunteer.profileUrl ? (
               <img src={volunteer.profileUrl} alt={volunteer.firstname} className="h-full w-full object-cover" />
             ) : (
               <User className="text-gray-400" size={24} />
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-xl font-bold text-gray-900 leading-none mb-1 break-words">
              {`${volunteer.firstname} ${volunteer.middleName ? volunteer.middleName + ' ' : ''}${volunteer.lastname}`}
            </h3>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3">
              <span className="flex items-center">
                <MapPin size={14} className="mr-1 shrink-0" />
                <span className="truncate">{volunteer.location?.state || ""}</span>
              </span>
              <span className="flex items-center">
                <Calendar size={14} className="mr-1 shrink-0" />
                <span className="truncate">Joined {volunteer?.createdAt &&formatDate(volunteer?.createdAt)}</span>
              </span>

            </div>
          </div>
        </div>

        <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-medium ${currentStatus.classes}`}>
          {currentStatus.icon}
          {currentStatus.label}
        </div>
      </div>

      {/* Project Context Area */}
      <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Project</p>
        <h4 className="text-md font-semibold text-gray-800 mb-1">{project.title}</h4>
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-600">
           <div className="flex items-center">
              <span className="font-medium mr-1 text-gray-700">Schedule:</span> 
              {project.attendanceHours?.from} - {project.attendanceHours?.to}
           </div>
           <div className="flex items-center">
              <span className="font-medium mr-1 text-gray-700">Duration:</span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
           </div>
           <div className="flex items-center">
              <span className="font-medium mr-1 text-gray-700">Reason for joining:</span>
              {participant.reason}
           </div>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Volunteer Skills</p>
        <div className="flex flex-wrap gap-2">
          {volunteer.skills?.slice(0, 4).map((skill, index) => (
            <span 
              key={index} 
              className="text-xs px-2.5 py-1 bg-white border border-gray-300 rounded-md text-gray-600 shadow-sm"
            >
              {skill}
            </span>
          ))}
          {volunteer.skills?.length > 4 && (
            <span className="text-xs px-2.5 py-1 text-gray-400 font-medium">
              +{volunteer.skills?.length - 4} more
            </span>
          )}
        </div>
      </div>
      {/* Review Logic Message */}
      {status === 'IN_PROGRESS' && (
        <div className={`mt-auto mb-4 p-2 rounded-lg flex items-start gap-2 text-[11px] ${participant?.reviewable ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
          {participant?.reviewable ? <Info size={14} className="shrink-0" /> : <Clock size={14} className="shrink-0" />}
          <p>
            {participant?.reviewable 
              ? "This participant is now eligible for completion review." 
              : `Review becomes available ${daysRemaining} days before project ends (${new Date(project.endDate).toLocaleDateString()}).`
            }
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-x-2">
          {status === 'IN_PROGRESS' && (
            <>
              {
                participant.reviewable? <Button
                variant='green' 
                onClick={() => onComplete(participant.id)}

              >
                <CheckCircle size={16} className="mr-2" />
                Mark Completed
              </Button>:
              <Button
                variant='disabled' 
                onClick={() => onComplete(participant.id)}
              >
                <CheckCircle size={16} className="mr-2" />
                Mark Completed
              </Button>
              }
              <button 
                onClick={() => onReject(participant.id)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 text-sm font-semibold rounded-lg transition-all"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </button>
            </>
          )}
          
          {(status === 'COMPLETED' || status === 'REJECTED') && (
             <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed">
               Action Finalized
             </button>
          )}
        </div>

      </div>
    </div>
  );
};

// ProjectGroupHeader props interface
interface ProjectGroupHeaderProps{
  project:ProjectProps, 
  members:ParticipantProps[], 
  onComplete:(project: ProjectProps)=>Promise<void>, 
  updatestatus: (participant:ParticipantProps, status: ParticipationStatus)=>Promise<void>
}

/**
 * ProjectGroupHeader Component
 * Displays the shared project information for a group of participants.
 */
export const ProjectGroupHeader:React.FC<ProjectGroupHeaderProps> = ({ project, members, onComplete, updatestatus }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  let count = members.length
  const {openGroupMessage, GroupMessageComp} = useMessageThread()

  const unreadCount = useSocketConnection()?.unreadCount?.get(project.id)
  return (
    <div className="flex flex-col h-svh mb-4 mt-8 first:mt-0 bg-white border-l-4 border-green-500 rounded-r-xl shadow-sm overflow-hidden">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-8 first:mt-0 px-5 py-4 bg-white border-l-4 border-emerald-500 rounded-r-xl shadow-sm">

        {/* Left — project info */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Layers size={15} className="text-emerald-500 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
              {project?.title}
            </h2>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-widest rounded-md border border-emerald-100">
              {count} {count === 1 ? 'PARTICIPANT' : 'PARTICIPANTS'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              {project.location.state}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={12} className="text-slate-400" />
              {new Date(project?.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={12} className="text-slate-400" />
              {project.attendanceHours?.from} – {project.attendanceHours?.to}
            </span>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Chat toggle */}
          {!isBroadcasting && <button
            onClick={() => {
              setIsBroadcasting(true)
              
              openGroupMessage(project, "organization", ()=>setIsBroadcasting(false))
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              isBroadcasting
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                : ''
            }`}
          >
             <><ChatNavItem unreadCount={unreadCount}/></>
          </button>}

          {/* Complete button */}
          {project.status === 'COMPLETED' ? (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed select-none">
              <CheckCircle size={15} />
              Completed
            </div>
          ) : (
            <button
              onClick={() => onComplete(project)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
            >
              <CheckCircle size={15} />
              Complete
            </button>
          )}

        </div>
      </div>

      {/* Broadcast Input Area */}
      {isBroadcasting && <GroupMessageComp/>}

      {
        !isBroadcasting && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-2">
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
      }
       
</div>
  );
};