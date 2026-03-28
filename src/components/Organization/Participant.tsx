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
  Loader2,
  Send,
  Megaphone,
  X
} from 'lucide-react';
import type { ParticipantProps, ProjectProps } from '../../interface/interfaces';
import { Button } from '../ReuseableComponents';
import useAuthFetch from '../hooks/useAuthFetch';

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
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full hover:border-blue-300 transition-colors duration-200">
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
             {volunteer.profileUrl ? (
               <img src={volunteer.profileUrl} alt={volunteer.firstname} className="h-full w-full object-cover" />
             ) : (
               <User className="text-gray-400" size={24} />
             )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">
              {`${volunteer.firstname} ${volunteer.middleName ? volunteer.middleName + ' ' : ''}${volunteer.lastname}`}
            </h3>
            <div className="flex items-center text-sm text-gray-500 gap-3">
              <span className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {volunteer.location?.lga || "Remote"}
              </span>
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                Joined {volunteer?.createdAt &&formatDate(volunteer?.createdAt)}
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
        </div>
      </div>

      {/* Skills Tags */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Volunteer Expertise</p>
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


/**
 * ProjectGroupHeader Component
 * Displays the shared project information for a group of participants.
 */
export const ProjectGroupHeader:React.FC<{project:ProjectProps, count:number, onComplete:(project: ProjectProps)=>Promise<void>}> = ({ project, count, onComplete }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success'

  const {API} = useAuthFetch('organization')

  const handleBroadcast = async () => {
    if (!message.trim()) return;

    setStatus('sending');
    try {
      // Logic for your backend call goes here:
      // await api.sendBroadcast(project.id, message);
      
      await API().post("/projects/broadcast", {
        projectId: project.id,
        message
      })
      
      setStatus('success');

      setTimeout(() => {
        setIsBroadcasting(false);
        setMessage("");
        setStatus('idle');
      }, 500);

    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col mb-4 mt-8 first:mt-0 bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-sm overflow-hidden">

      {/* Main Header Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-8 first:mt-0 p-4 bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={18} className="text-indigo-500" />
            <h2 className="text-lg font-extrabold text-gray-900">{project?.title}</h2>
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md">
              {count} {count === 1 ? 'PARTICIPANT' : 'PARTICIPANTS'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {project.location?.lga || "Remote"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {new Date(project?.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {project.attendanceHours?.from} - {project.attendanceHours?.to}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 w-full">
          <button 
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isBroadcasting 
                ? 'bg-gray-100 text-gray-600' 
                : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isBroadcasting ? (
              <><X size={16} /> Close</>
            ) : (
              <><Megaphone size={16} /> Broadcast</>
            )}
          </button>

          {
              project.status == "COMPLETED"? <Button
              variant='disabled' 
              className='w-auto'
              >
              <CheckCircle size={32} className="mr-2" />
            </Button>:<Button
              variant='primary' 
              className='w-auto'
              onClick={()=>onComplete(project)}
            >
              <CheckCircle size={32} className="mr-2" />
            </Button>
            }
        </div>
      </div>

      {/* Broadcast Input Area */}
      {isBroadcasting && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Message to all participants
              </label>
              {status === 'success' && (
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  MESSAGE SENT SUCCESSFULLY
                </span>
              )}
            </div>
            
            <textarea
              autoFocus
              className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none shadow-inner"
              placeholder="Type your message here... (e.g. Schedule update for tomorrow)"
              rows={3}
              value={message}
              disabled={status !== 'idle'}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex justify-end items-center gap-3">
              <button
                disabled={(!message.trim() || status !== 'idle') && project.broadcastEnabled}
                onClick={handleBroadcast}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-black rounded-lg transition-all shadow-md shadow-indigo-200 active:scale-95"
              >
                {status === 'sending' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {status === 'sending' ? 'SENDING...' : 'SEND BROADCAST'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};