import { useCallback, useState } from "react";
import LocationSelect from "../form/LocationSelect"
import { Button } from "../ReuseableComponents";
import { useConfirmAsk } from "../hooks/useConfirm";
import type { ProjectFormProps } from "../../interface/interfaces";
import { interestCategories } from "../interest";
import useAuthFetch from "../hooks/useAuthFetch";
import { useAlert } from "../hooks/useAlert";

export const CreateProject:React.FC<{onClose?:()=>void}> = ({onClose})=>{

    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:true})
    const {alertMessage, AlertDialog} = useAlert()
    const {API} = useAuthFetch("organization")
    const [formFields, setFormFields] = useState<ProjectFormProps>({
        title:'',
        description:'',
        category:'',
        maxVolunteers:0,
        startDate:'',
        endDate:'',
        attendanceHours:'',
        applicationDeadline:'',
        location:{
            state:'',
            lga:''
        },
        requiredSkills:[],
        specialRequirements:''
    });
    const [selectedSkillCat, setSelectedSkillCat] = useState("");

    const handleLocationChange = useCallback(
        (location: { state: string; lga: string }) => {
          setFormFields(prev=>({
            ...prev,
            location
          }))
        },
        [] // no dependencies → stable reference
      );


    const handleClose = async ()=>{
        let response = await confirmAsk({
            question: "Are you sure you want to cancel?",
            trueAnswer: "Cancel",
            falseAnswer: "Continue"
        })

        if(response && onClose){
            onClose()
        }
    }

    const handleSubmit = async ()=>{
        let userConfirm = await confirmAsk({
            question: "Are you sure you want to create this project?",
            trueAnswer: "Create",
            falseAnswer: "Cancel"
        })
        console.log(formFields)
        if(userConfirm && onClose){
            API().post("/projects", formFields)
            .then(()=>{
                onClose()
            }, ()=>{
                alertMessage("We experienced some trouble creating account, please try again")
            })
        }
        
    }
    return <>
        {<ConfirmDialog />}
        <AlertDialog/>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full border border-gray-200">
        
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Create New Volunteering Project
        </h2>

        <form onSubmit={(e)=>{e.preventDefault()}}>
            
            {/* Project Title */}
            <div>
                <label htmlFor="projectTitle" className="block text-base font-semibold text-gray-700 mb-2">
                    Project title
                </label>
                <input type="text" id="projectTitle" placeholder="e.g, Community Health Screening" 
                    className="w-full px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                    value={formFields.title}

                    onChange={(e)=>setFormFields((prev)=>({
                        ...prev,
                        title:e.target.value
                    }))}/>
            </div>
            
            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-2">
                    Description
                </label>
                <textarea id="description" rows={4} placeholder="Describe the project, it's goals, and what volunteers will do" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y text-gray-800"
                        value={formFields.description}
                        onChange={(e)=>{
                            setFormFields(prev=>({
                                ...prev,
                                description: e.target.value
                            }))
                        }}>
                </textarea>
            </div>
        
            {/* Category & Max Volunteers - Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category" className="block text-base font-semibold text-gray-700 mb-2">
                        Category
                    </label>
                    <select id="category" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8"
                            value={formFields.category}
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    category:e.target.value
                                }))
                            }}>
                        <option>Select Category</option>
                        <option>Healthcare</option>
                        <option>Community Outreach</option>
                        <option>Environmental</option>
                    </select>
                    {/* Custom arrow for select (if needed, otherwise appearance-none is enough) */}
                    {/* <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </div> */}
                </div>
                <div>
                    <label htmlFor="maxVolunteers" className="block text-base font-semibold text-gray-700 mb-2">
                        Max volunteers
                    </label>
                    <input type="number" id="maxVolunteers" placeholder="20" value={formFields.maxVolunteers}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                        onChange={e=>{
                            setFormFields(prev=>({
                                ...prev,
                                maxVolunteers:parseInt(e.target.value)
                            }))
                        }}/>
                </div>
            </div>

            {/* Start Date & End Date - Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-base font-semibold text-gray-700 mb-2">
                        Start Date
                    </label>
                    <input type="date" id="startDate" placeholder="dd/mm/yyyy" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                        value={formFields.startDate}
                        onChange={e=>{
                            setFormFields(prev=>({
                                ...prev,
                                startDate:e.target.value
                            }))
                        }}/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-base font-semibold text-gray-700 mb-2">
                        End Date
                    </label>
                    <input type="date" id="endDate" placeholder="dd/mm/yyyy" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                        value={formFields.endDate}
                        onChange={e=>{
                            setFormFields(prev=>({
                                ...prev,
                                endDate:e.target.value
                            }))
                        }}/>
                </div>
            </div>

            {/* Attendance Hours & Application Deadline - Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="attendanceHours" className="block text-base font-semibold text-gray-700 mb-2">
                        Attendance Hours
                    </label>
                    <input type="text" id="attendanceHours" placeholder="9:00 AM - 3:00PM" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                        value={formFields.attendanceHours}
                        onChange={e=>{
                            setFormFields(prev=>({
                                ...prev,
                                attendanceHours:e.target.value
                            }))
                        }}/>
                </div>
                <div>
                    <label htmlFor="applicationDeadline" className="block text-base font-semibold text-gray-700 mb-2">
                        Application Deadline
                    </label>
                    <input type="date" id="applicationDeadline" placeholder="dd/mm/yyyy" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                        value={formFields.applicationDeadline}
                        onChange={e=>{
                            setFormFields(prev=>({
                                ...prev,
                                applicationDeadline:e.target.value
                            }))
                        }}/>
                </div>
            </div>
            

            {/* Location */}
            <div>
                <LocationSelect
                onChange={handleLocationChange}
                />
            </div>

            {/* Required Skills */}
            <div>
                <label htmlFor="requiredSkills" className="block text-base font-semibold text-gray-700 mb-2">
                    Required Skills (optional)
                </label>
                <div className="grid grid-cols-2 gap-6">
                    <select onChange={(e)=>setSelectedSkillCat(e.currentTarget.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8">
                        <option selected={true} hidden={true}>Category</option>
                        {interestCategories.map((interest, index)=><option value={interest.title} key={index}>{interest.title}</option>)}
                    </select>
                    <select disabled={!selectedSkillCat}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8"
                    onChange={(e)=>{
                        setFormFields(prev=>({
                            ...prev, requiredSkills: [...prev.requiredSkills, e.target.value]
                        }))
                    }}>
                        <option selected={true} hidden={true}>Skill</option>
                        {
                            interestCategories
                                .filter((cat=>cat.title == selectedSkillCat))
                                .flatMap(value =>value.items.filter(skill=>!formFields.requiredSkills.includes(skill)).map((skill, index)=><option value={skill} key={index}>{skill}</option>)
                                )
                        }
                    </select>
                </div>
                <div id="requiredSkills" className="flex gap-x-2 px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800">
                    {formFields.requiredSkills.map((skill)=><span className="px-2 py-1 text-xs bg-gray-200 rounded-full flex items-center" key={skill}>
                        {skill}
                        <button onClick={() => setFormFields((prev)=>({
                            ...prev,
                            requiredSkills:prev.requiredSkills.filter((val)=>val!= skill)
                        }))} className="ml-1 text-red-500">×</button>
                    </span>)}
                </div>
            </div>

            {/* Special Requirements */}
            <div>
                <label htmlFor="specialRequirements" className="block text-base font-semibold text-gray-700 mb-2">
                    Special requirements
                </label>
                <textarea id="specialRequirements" rows={4} placeholder="Any special requirements, materials to bring, or preparation needed" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y text-gray-800"
                        value={formFields.specialRequirements}
                        onChange={e=>{
                            setFormFields(prev=>({
                                ...prev,
                                specialRequirements:e.target.value
                            }))
                        }}>
                </textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 space-x-4">
                <Button variant="green" onClick={handleSubmit}>
                    Create Project
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </div>
        </form>
    </div>
    </>
}