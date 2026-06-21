import { useState } from "react";
import type { MyVolunteeringProps, ProjectProps } from "../interface/interfaces";
import { Button } from "./ReuseableComponents";
import { PageLoader } from "./icons";
import { ChatNavItem } from "./ChatNavItem";
import { useSocketConnection } from "./Chat/socketConnection";


interface ProjectCardProps {
  volunteered: MyVolunteeringProps;
  onCancelClick: (project: MyVolunteeringProps) => void;
  onViewDetailsClick: (project: MyVolunteeringProps) => void;
  onRateSubmit: (volunteered: MyVolunteeringProps, rating:number)=>Promise<void>;
  onChatOpen: (project:ProjectProps)=>void;
  href?: string;
}


/**
 * Icons
 */
const MapMarkerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const StarIcon = ({ 
  filled, 
  onClick, 
  onMouseEnter, 
  onMouseLeave,
  className = "" 
}: { 
  filled: boolean; 
  onClick?: () => void; 
  onMouseEnter?: () => void; 
  onMouseLeave?: () => void;
  className?: string;
}) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`${className} cursor-pointer transition-colors ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
export default function VolunteeringProjectCard({volunteered, onCancelClick, onViewDetailsClick, onRateSubmit, onChatOpen}: ProjectCardProps) {

  const [isRatingMode, setIsRatingMode] = useState(false);
  const [currentRating, setCurrentRating] = useState<number>(volunteered.project?.rating|| 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [persistedRating, setPersistedRating] = useState<number | null>(volunteered.project?.rating || null);
  const [isLoading, setIsLoading] = useState(false)
  
  const unreadCount = useSocketConnection()?.unreadCount?.get(volunteered.project.id)

  const handleRatingSubmit = async () => {
    setPersistedRating(currentRating);
    
    if (onRateSubmit) {
      try{
        setIsLoading(true)
        await onRateSubmit(volunteered, currentRating);
      }finally{
        setIsLoading(false)
        setIsRatingMode(false);
      }
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {isLoading&&<PageLoader color="blue" message={"Rating"} />}
      <div className="flex justify-between items-start">
  <div className="flex-1">
    <h2 className="text-lg font-semibold text-[#323338] leading-tight">
      {volunteered.project?.title}
    </h2>
    <p className="text-[#676879] text-sm mt-0.5">{volunteered.organization?.name}</p>
  </div>

  <div className="flex items-center gap-2">
      {persistedRating && (
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
          <span className="text-xs font-bold text-yellow-700">{persistedRating}</span>
          <StarIcon filled className="w-3 h-3" />
        </div>
      )}
      {volunteered.status === "IN_PROGRESS" && (
        <Button
          variant="void"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold 
            transition-all duration-200"
          onClick={() => onChatOpen(volunteered.project)}
        >
          <ChatNavItem unreadCount={unreadCount}/>
        </Button>
      )}
    </div>
  </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="text-gray-500 text-xs flex items-center gap-1">
          <MapMarkerIcon />
          <span>
            {volunteered.project?.address 
              ? `${volunteered.project.address}` 
              : volunteered.project.location.state}
          </span>
        </div>
        <div className="text-gray-500 text-xs flex items-center gap-1">
          <MapMarkerIcon />
          <span>
            {volunteered.project?.location 
              ? `${volunteered.project.location.lga}, ${volunteered.project.location.state}` 
              : "Remote"}
          </span>
        </div>
        <div className="text-gray-400 text-xs flex items-center gap-1">
          <CalendarIcon />
          <span>{volunteered.project?.startDate}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        {volunteered.status === "IN_PROGRESS" ? (
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => onViewDetailsClick(volunteered)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              variant="danger"
              onClick={() => onCancelClick(volunteered)}
              className="text-[#D83A52]"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="transition-all duration-300">
            {!isRatingMode ? (
              <div className="flex justify-between items-center gap-4">
                <p className="text-xs text-gray-400 italic">
                  {persistedRating ? "Feedback received" : "Project ended. How was it?"}
                </p>
                <Button 
                  variant={persistedRating ? "outline" : "primary"}
                  onClick={() => setIsRatingMode(true)}
                  className="py-1.5 px-6"
                >
                  {persistedRating ? "Change Rating" : "Rate Project"}
                </Button>
              </div>
            ) : (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-blue-700 mb-2">Select your rating</span>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className="w-7 h-7"
                        filled={hoverRating ? star <= hoverRating : star <= currentRating}
                        onClick={() => setCurrentRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs bg-white" 
                      onClick={() => setIsRatingMode(false)}
                    >
                      Dismiss
                    </Button>
                    <Button 
                      variant={currentRating ===0?`disabled`: "primary"} 
                      className="flex-1 text-xs" 
                      onClick={handleRatingSubmit}
                    >
                      Save Rating
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>  );
}
