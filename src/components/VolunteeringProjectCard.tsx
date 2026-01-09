import type { MyVolunteeringProps } from "../interface/interfaces";
import { MapMarkerIcon, CalendarIcon } from "./icons";
import { Link } from "react-router-dom";
import { Button } from "./ReuseableComponents";



interface ProjectCardProps {
  volunteered: MyVolunteeringProps;
  onCancelClick: (project: MyVolunteeringProps) => void;
  onViewDetailsClick: (project: MyVolunteeringProps) => void;
  href?: string;
}

export default function VolunteeringProjectCard({
  volunteered,
  onCancelClick,
  onViewDetailsClick,
}: ProjectCardProps) {
  return (
    <div>
      <div className=" border border-ui rounded-2xl p-5  ">
        <h2 className="text-lg font-semibold text-[#323338]">
          {volunteered.project?.title}
        </h2>
        <p className="text-[#676879] text-sm">{volunteered.organization?.name}</p>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-500 text-xs flex items-center  gap-1 ">
            <MapMarkerIcon />
            {volunteered.project?.location &&`${volunteered.project.location.lga}, ${volunteered.project.location.state}`}
          </p>
          <p className="text-gray-400 text-xs  flex items-center gap-1 ">
            <CalendarIcon /> {volunteered.project?.startDate}
          </p>
        </div>

        {volunteered.status === "IN_PROGRESS" ? (
          <div className="flex gap-4 mt-3">
            <Button
            variant="primary"
              onClick={() => onViewDetailsClick(volunteered)}
            >
              View Details
            </Button>
            <Button
              variant="danger"
              onClick={() => onCancelClick(volunteered)}
              className="text-[#D83A52] "
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-3">
            {/* How can a project have rating when it has not been stated or is just being started??? */}
            {/* <p className="text-sm text-yellow-600 font-semibold">
              {project.}
            </p> */}
            <Link to="/profile">
                <Button variant="primary">Certificate</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
