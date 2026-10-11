import { useCallback, useEffect, useState } from "react";
import LocationSelect from "../form/LocationSelect"
import { Button } from "../ReuseableComponents";
import { useConfirmAsk } from "../hooks/useConfirm";
import type { ProjectFormProps, ProjectProps } from "../../interface/interfaces";
import { interestCategories } from "../interest";
import useAuthFetch from "../hooks/useAuthFetch";
import { useAlert } from "../hooks/useAlert";
import { LoadingEffect } from "../icons";
import { CloudinaryUpload } from "../CloudinaryWidget";

export const CreateProject:React.FC<{onClose?:()=>void, onSuccessfulEdit?:(updProject: ProjectProps)=>void, projectData?:ProjectFormProps, isCreating?:boolean, handlesave?: (projects:ProjectProps[])=>Promise<void>}> = ({onClose, projectData, isCreating=true, onSuccessfulEdit, handlesave})=>{

    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg:true})
    const [errors, setErrors] = useState<Partial<ProjectFormProps>>();
    const {alertMessage, AlertDialog} = useAlert({
        isOrg:true
    })
    const {API} = useAuthFetch("organization")
    const [isLoading, setIsLoading] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const [formFields, setFormFields] = useState<ProjectFormProps>({
        id: 0,
        title:'',
        description:'',
        categories:[],
        maxVolunteers:0,
        startDate:'',
        endDate:'',
        attendanceHours:{
            from: "", 
            to: ""
        },
        applicationDeadline:'',
        location:{
            state:'',
            lga:''
        },
        address:"",
        requiredSkills:[],
        specialRequirements:'',
        projectFlierUrl: ''
    });
    const MAX_CHARS = 1000
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
    // Project categories
    const projectCategories: string[] = [
        "Healthcare",
        "Community Outreach",
        "Healthcare",
        "Education & Tutoring",
        "Health & Wellness",
        "Legal Aid",
        "Tech & Digital",
        "Community Outreach",
        "Environmental & Sustainability",
        "Arts, Culture & Creative",
        "Youth Development",
        "Gender & Social Inclusion",
        "Food Security & Nutrition",
        "Research & Data Collection",
        "Communications & Media",
        "Sports & Recreation",
        "Disability & Accessibility",
        "Emergency Relief & Crisis Response",
        "Policy & Advocacy",
        "Finance & Entrepreneurship",
        "Infrastructure & Construction"
    ]
    useEffect(()=>{
        if(projectData)
            setFormFields(projectData)
    }, [])

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

    const handleCreate = async ()=>{
        if(!validateForm())
            return;

        let userConfirm = await confirmAsk({
            question: "Are you sure you want to create this project?",
            trueAnswer: "Create",
            falseAnswer: "Cancel"
        })
       
        if(userConfirm && onClose){
            setIsLoading(true)
            
            try{
                let response = await API().post("/projects", formFields)
                let projects = response.data as ProjectProps[]

                if(handlesave)
                    await handlesave(projects)
                onClose()
            }catch(err:any){
                let status = err?.response?.status
                switch(status){
                    case 400:
                        alertMessage("Inconsistent project timeline, review and try again")
                        break
                    case 500:
                        alertMessage("We experienced some trouble creating project, please try again")
                        break


                }
            }
        }  
        setIsLoading(false)
    }

    const handleUpdate = async ()=>{
        if(!validateForm())
            return;
        let userConfirm = await confirmAsk({
            question: "Are you sure you want to update this project?",
            trueAnswer: "Update",
            falseAnswer: "Cancel"
        })
       
       try{
            setIsLoading(true)
            if(userConfirm){   
                let project = await API().patch(`/projects/${projectData?.id}`, formFields)
                if(onSuccessfulEdit){
                        let updatedProject = project.data as ProjectProps
                        onSuccessfulEdit(updatedProject)
                }
            }
       }catch(err:any){
           
        let status = err.response?.status

        switch(status){
            case 400: {
                let errMsg = err.response.data.message 
                if(errMsg)
                    await alertMessage( errMsg)
                else
                    await alertMessage( `Failed to update project, contact admin for support`)
                break;
            }

            default:{
                await alertMessage( `Failed to update project`)
            }
        }
            
       }finally{
            setIsLoading(false)
            if(onClose)
                onClose()
       }
        
    }

    const validateForm = ()=>{
          const newErrors: Partial<ProjectFormProps> = {}
    
          if (!formFields.title) {
            newErrors.title = "Project title is required";
          }
    
          if(!formFields.description){
            newErrors.description = "Project description is required"
          }
          if (formFields.categories.length == 0) {
            newErrors.categories=["Project category is required"];
          }
          if (!formFields.address || !formFields.location.lga || !formFields.location.state) {
            newErrors.address = "Address, LGA, and state are required";
          }
    
    
          if(!formFields.applicationDeadline )
            newErrors.applicationDeadline = "Project deadline is required"
    
          if (!formFields.startDate) newErrors.startDate = "Required";
      
          if(!formFields.endDate){
            newErrors.startDate = "Required"
          }
          if(formFields.attendanceHours ){
            if(!formFields.attendanceHours.from){
                newErrors.attendanceHours = {
                    from: "Required",
                    to: ""
                }
            }

            if(!formFields.attendanceHours.to){
                newErrors.attendanceHours = {
                    from: "",
                    to: "Required"
                }
            }
          }
          if(!formFields.maxVolunteers)
            newErrors.specialRequirements = "Maximum participants is required"           
    
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
      }
    useEffect(()=>{
        setErrors({
            title: ""
        })
    }, [formFields])
    return <>
        {<ConfirmDialog />}
        <AlertDialog/>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full border border-gray-200">
            {isLoading?<LoadingEffect message={`${isCreating?"Creating Project...":"Modifying Project..."}`}/>:
            
            <>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                {isCreating?"Create New Volunteering Project":`Edit ${projectData?.title.toLocaleLowerCase()}`}
            </h2>

            <form onSubmit={(e)=>{e.preventDefault()}}>
                
                {/* Project Title */}
                <div>
                    <label htmlFor="projectTitle" className="block text-base font-semibold text-gray-700 mb-2">
                        Project title
                        <span className="text-red-700">*</span>
                    </label>
                    <p className="text-red-500 text-sm mt-1">
                        {errors?.title}
                    </p>
                    
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
                    <label className="block text-base font-semibold text-gray-700 mb-2">Description<span className="text-red-700">*</span></label>
                    <p className="text-red-500 text-sm mt-1">
                        {errors?.description}
                    </p>
                    
                    <textarea
                    id="description"
                    rows={4}
                    maxLength={MAX_CHARS}
                    placeholder="Describe the project, its goals, and what volunteers will do"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y text-gray-800"
                    value={formFields.description}
                    onChange={(e) => {
                        const value = e.target.value;

                        setFormFields(prev => ({
                        ...prev,
                        description: value
                        }));

                        setCharCount(value.length);
                    }}
                />
                </div>

                <div className="mt-1 text-sm flex justify-end">
                    <span
                        className={
                        charCount >= MAX_CHARS
                            ? "text-red-600"
                            : charCount > 900
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }
                    >
                        {charCount}/{MAX_CHARS} characters
                    </span>
                </div>

                {/* Project Flier */}
                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-4">
                        {formFields.projectFlierUrl ? (
                            <img
                                src={formFields.projectFlierUrl}
                                alt="Project flier preview"
                                className="h-20 w-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                        ) : (
                            <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-400">
                                <span className="text-xs text-center px-2">No flier</span>
                            </div>
                        )}

                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-gray-900 mb-1">
                                Project Flier (optional)
                            </span>
                            <CloudinaryUpload
                                folder="project-fliers"
                                buttonText={formFields.projectFlierUrl ? "Change Flier" : "Upload Flier"}
                                sources={["local", "camera", "google_drive"]}
                                max_size_MB={2}
                                onUploadSuccess={(url) => {
                                    setFormFields((prev) => ({
                                        ...prev,
                                        projectFlierUrl: url,
                                    }));
                                }}
                            />
                            <p className="mt-2 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                JPG, PNG or WEBP • Max 2MB
                            </p>
                            {formFields.projectFlierUrl && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormFields((prev) => ({
                                            ...prev,
                                            projectFlierUrl: "",
                                        }))
                                    }
                                    className="mt-1 text-xs font-semibold text-red-500 hover:text-red-700"
                                >
                                    Remove flier
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            
                {/* Category & Max Volunteers - Grid Layout */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-base font-semibold text-gray-700 mb-2">
                            Category
                            <span className="text-red-700">*</span>
                        </label>
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.categories?.pop()}
                        </p>
                        <select id="category" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8"
                                value={"Select Category"}
                                onChange={e=>{
                                    setFormFields(prev=>({
                                        ...prev,
                                        categories: [...prev.categories, e.target.value]
                                    }))
                                }} required >
                            <option>Select Category</option>
                            {projectCategories.filter(category=>{
                                return !formFields.categories.includes(category);
                            }).map(category=>(<option>{category}</option>))}
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
                            <span className="text-red-700">*</span>
                        </label>
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.specialRequirements}
                        </p>
                        
                        <input type="number" id="maxVolunteers" placeholder="20" value={formFields.maxVolunteers}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    maxVolunteers:parseInt(e.target.value)
                                }))
                            }}/>
                    </div>

                    <div id="requiredSkills" className="w-full flex col-span-full flex-wrap gap-2 px-4 py-3 border border-white rounded-lg transition duration-150 text-gray-800">
                            {formFields.categories.map((category)=><span className="px-2 py-1 text-xs bg-gray-200 rounded-full flex items-center" key={category}>
                                {category}
                                <button onClick={() => setFormFields((prev)=>({
                                    ...prev,
                                    categories:prev.categories.filter((val)=>val!= category)
                                }))} className="ml-1 text-red-500">×</button>
                            </span>)}
                        </div>
                </div>

                {/* Start Date & End Date - Grid Layout */}
                <div className="grid grid-cols-2 gap-6 ">
                    <div>
                        <label htmlFor="startDate" className="block text-base font-semibold text-gray-700 mb-2">
                            Start Date
                            <span className="text-red-700">*</span>
                        </label>
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.startDate}
                        </p>
                        
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
                            <span className="text-red-700">*</span>
                        </label>
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.endDate}
                        </p>
                        <input type="date" id="endDate" placeholder="dd/mm/yyyy" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                            value={formFields.endDate}
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    endDate:e.target.value
                                }))
                            }} />
                    </div>
                </div>
                {/**Attendance hours */}
                <div>
                    <label htmlFor="attendanceHours" className="block text-base font-semibold text-gray-700 mb-2">
                        Attendance Hours
                        <span className="text-red-700">*</span>
                    </label>
                    <p className="text-red-500 text-sm mt-1">
                        {errors?.attendanceHours?.from}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2">
                        <div className="flex gap-x-2">
                
                            <input type="time" id="attendanceHours" placeholder="9:00" 
                            className="sm:w-full px-2 py-3 border border-gray-300 rounded-lg 

                            focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                            value={formFields.attendanceHours.from.split(" ")[0]}
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    attendanceHours:{
                                        ...prev.attendanceHours,
                                        from: e.target.value
                                    }
                                }))
                            }}/>

                            <select name="fromTime" 
                            className="px-1 py-3 border border-gray-300 rounded-lg"
                            value={formFields.attendanceHours.from.split(" ")[1]}
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    attendanceHours:{
                                        ...prev.attendanceHours,
                                        from: `${prev.attendanceHours.from.split(" ")[0]} ${e.target.value}`
                                    }
                                }))
                                
                            }}>
                                <option hidden selected>--</option>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                       

                        <div className="flex gap-x-2 items-center">
                            <label htmlFor="to" className="font-semibold">To:<span className="text-red-700">*</span> </label>
                            <p className="text-red-500 text-sm mt-1">
                                {errors?.attendanceHours?.to}
                            </p>
                            <input type="time" id="attendanceHours" placeholder="3:00" 
                            className="sm:w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                            value={formFields.attendanceHours.to.split(" ")[0]}
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    attendanceHours:{
                                        ...prev.attendanceHours,
                                        to: e.target.value
                                    }
                                }))
                            }}/>

                            <select name="time"
                            className="px-1 py-3 border border-gray-300 rounded-lg" 
                            value={formFields.attendanceHours.to.split(" ")[1]} 
                            onChange={e=>{
                                setFormFields(prev=>({
                                    ...prev,
                                    attendanceHours:{
                                        ...prev.attendanceHours,
                                        to: `${prev.attendanceHours.to.split(" ")[0]} ${e.target.value}`
                                    }
                                }))
                            }}>
                                <option hidden selected>--</option>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                       
                        </div>
                    </div>
                </div>
                {/* Attendance Hours & Application Deadline - Grid Layout */}
                <div className="grid grid-cols-1 gap-6">
                    
                    <div>
                        <label htmlFor="applicationDeadline" className="block text-base font-semibold text-gray-700 mb-2">
                            Application Deadline
                            <span className="text-red-700">*</span>
                        </label>
                        <p className="text-red-500 text-sm mt-1">
                            {errors?.applicationDeadline}
                        </p>
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
                    state={projectData?.location.state}
                    lga={projectData?.location.lga}
                    />
                    <p className="text-red-500 text-sm mt-1">
                        {errors?.address}
                    </p>
                </div>
                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-base font-semibold text-gray-700 mb-2">
                        Address
                        <span className="text-red-700">*</span>
                    </label>
                    <p className="text-red-500 text-sm mt-1">
                        {errors?.address}
                    </p>
                    <input type="text" id="address" placeholder="e.g, 13, First streat" 
                        className="w-full px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800"
                        value={formFields.address}

                        onChange={(e)=>setFormFields((prev)=>({
                            ...prev,
                            address:e.target.value
                        }))}/>
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
                        value={formFields.requiredSkills.at(-1)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 appearance-none bg-white pr-8"
                        onChange={(e)=>{
                            setFormFields(prev=>({
                                ...prev, requiredSkills: [...prev.requiredSkills, e.target.value]
                            }))
                        }}>
                            <option selected={true} hidden={true} value="">Skill</option>
                            {
                                interestCategories
                                    .filter((cat=>cat.title == selectedSkillCat))
                                    .flatMap(value =>value.items.filter(skill=>!formFields.requiredSkills.includes(skill)).map((skill, index)=><option value={skill} key={index}>{skill}</option>)
                                    )
                            }
                        </select>
                    </div>
                    <div id="requiredSkills" className="w-full flex flex-wrap gap-2 px-4 py-3 border border-white rounded-lg transition duration-150 text-gray-800">
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
                            }}
                            maxLength={300}
                            >
                    </textarea>
                    <div className="flex justify-end">
                    <span className={`text-[10px] font-medium ${formFields.specialRequirements.length >= 300 ? 'text-red-500' : 'text-gray-400'}`}>
                        {formFields.specialRequirements.length} / 300
                    </span>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 space-x-4">
                    {isCreating?<Button variant="green" onClick={handleCreate}>Save</Button>
                        :<Button variant="green" onClick={handleUpdate}>Update</Button>}

                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </div>
            </form>
            </>}
        
        </div>
    </>
}