import type {  ProjectProps } from "../interface/interfaces";


const ProjectDetailsModal:React.FC<{project: ProjectProps}> = ({
  project
})=> {

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50" >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-2xl max-h-[90vh] overflow-y-auto "
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold mb-2">Project: {project.title}</h2>
            <p className="text-gray-700 mb-1">Organization: {project.organization?.name}</p>
            <p className="text-[#676879] text-sm mb-5">{project.description}</p>
            <h2 className="text-base font-semibold mb-2">Required Skills</h2>
            {project.requiredSkills.map((skill)=>(<p className="text-[#676879] text-sm mb-5">{skill}</p>))}
          </div>

          <div className="flex items-center gap-3 mb-3">
            
            {project.organization?.status && (
              <div className="flex items-center gap-1 text-white bg-[#00854D]   px-5 rounded-3xl   text-sm">
                {project.organization.status}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {project.address && (
            <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
              <span className="text-(--primary-color) text-sm ">Address:</span>
              {project.address}
            </p>
          )}
          {/* Project state date */}
          <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
              <span className="text-(--primary-color) text-sm ">Start Date:</span>
              {project.startDate}
            </p>
          {/* Project end date */}
            <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
              <span className="text-(--primary-color) text-sm ">End Date:</span>
              {project.endDate}
            </p>

            <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
              <span className="text-(--primary-color) text-sm ">Attendance Hours:</span>
              {`${project.attendanceHours.from.toUpperCase()}-${project.attendanceHours.to.toUpperCase()}`}
            </p>
          {project.organization?.numOfActiveProjects !== undefined && (
            <p className="text-[#676879] text-sm mb-2">
              <span className="text-(--primary-color) text-sm ">
                Active Projects:
              </span>
              {project.organization?.numOfActiveProjects}
            </p>
          )}

          {
            project.specialRequirements&& <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
              <span className="text-(--primary-color) text-sm ">Special requirement:</span>
              {project.specialRequirements}
            </p>
          }
        </div>

        
        {project.organization?.category &&
          project.organization?.category.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.organization?.category.map((category, idx) => (
                <span
                  key={idx}
                  className="border border-ui text-xs px-5 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
  
      </div>
    </div>
  );
}

export default ProjectDetailsModal;