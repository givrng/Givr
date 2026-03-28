import { useEffect, useState } from "react"
import type { VolunteerApplicationProps } from "../../interface/interfaces"
import { useConfirmAsk } from "../hooks/useConfirm"
import { Button } from "../ReuseableComponents"
import useAuthFetch from "../hooks/useAuthFetch"

const VolunteerCard:React.FC<{applicant:VolunteerApplicationProps, onApprove: (applicant:VolunteerApplicationProps, perm:boolean)=>void, onDecline: (applicant:VolunteerApplicationProps, perm:boolean)=>void}> = ({applicant, onApprove, onDecline})=>{
    
    const {confirmAsk, ConfirmDialog} = useConfirmAsk({})
    
    const date = new Date(applicant.projectApplied.appliedAt)
    const months = ["Jan", "Feb", "March", "Apr", "May","June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    
    const approve = async ()=>{
        let response = await confirmAsk({
            question: "Are you sure you want to approve this applicant?",
            trueAnswer: "Approve",
            falseAnswer: "Cancel"
        })
        
        onApprove(applicant, response)
    }

    const decline = async ()=>{
        let response = await confirmAsk({
            question: "Are you sure you want to decline this applicant?",
            trueAnswer: "Decline",
            falseAnswer: "Cancel"
        })
        
        onDecline(applicant, response)
    }
    return <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full ">
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col pr-4"> 
                <h3 className="text-xl font-bold text-gray-900 mb-1">{`${applicant.firstname} ${applicant.lastname}`}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Appplied for: {applicant.projectApplied.title}
                </p>
            </div>

            <div className="flex-shrink-0 flex space-x-2"> 
                <span className="text-sm text-gray-600 leading-relaxed">
                    Applied {`${months[date.getMonth()-1]} ${date.getDay()}, ${date.getFullYear()}`}
                </span>
            </div>
        </div>

        <div className="text-sm text-gray-700 space-y-2 mb-4">
            <span className="font-semibold">Skills & Interests </span> 
            <div className="flex space-x-2">
                {applicant.skills.map((category)=><span className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-700">{category}</span>)}
            </div>
        </div>

        <div className="flex gap-x-2">
            <Button variant="primary" onClick={approve}>Approve</Button>
            <Button variant="outline" onClick={decline}> Decline</Button>
            {/* <Button variant="outline">View Profile</Button> */}
        </div>
        <ConfirmDialog/>
        
    </div>
}

const NoApplicant = ()=>{
    return <>
    <div className="w-full text-gray-700 text-center text-6xl font-bold">
        No Applicant yet 🫠
    </div>
    </>
}

export const ApplicationHub = ()=>{
    const [applicants, setApplications] = useState<VolunteerApplicationProps[]>()
    const {API} = useAuthFetch("organization")
    // Fetch list of applications when mounted
    useEffect(()=>{
        API().get("/projects/applicants")
        .then((response)=>{
            setApplications(response.data as VolunteerApplicationProps[])
        })
    }, [])

    const removeApplicantFromList = (applicant: VolunteerApplicationProps)=>{
        setApplications(applicants?.filter(appl=>appl.projectApplied.id != applicant.projectApplied.id))
    }
    const onApprove = (applicant: VolunteerApplicationProps, perm:boolean)=>{
        // Make request to backend server to update application 
        if(!perm)return;

        API().patch(`/projects/application/${applicant.projectApplied.id}/accept`, null)
        .then(()=>{
            removeApplicantFromList(applicant)
        })
        
    }

    const onDecline = (applicant: VolunteerApplicationProps, perm:boolean)=>{
        // Make request to backend server to update application 
        if(!perm)return;
        API().patch(`/projects/application/${applicant.projectApplied.id}/reject`, null)
        .then(()=>{
            removeApplicantFromList(applicant)
        })
        
    }

    return <div>
        <p className="text-xl font-bold text-green-700">
            Volunteer Applications
        </p>

        <div className="border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-y-2">
            <span className="text-sm font-medium text-gray-500">Pending Applications</span>
            {
                (applicants && applicants.length>0)? applicants?.map((applicant, index)=><VolunteerCard applicant={{...applicant}} key={index} onApprove={onApprove} onDecline={onDecline}/>): <NoApplicant/>       
            }
        </div>
    </div>
}

