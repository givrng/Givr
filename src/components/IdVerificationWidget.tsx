import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import React, { useEffect } from "react";
import { CloudinaryUpload } from "./CloudinaryWidget";
import type { IdType, OrganizationProps } from "../interface/interfaces";
import { IDCardInput } from "./IDCardInput";

type IdentityVerificationWidgetProps = {
    formData: OrganizationProps;
    setForm: React.Dispatch<React.SetStateAction<OrganizationProps>>;
    
    disabled:boolean;
}

export const IdentityVerificationWidget = ({  formData, setForm,  disabled = false }: IdentityVerificationWidgetProps) => {

  // Set a default value for the IdType when component is loaded
  useEffect(()=>{
    setForm(prev=>({
      ...prev, 
      contactVerification: {
        ...prev.contactVerification, 
        idType: "DL"
      }
    }))
  }, [])
  
  const handleTypeChange = (newType: IdType) => {
    setForm(prev => ({ ...prev, contactVerification: {
        ...prev.contactVerification,
        idType: newType,
        idNumber: '',
    } }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof OrganizationProps ) => {
    let val = e.target.value;
    // Basic numeric sanitization for BVN/NIN
    if ((formData.contactVerification?.idType === 'NIN' && key=="contactVerification")) {
        val = val.replace(/\D/g, '').slice(0, 11);
    }
    
    if(key == "contactVerification"){
      setForm(prev => ({ ...prev, [key]: {
        ...prev.contactVerification,
        idNumber: val
    } }));
    }else{
      setForm(prev => ({ ...prev, [key]: val
     }));
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, contactVerification:{
        ...prev.contactVerification,
        usrImgUrl:''
    }}));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900">1. Select & Enter ID Details <span className="text-red-500">(optional)</span> </h3>
        <p className="text-sm text-gray-500">Please provide valid identification details</p>
          
        <IDCardInput 
            onChange={handleInputChange}
            
            onTypeChange={handleTypeChange}
            disabled={disabled}
            idType={formData.contactVerification?.idType}
            value={formData.contactVerification?.idNumber}
            dobValue={formData?.dateOfBirth}
            />
        <div/>
        
        {/* Section 2: Contact Person name */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold text-gray-900">2. User information<span className="text-red-500">*</span></h3>
           <p className="text-sm text-gray-500">Please provide your details</p>

           <p className="md:flex gap-x-2">
            <input type="text"
            className="w-full pl-4 pr-4 py-3 border rounded-lg transition duration-150 text-gray-800
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
             placeholder="Firstname" value={formData.contactFirstname} onChange={(e)=>handleInputChange(e, "contactFirstname")}/>
            <input type="text" 
            className="w-full pl-4 pr-4 py-3 mt-2 border rounded-lg transition duration-150 text-gray-800
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Lastname" value={formData.contactLastname} onChange={e=>handleInputChange(e, "contactLastname")}/>
           </p>
        </div>
        {/* Section 2: Contact Person Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">3. User Image Capture<span className="text-red-500">*</span></h3>
          <p className="text-sm text-gray-500">Please provide a clear passport photograph for verification</p>
          
          {!formData.contactVerification?.usrImgUrl ? (
            <CloudinaryUpload
              folder="id_verifications"
              sources={["local", "camera",]}
              buttonText={`Snap or Upload a passport photograph`}
              max_size_MB={4}
              onUploadSuccess={(url, _)=>{
                setForm(prev=>({
                    ...prev,
                    contactVerification: {
                        ...prev.contactVerification,
                        usrImgUrl:url
                    }
                }))
              }}
            />
          ) : (
            <div className="relative group rounded-xl overflow-hidden border-2 border-blue-100 bg-gray-50">
                {/* Preview Image */}
                <img 
                    src={formData.contactVerification.usrImgUrl} 
                    alt="ID Document Preview" 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                        onClick={removeImage}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove Image"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm border border-green-100">
                    <CheckCircle2 size={14} />
                    Uploaded Successfully
                </div>
            </div>
          )}
        </div>
      </div>      

      
      {/* Footer Info */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            <span>Secure encryption. Your data is only used for verification.</span>
        </div>
      </div>
    </div>
  );
};
