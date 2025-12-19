import type { MyVolunteeringProps } from "../interface/interfaces";
import { useEffect, useRef } from "react";

interface ProjectDetailsModalProps {
  visible: boolean;
  project: MyVolunteeringProps | null;
  onClose: () => void;
}

export default function ProjectDetailsModal({
  visible,
  project,
  onClose,
}: ProjectDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // Close when clicking outside the modal
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [visible, onClose]);

  if (!visible || !project) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-2xl max-h-[90vh] overflow-y-auto "
        ref={modalRef}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-1">{project.organization?.name}</p>
            <p className="text-[#676879] text-sm mb-5">{project.description}</p>
          </div>

          <div className="flex items-center gap-3 mb-3">
            {project.userApplied && (
              <div className="flex items-center gap-1 text-white bg-(--primary-color)   px-5 rounded-3xl text-sm">
                Applied
              </div>
            )}
            {project.organization?.status && (
              <div className="flex items-center gap-1 text-white bg-[#00854D]   px-5 rounded-3xl   text-sm">
                Verified
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {project.organization?.address && (
            <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
              <span className="text-(--primary-color) text-sm ">Address:</span>
              {project.organization?.address}
            </p>
          )}

          {project.organization?.numOfActiveProjects !== undefined && (
            <p className="text-[#676879] text-sm mb-2">
              <span className="text-(--primary-color) text-sm ">
                Active Projects:
              </span>
              {project.organization?.numOfActiveProjects}
            </p>
          )}
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
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
