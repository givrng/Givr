import React, { useCallback, useEffect, useState } from 'react';
import { LucidePlus, LucideSend, LucideX } from 'lucide-react';
import { useConfirmAsk } from '../hooks/useConfirm';
import useAuthFetch from '../hooks/useAuthFetch';
import { useAlert } from '../hooks/useAlert';
import { LoadingEffect } from '../icons';

/**
 * Interface for the component props
 */
interface ApplicationFormProps {
  onCancel: () => void;
  organization?: string;
  projectId: number;
}

/**
 * Interface for the application form state
 */
interface ApplicationFields {
  projectId: number;
  aboutMe: string;
  reason: string;
  mySkills: string[];
  isAvailable: boolean | null;
  additionalInfo: string;
}

/**
 * Configuration for form fields to ensure type-safe mapping
 */
interface FieldConfig {
  id: keyof Omit<ApplicationFields, 'projectId' | 'isAvailable'>;
  label: string;
  placeholder: string;
  required?: boolean;
}

export const useApplicationForm = ()=>{

    const [isOpen, setIsOpen] = useState(false)
    const [applicationProps, setApplicationProps] = useState<ApplicationFormProps>()
        /**
     * Prompts volunteer to provide their reason for applying for a project.
     * Refactored with TypeScript for robust type checking.
     */
    const ApplicationForm: React.FC<ApplicationFormProps> = ({ onCancel, organization,  projectId }) => {
    const [skillInput, setSkillInput] = useState("");
    const sessionId = `project_${projectId}`
    const [applicationForm, setApplicationForm] = useState<ApplicationFields>(()=>{
        let data = sessionStorage.getItem(sessionId)
        return data? JSON.parse(data) as ApplicationFields: {
        projectId: projectId,
        aboutMe: "",
        reason: "",
        mySkills: [],
        isAvailable: null,
        additionalInfo: ""
    }
    });

    const [errors, setErrors] = useState<Partial<ApplicationFields>>({})

    const {confirmAsk, ConfirmDialog} = useConfirmAsk({isOrg: false})
    const {alertMessage, AlertDialog} = useAlert({isOrg: false})
    const [isLoading, setIsLoading] = useState(false)
    const {API} = useAuthFetch("volunteer")
    
    const maxCharsByField: Record<keyof Omit<ApplicationFields, 'isAvailable'|'projectId' >, number> = {
        aboutMe: 300,
        additionalInfo: 200,
        mySkills: 150,
        reason: 500
    } 

    useEffect(()=>{
        sessionStorage.setItem(sessionId, JSON.stringify(applicationForm))
    }, [applicationForm])
    /**
     * Helper to update form state with specific keys
     */
    const handleInputChange = (field: keyof ApplicationFields, value: string | boolean | string[]|null) => {
        setApplicationForm(prev => ({ ...prev, [field]: value }));
        setErrors({})
    };

    const validateForm = ():boolean=>{
        const newErrors: Partial<ApplicationFields> = {}

        const {aboutMe, isAvailable, reason} = applicationForm
        if(!aboutMe){
            newErrors.aboutMe = "Organizations want to know more about you"
        }
        if(isAvailable == null){
            newErrors.isAvailable = true
        }
        if(!reason){
            newErrors.reason = "Please state your reason for applying"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length == 0;
    }

    /**
     * Handle form submission with proper event typing
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!validateForm())
            return
    
        const confirmed = await confirmAsk({
            question: "Are you sure you want to apply for this project?",
            trueAnswer: "Submit",
            falseAnswer: "Cancel"
        });
        
        setIsLoading(true)

        if (confirmed) {
            try {
                // Note: Replace with your actual API call logic
                await API().post("/projects/apply", applicationForm);
                sessionStorage.removeItem(sessionId)
                await alertMessage("Your aplication has been submitted successfully")
                onCancel();
            } catch (err: any) {
                let status = err?.response?.status
                let errMsg = err?.response?.data?.message
                if(status == 400){
                    alertMessage(errMsg)
                }else if (status == 409){
                    alertMessage("Your application has been submitted already")
                }else
                    alertMessage("Your application Submission failed")
                
            }finally{
                setIsLoading(false)
                
            }
        }
    };

    const handleCancel = async ()=>{
         const confirmed = await confirmAsk({
            question: "Are you sure you want to cancel your application for this project?",
            trueAnswer: "Proceed",
            falseAnswer: "Cancel"
        });

        if(confirmed){
            onCancel()
        }
    }


    /**
   * Structured Skill Handlers
   */
    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !applicationForm.mySkills.includes(trimmed)) {
        handleInputChange('mySkills', [...applicationForm.mySkills, trimmed]);
        setSkillInput("");
        }
    };

    const removeSkill = (indexToRemove: number) => {
        handleInputChange('mySkills', applicationForm.mySkills.filter((_, i) => i !== indexToRemove));
    };
    const textFields: FieldConfig[] = [
        { id: 'aboutMe', label: 'Tell us about yourself', placeholder: 'Share a brief background...', required: true },
        { id: 'reason', label: 'Why do you want to volunteer for this project?', placeholder: 'What motivates you to join?', required: true },
        { id: 'additionalInfo', label: 'Any additional information?', placeholder: 'Optional details...', required: false },
    ];

    return (
        <div className="max-w-5xl mt-2 mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
           {isLoading &&  <LoadingEffect message='Submitting your application'/>}
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Project Application</h2>
            <p className="text-xs text-gray-500 mt-0.5">Applying to {organization || 'this project'}</p>
            </div>
            <button 
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
            >
            <LucideX size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* First 2 text fields */}
            {textFields.splice(0, 2).map((field) => (
            <div key={field.id} className="space-y-1.5">
                <p className="text-red-500 text-sm mt-1">
                        {errors[field.id]}
                    </p>
                <label htmlFor={field.id} className="block text-sm font-bold text-gray-700">
                {field.label} {field.required &&<span className="text-red-700">*</span>}
                </label>
                <textarea
                id={field.id}
                rows={3}
                value={applicationForm[field.id]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field.id, e.target.value)}
                maxLength={maxCharsByField[field.id]}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none text-sm text-gray-800 outline-none"
                
                />
                <div className="flex justify-end">
                <span className={`text-[10px] font-medium ${applicationForm[field.id].length >= maxCharsByField[field.id] ? 'text-red-500' : 'text-gray-400'}`}>
                    {applicationForm[field.id].length} / {maxCharsByField[field.id]}
                </span>
                </div>
            </div>
            ))}

            {/* Structured Skills Section */}
            <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                Relevant Skills
            </label>
            <div className="flex gap-2">
                <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g. Project Management, UI Design..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm"
                />
                <button
                type="button"
                onClick={addSkill}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                <LucidePlus size={20} />
                </button>
            </div>
            
            {/* Skill Chips */}
            <div className="flex flex-wrap gap-2 mt-2 min-h-[32px]">
                {applicationForm.mySkills.length === 0 && (
                <p className="text-xs text-gray-400 italic">No skills added yet. Press enter or click + to add.</p>
                )}
                {applicationForm.mySkills.map((skill, index) => (
                <span 
                    key={index} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full group"
                >
                    {skill}
                    <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-red-200 transition-colors"
                    >
                    <LucideX size={12} />
                    </button>
                </span>
                ))}
            </div>
            </div>

            {/* Remaining text field */}
            {textFields.splice(2).map((field) => (
            <div key={field.id} className="space-y-1.5">
                <p className="text-red-500 text-sm mt-1">
                        {errors[field.id]}
                    </p>
                <label htmlFor={field.id} className="block text-sm font-bold text-gray-700">
                {field.label} {field.required &&<span className="text-red-700">*</span>}
                </label>
                <textarea
                id={field.id}
                rows={3}
                value={applicationForm[field.id]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field.id, e.target.value)}
                maxLength={maxCharsByField[field.id]}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none text-sm text-gray-800 outline-none"
                
                />
                <div className="flex justify-end">
                <span className={`text-[10px] font-medium ${applicationForm[field.id].length >= maxCharsByField[field.id] ? 'text-red-500' : 'text-gray-400'}`}>
                    {applicationForm[field.id].length} / {maxCharsByField[field.id]}
                </span>
                </div>
            </div>
            ))}

            {/* Availability Toggle */}
            <p className="text-red-500 text-sm mt-1">
                {errors?.isAvailable && "Please confirm your availability"}
            </p>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-3 text-center">
                Are you available for the duration of the project?
            </label>
            
            <div className="flex p-1 bg-gray-200/50 rounded-lg max-w-[240px] mx-auto">
                <button
                type="button"
                onClick={() => handleInputChange('isAvailable', true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    applicationForm.isAvailable === true 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                Yes
                </button>
                <button
                type="button"
                onClick={() => handleInputChange('isAvailable', false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    applicationForm.isAvailable === false 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                No
                </button>
            </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
            <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                <LucideSend size={16} />
                Submit Application
            </button>
            </div>
        </form>
        <AlertDialog/>
        <ConfirmDialog/>
        </div>
    );
    };

    const openApplicationForm = useCallback((applicationProps: ApplicationFormProps)=>{
        setIsOpen(true)
        setApplicationProps(applicationProps)
    }, [])

    const ApplicationModal = ()=>(
        isOpen &&applicationProps? <ApplicationForm onCancel={applicationProps?.onCancel} projectId={applicationProps?.projectId} organization={applicationProps?.organization}/> : null
    )

    return {openApplicationForm, ApplicationModal}
}
