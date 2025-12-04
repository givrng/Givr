import type { MyVolunteeringProps } from "../interface/interfaces";
import { MapMarkerIcon, CalendarIcon } from "./icons";
import { Link } from "react-router-dom";



interface ProjectCardProps {
  project: MyVolunteeringProps;
  onCancelClick: (project: MyVolunteeringProps) => void;
  onViewDetailsClick: (project: MyVolunteeringProps) => void;
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
        {project.progressStatus === "PENDING"
          ? "Ongoing Commitments"
          : "Recent Projects"}
      </h2>
      <div className=" border border-ui rounded-2xl p-5  ">
        <h2 className="text-lg font-semibold text-[#323338]">
          {project.title}
        </h2>
        <p className="text-[#676879] text-sm">{project.organization?.name}</p>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-500 text-xs flex items-center  gap-1 ">
            <MapMarkerIcon />
            {project.location &&`${project.location.lga}, ${project.location.state}`}
          </p>
          <p className="text-gray-400 text-xs  flex items-center gap-1 ">
            <CalendarIcon /> {project.startDate}
          </p>
        </div>

        {project.progressStatus === "PENDING" ? (
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
            {/* How can a project have rating when it has not been stated or is just being started??? */}
            {/* <p className="text-sm text-yellow-600 font-semibold">
              {project.}
            </p> */}
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
