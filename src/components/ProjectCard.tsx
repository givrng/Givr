import { MapMarkerIcon, CalendarIcon } from "./icons";
import { Link } from "react-router-dom";

type projectProps = {
  id: number;
  title: string;
  company: string;
  location: string;
  dateStarted: string;
  status: string;
  rating?: string;
  description: string;
};

interface ProjectCardProps {
  project: projectProps;
  onCancelClick: (project: projectProps) => void;
  onViewDetailsClick: (project: projectProps) => void;
  href?: string;
}

export default function ProjectCard({
  project,
  onCancelClick,
  onViewDetailsClick,
}: ProjectCardProps) {
  return (
    <div className="border border-ui rounded-2xl  p-5">
      <h2 className=" text-[#676879] text-base font-semibold mb-4 ">
        {project.status === "ongoing"
          ? "Ongoing Commitments"
          : "Recent Projects"}
      </h2>
      <div className=" border border-ui rounded-2xl p-5  ">
        <h2 className="text-lg font-semibold text-[#323338]">
          {project.title}
        </h2>
        <p className="text-[#676879] text-sm">{project.company}</p>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-500 text-xs flex items-center  gap-1 ">
            <MapMarkerIcon />
            {project.location}
          </p>
          <p className="text-gray-400 text-xs  flex items-center gap-1 ">
            <CalendarIcon /> {project.dateStarted}
          </p>
        </div>

        {project.status === "ongoing" ? (
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => onViewDetailsClick(project)}
              className="px-4 py-2 border rounded-2xl border-ui text-[#323338] "
            >
              View Details
            </button>
            <button
              onClick={() => onCancelClick(project)}
              className="px-4 py-2  text-[#D83A52] "
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm text-yellow-600 font-semibold">
              {project.rating}
            </p>
            <Link to="/profile">
              <button className="px-4 py-2 bg-(--primary-color) text-white rounded-2xl ">
                Certificate
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
