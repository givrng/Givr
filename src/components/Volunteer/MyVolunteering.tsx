import { useState, useEffect } from "react";
import ProjectCard from "../ProjectCard";
import ConfirmDialog from "../ConfirmDialog";
import ProjectDetailsModal from "../ProjectModalDetails";
import type { MyVolunteeringProps } from "../../interface/interfaces";

export default function MyVolunteering() {
  const [projects, setProjects] = useState<MyVolunteeringProps[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<MyVolunteeringProps | null>(
    null
  );

  // Simulate backend fetch
  useEffect(() => {
    async function fetchProjects() {
      const data: MyVolunteeringProps[] = [
        {
          id: "1",
          title: "Frontend Developer",
          organization: {
            name: "TechCorp Ltd",
            status: "VERIFIED",
            address: "123 Business Rd, Lagos, Nigeria",
            numOfActiveProjects: 5,
            category: ["Technology", "Education"],
          },
          location: {
            lga: "Ikoyi",
            state: "Lagos",
          },
          startDate: "2025-11-10",
          progressStatus: "PENDING",
          description:
            "Responsible for building and maintaining user interfaces using React. Collaborate with backend developers and designers to ensure seamless functionality.",
          userApplied: true,
          rating: "⭐⭐⭐⭐",
        },
        {
          id: "2",
          title: "Graphic Designer",
          organization: {
            name: "Designify Studios",
            status: "VERIFIED",
            address: "123 Business Rd, Lagos, Nigeria",
            numOfActiveProjects: 5,
            category: ["Technology", "Education"],
          },
          location: {
            lga: "Ikoyi",
            state: "Lagos",
          },
          startDate: "2025-11-10",
          progressStatus: "COMPLETED",
          description:
            "Design marketing materials, social media graphics, and branding assets for client projects.",
          userApplied: true,
rating: "⭐⭐⭐⭐"
        },
        {
    id: "2",
          title: "UI/UX Designer",
          organization: {
            name: "SoftBridge",
            status: "VERIFIED",
            address: "123 Business Rd, Lagos, Nigeria",
            numOfActiveProjects: 5,
            category: ["Technology", "Education"],
          },
          location: {
            lga: "Ikoyi",
            state: "Lagos",
          },
          startDate: "2025-11-10",
          progressStatus: "PENDING",
          description:
            "Create wireframes, prototypes, and collaborate with developers to bring designs to life.",
          userApplied: true,
rating: "⭐⭐⭐⭐"
        },
      ];

    setProjects(data);

    }

    fetchProjects();
  }, []);

  const handleCancelClick = (project: MyVolunteeringProps) => {
    setSelectedJob(project);
    setShowDialog(true);
  };

  const confirmCancel = () => {
    if (!selectedJob) return;
    setProjects((prev) => prev.filter((j) => j.id !== selectedJob.id));
    setShowDialog(false);
    setSelectedJob(null);
  };

  const handleViewDetailsClick = (project: MyVolunteeringProps) => {
    setSelectedJob(project);
    // setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="grid md:grid-cols-2  gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onCancelClick={handleCancelClick}
            onViewDetailsClick={handleViewDetailsClick}
          />
        ))}
      </div>

      {/* Modals */}
      <ConfirmDialog
        visible={showDialog}
        onConfirm={confirmCancel}
        onClose={() => setShowDialog(false)}
      />
      <ProjectDetailsModal
        visible={showDetails}
        project={selectedJob}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}
