import type { ReactNode } from "react";
import type { ProjectProps } from "../interface/interfaces";
import { formatDisplayDate } from "../utils/date";

const DetailRow: React.FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="flex items-start gap-2 text-sm text-gray-600">
    <span className="w-36 shrink-0 font-semibold text-gray-700">{label}</span>
    <span className="min-w-0 flex-1 break-words text-gray-600">{children}</span>
  </div>
);

const SectionTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className="mb-2 text-sm font-semibold text-gray-800">{children}</h3>
);

const ProjectDetailsModal: React.FC<{ project: ProjectProps }> = ({ project }) => {
  const flierUrl = project.projectFlierUrl || project.projectCardUrl;
  const locationLabel = project.location?.lga || project.location?.state
    ? [project.location?.lga, project.location?.state].filter(Boolean).join(", ")
    : "";
  const attendance =
    project.attendanceHours?.from && project.attendanceHours?.to
      ? `${project.attendanceHours.from} - ${project.attendanceHours.to}`
      : "";

  return (
    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
      {flierUrl && (
        <img
          src={flierUrl}
          alt={`${project.title} flier`}
          className="mb-5 h-48 w-full rounded-xl object-cover"
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-gray-900">{project.title || "Untitled project"}</h2>
          {project.organization?.name && (
            <p className="mt-1 text-sm font-medium text-gray-500">{project.organization.name}</p>
          )}
        </div>
        {project.organization?.status && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
            {project.organization.status}
          </span>
        )}
      </div>

      {project.description && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">{project.description}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-2">
        {locationLabel && <DetailRow label="Location">{locationLabel}</DetailRow>}
        {project.address && <DetailRow label="Address">{project.address}</DetailRow>}
        <DetailRow label="Start date">{formatDisplayDate(project.startDate)}</DetailRow>
        <DetailRow label="End date">{formatDisplayDate(project.endDate)}</DetailRow>
        <DetailRow label="Deadline">{formatDisplayDate(project.applicationDeadline)}</DetailRow>
        {attendance && <DetailRow label="Hours">{attendance}</DetailRow>}
        <DetailRow label="Volunteers needed">{project.maxVolunteers ?? "-"}</DetailRow>
        <DetailRow label="Applicants">{project.totalApplicants ?? 0}</DetailRow>
        {typeof project.rating === "number" && (
          <DetailRow label="Rating">{project.rating.toFixed(1)} / 5</DetailRow>
        )}
      </div>

      {project.categories && project.categories.length > 0 && (
        <div className="mt-5">
          <SectionTitle>Categories</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {project.categories.map((cat, i) => (
              <span key={i} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.requiredSkills && project.requiredSkills.length > 0 && (
        <div className="mt-5">
          <SectionTitle>Required skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((skill, i) => (
              <span key={i} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.specialRequirements && (
        <div className="mt-5">
          <SectionTitle>Special requirements</SectionTitle>
          <p className="text-sm leading-relaxed text-gray-600">{project.specialRequirements}</p>
        </div>
      )}

      {project.organization && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <SectionTitle>Organization</SectionTitle>
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {project.organization.website && <DetailRow label="Website">{project.organization.website}</DetailRow>}
            {typeof project.organization.numOfActiveProjects === "number" && (
              <DetailRow label="Active projects">{project.organization.numOfActiveProjects}</DetailRow>
            )}
            {project.organization.category && project.organization.category.length > 0 && (
              <DetailRow label="Type">{project.organization.category.join(", ")}</DetailRow>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsModal;