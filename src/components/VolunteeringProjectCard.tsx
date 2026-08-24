import { useState } from "react";
import type { MyVolunteeringProps, ProjectProps } from "../interface/interfaces";
import { Button } from "./ReuseableComponents";
import { PageLoader } from "./icons";
import { ChatNavItem } from "./ChatNavItem";
import { useSocketConnection } from "./Chat/socketConnection";
import { useImageViewer } from "./hooks/useImageViewer";
import { downloadFile } from "../utils/fileDownload";
import { Download, ZoomIn } from "lucide-react";


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
  const {openImage, ImageViewerModal} = useImageViewer()
  
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
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200 w-full">
      {isLoading && <PageLoader color="blue" message={"Rating"} />}
      {volunteered.project?.projectFlierUrl && (
        <div className="group/img relative w-full overflow-hidden cursor-pointer">
          <img
            src={volunteered.project.projectFlierUrl}
            alt={`${volunteered.project.title} flier`}
            className="w-full h-40 object-cover transition-transform duration-500 group-hover/img:scale-105"
            onClick={() => openImage({ url: volunteered.project.projectFlierUrl!, title: volunteered.project.title, downloadName: `${volunteered.project.title}-flier` })}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); openImage({ url: volunteered.project.projectFlierUrl!, title: volunteered.project.title, downloadName: `${volunteered.project.title}-flier` }); }}
              className="inline-flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-100"
            >
              <ZoomIn size={14} /> View
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); void downloadFile(volunteered.project.projectFlierUrl!, `${volunteered.project.title}-flier`); }}
              className="inline-flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-100"
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-base font-bold leading-snug text-gray-900">
              {volunteered.project?.title}
            </h2>
            <p className="mt-0.5 truncate text-sm font-medium text-gray-500">{volunteered.organization?.name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${volunteered.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200" : "bg-green-100 text-green-700 ring-1 ring-green-200"}`}>
              {volunteered.status === "IN_PROGRESS" ? "Ongoing" : "Completed"}
            </span>
            {volunteered.status === "IN_PROGRESS" && (
              <button
                type="button"
                className="shrink-0 text-gray-400 transition-colors hover:text-blue-600"
                onClick={() => onChatOpen(volunteered.project)}
                aria-label="Open group chat"
              >
                <ChatNavItem unreadCount={unreadCount} />
              </button>
            )}
          </div>
        </div>

        {volunteered.project?.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">{volunteered.project.description}</p>
        )}

        {volunteered.project?.categories && volunteered.project.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {volunteered.project.categories.slice(0, 3).map((cat, i) => (
              <span key={i} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600">{cat}</span>
            ))}
            {volunteered.project.categories.length > 3 && (
              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-gray-400">+{volunteered.project.categories.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <CalendarIcon />
            {volunteered.project?.startDate}
          </span>
          {persistedRating && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700">
              <StarIcon filled className="w-3 h-3" />
              {persistedRating}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetailsClick(volunteered)}
          >
            View Details
          </Button>

          {volunteered.status === "IN_PROGRESS" ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onCancelClick(volunteered)}
            >
              Cancel Participation
            </Button>
          ) : (
            !isRatingMode ? (
              <div>
                <Button
                  variant={persistedRating ? "outline" : "primary"}
                  className="w-full"
                  onClick={() => setIsRatingMode(true)}
                >
                  {persistedRating ? "Change Rating" : "Rate Project"}
                </Button>
                {!persistedRating && (
                  <p className="mt-2 text-center text-xs text-gray-400">Project ended. How was it?</p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <span className="mb-2 block text-center text-xs font-semibold text-blue-700">Select your rating</span>
                <div className="mb-4 flex justify-center gap-2">
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white text-xs"
                    onClick={() => setIsRatingMode(false)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant={currentRating === 0 ? "disabled" : "primary"}
                    className="flex-1 text-xs"
                    onClick={handleRatingSubmit}
                  >
                    Save Rating
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <ImageViewerModal/>
    </div>
  );
}

