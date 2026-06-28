import { FileText, Lock, ShieldCheck } from "lucide-react";
import { useState, type JSX } from "react";
import type { IdType,  OrganizationProps } from "../interface/interfaces";

/**
 * IDCardInput Component
 * Allows users to toggle between different ID types (BVN, NIN, Passport)
 * and provides a structured input for the specific ID selected.
 */
type IDCardInputProps = { 
  value?:string, 
  dobValue?:string,
  idType?:IdType, 
  onTypeChange: (id:IdType)=>void, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: keyof OrganizationProps)=>void, 
   
  disabled:boolean 
}

export const IDCardInput = ({ value, idType, dobValue, onTypeChange, onChange,  disabled = false }: IDCardInputProps) => {
  
    type IdProps= {
        id: IdType;
        label: string,
        icon: JSX.Element
    }

    const idOptions: IdProps[] = [
    { id: 'DL', label: 'Driver\'s License', icon: <ShieldCheck size={16} /> },
    { id: 'NIN', label: 'NIN', icon: <FileText size={16} /> },
    { id: 'VOTER_CARD', label: 'Voter\'s card', icon: <ShieldCheck size={12} /> },
    { id: 'PASSPORT', label: 'Passport', icon: <Lock size={16} /> },
  ];

  // Helper to get placeholder based on selection
  const getPlaceholder = () => {
    switch (selected) {
      case 'DL': return '10 Alphanumberic Driver\'s License Number';
      case 'NIN': return '11 digit Virtual NIN generated on the NIMC app';
      case 'PASSPORT': return 'Enter International Passport Number';
      case "VOTER_CARD": return 'Enter Voter\'s identification number'
      default: return 'Enter ID Number';
    }
  };

  const [selected, setSelected] = useState<IdType>(idType??"DL")

  return (
    <div className="space-y-3">
      {/* Label and ID Type Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-base font-semibold text-gray-700">
          Identification Details
        </label>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
        </div>
        <div className="grid grid-cols-2 md:flex bg-gray-100 p-1 rounded-lg self-start ">
          {idOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => {

                onTypeChange(option.id)
                setSelected(option.id)
              }}
              value={option.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                selected === option.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-y-2 md:flex md:gap-x-2">
          <input
          type="text"
          value={value}
          onChange={(e)=>onChange(e, "contactVerification")}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className={`
            w-full pl-4 pr-4 py-3 border rounded-lg transition duration-150 text-gray-800
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
            
            ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'bg-white'}
          `}
        />


        {selected == "VOTER_CARD"&& <span className="w-full md:w-[40%]">
          <label htmlFor="dateOfBirth"
            className="block text-base font-semibold text-gray-700"
          >Date of Birth</label>
          <input
          type="date"
          name="dateOfBirth"
          value={dobValue}
          onChange={e=>onChange(e, "dateOfBirth")}
          placeholder="Date of Birth"
          className={`
            w-full pl-4 pr-4 py-3 border rounded-lg transition duration-150 text-gray-800
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
           
            ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'bg-white'}
          `}
        />
        </span>}
        </div>
      </div>

      {/* Error Message
      {errors?.active && (
        <p className="text-sm text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 mr-1" />
          {errors.errMsg}
        </p>
      )} */}
    </div>
  );
};
