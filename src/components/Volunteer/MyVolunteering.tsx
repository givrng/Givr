import { useState, useEffect } from "react";
import ProjectDetailsModal from "../ProjectModalDetails";
import type { MyVolunteeringProps } from "../../interface/interfaces";
import VolunteeringProjectCard from "../VolunteeringProjectCard";
import { useConfirmAsk } from "../hooks/useConfirm";
import { useModal } from "../hooks/useModal";
import useAuthFetch from "../hooks/useAuthFetch";
import {  PageLoader } from "../icons";

export default function MyVolunteering() {
  const [projects, setProjects] = useState<MyVolunteeringProps[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const {modal, DisplayModal} = useModal()
  const {API} = useAuthFetch("volunteer")
  const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg: false})

  // Simulate backend fetch
  useEffect(() => {
    async function fetchProjects() {
      try{
        setIsLoading(true)
        let response = await API().get("/volunteering")

        let data = response.data as MyVolunteeringProps[]
        setProjects(data)
      }finally{
        setIsLoading(false)
      }
    }

    fetchProjects();
  }, []);


  const handleCancel = async (volunteered:MyVolunteeringProps) => {
    let confirmation = await confirmAsk({
      question: `Are you sure you want to stop participating in ${volunteered.project?.title} project?`, 
      trueAnswer: "I'm sure",
      falseAnswer: "Cancel"
    })

    if(confirmation){

    }
  };

  const handleViewDetailsClick = (project: MyVolunteeringProps) => {
    modal(<ProjectDetailsModal project={project}/>)
  };

  return (
    <>
      <ConfirmDialog/>
      <DisplayModal/>
      <div className="min-h-screen flex flex-col gap-y-3">
      {isLoading?<PageLoader message="Loading Projects" />:
      
      <>
      <div className="border border-ui rounded-2xl p-5">
        <h2 className=" text-[#676879] text-base font-semibold mb-4 ">
          Ongoing Commitments
        </h2>

        <div className="grid md:grid-cols-2 gap-2">
          {projects.filter(p=>p.status=="IN_PROGRESS").map((project) => (
            <VolunteeringProjectCard
              key={project.id}
              volunteered={project}
              onCancelClick={handleCancel}
              onViewDetailsClick={handleViewDetailsClick}
            />
          ))}
        </div> 
      </div>

      <div className="border border-ui rounded-2xl  p-5">
        <h2 className=" text-[#676879] text-base font-semibold mb-4 ">
          Completed Commitments
        </h2>
        <div className="grid md:grid-cols-2 gap-2">
          {projects.filter(p=>p.status=="COMPLETED").map((project) => (
            <VolunteeringProjectCard
              key={project.id}
              volunteered={project}
              onCancelClick={handleCancel}
              onViewDetailsClick={handleViewDetailsClick}
            />
          ))}
        </div> 
      </div>
      </>}

      {/* Modals */}
      
      {/* {showDetails&&<ProjectDetailsModal
        visible={showDetails}
        project={selectedJob}
        onClose={() => setShowDetails(false)}
      />} */}
    </div>
    </>
  );
}
