import { useState, useEffect } from "react";
import ProjectDetailsModal from "../ProjectModalDetails";
import type { MyVolunteeringProps, ProjectProps } from "../../interface/interfaces";
import VolunteeringProjectCard from "../VolunteeringProjectCard";
import { useConfirmAsk } from "../hooks/useConfirm";
import { useModal } from "../hooks/useModal";
import useAuthFetch from "../hooks/useAuthFetch";
import {  PageLoader } from "../icons";
import { useAlert } from "../hooks/useAlert";
import useMessageThread from "../Chat/MessageThread";

export default function MyVolunteering() {
  const [projects, setProjects] = useState<MyVolunteeringProps[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const {modal, DisplayModal} = useModal()
  const {API} = useAuthFetch("volunteer")
  const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg: false})
  const {alertMessage, AlertDialog} = useAlert({isOrg:false})
  const [chatOpen, setChatOpen] = useState(false)
  const {openGroupMessage, GroupMessageComp} = useMessageThread()

  // Backend fetch
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

   const handleRatingUpdate = async (volunteered:MyVolunteeringProps, rating:number)=>{
    try{
      await API().post(`volunteering/${volunteered.id}/review`, {
        rating
      })
    }catch(err:any){
      let status = err?.response?.status;
      let errMsg = err?.response?.body?.message 

      if(status == 400){
        alertMessage(errMsg)
      }else{
        alertMessage("Failed to leave review")
      }
    }
   }

  const handleCancel = async (volunteered:MyVolunteeringProps) => {
    let confirmation = await confirmAsk({
      question: `Are you sure you want to stop participating in ${volunteered.project?.title} project?`, 
      trueAnswer: "I'm sure",
      falseAnswer: "Cancel"
    })

    if(confirmation){
      try{
        setIsLoading(true)
        await API().delete(`volunteering/${volunteered.id}`)

        setProjects(projects.filter(p=>p.id != volunteered.id))
      }catch{
        setIsLoading(false)
        await alertMessage(`Failed to cancel participation in ${volunteered.project?.title}`)
      }finally{
        setIsLoading(false)
      }
    }
  };

  const handleViewDetailsClick = ({project }: MyVolunteeringProps) => {
    modal(<ProjectDetailsModal project={project}/>)
  };

  const handleOpenGroupChat = (project:ProjectProps)=>{
    
    setChatOpen(true)
    openGroupMessage(project, "volunteer", ()=>{
      setChatOpen(false)
    })

  }
  return (
    <>
      {chatOpen?<GroupMessageComp/>:<>
      
        <ConfirmDialog/>
        <DisplayModal/>
        <AlertDialog/>
        <div className="min-h-screen flex flex-col gap-y-3">
        {isLoading?<PageLoader message="Loading Projects" />:
        
        <>
        <div className="border border-ui rounded-2xl p-5">
          <h2 className=" text-[#676879] text-base font-semibold mb-4 ">
            Ongoing Commitments
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.filter(p=>p.status=="IN_PROGRESS").map((project) => (
              <VolunteeringProjectCard
              onRateSubmit={handleRatingUpdate}
                key={project.id}
                volunteered={project}
                onCancelClick={handleCancel}
                onViewDetailsClick={handleViewDetailsClick}
                onChatOpen={handleOpenGroupChat}
              />
            ))}
          </div> 
        </div>

        <div className="border border-ui rounded-2xl  p-5">
          <h2 className=" text-[#676879] text-base font-semibold mb-4 ">
            Completed Commitments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.filter(p=>p.status=="COMPLETED").map((project) => (
              <VolunteeringProjectCard
                onRateSubmit={handleRatingUpdate}
                key={project.id}
                volunteered={project}
                onCancelClick={handleCancel}
                onViewDetailsClick={handleViewDetailsClick}
                onChatOpen={handleOpenGroupChat}
              />
            ))}
          </div> 
        </div>
        </>}

        {/* Modals */}
        
      </div>
      </>}
    </>
  );
}
