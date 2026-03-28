import { useCallback, useState } from "react";
import Input from "../form/Input";
import type { location, OrganizationProps, organizationType } from "../../interface/interfaces";
import { Button } from "../ReuseableComponents";
import { PageLoader } from "../icons";
import LocationSelect from "../form/LocationSelect";
import { CloudinaryUpload } from "../CloudinaryWidget";
import { useAlert } from "../hooks/useAlert";

type EditOrgProfileModalProps = {
  org: OrganizationProps;
  onSave: (data: OrganizationProps) => Promise<void>;
  onClose:()=>void;
};

export const EditOrgProfileModal = ({org, onSave,onClose}: EditOrgProfileModalProps) => {
  const [form, setForm] = useState(org);
  const [loading, setLoading] = useState(false);
 
  const {alertMessage, AlertDialog} = useAlert({isOrg:true})
  const [errors, setErrors] = useState<Partial<OrganizationProps>>({})
  const [locationError, setLocationerror] = useState("");
  const [orgType, setOrgType] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!validateForm())
      return

    try{
        setLoading(true);
        await onSave(form);
        onClose()
    }catch{
        alertMessage("Unexpected error, failed to update profile")
    }
    finally{
        setLoading(false);   
    }
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>,name: keyof OrganizationProps) => {
    const value  = e.target.value;
    
    // clear error when user starts typing
    switch (name){
      case "category":
        setForm(prev => ({ ...prev, category: [value] }))
        setErrors((prev) => ({ ...prev, description: "" }));
        break
      case "location":
        setLocationerror( "" );
        break
      default:
        setErrors((prev) => ({ ...prev, [name ]: "" }));
        setForm(prev => ({ ...prev, [name ]: value }));

    }
  };

  let organizationTypes: organizationType[] = ["NGO/Non profit", "Religious Group", "Government Agency", "Educational Institution", "Corporate Foundation", "Community Group"]
  const handleLocationChange = useCallback((location:location)=>{
    setForm(prev=>({...prev, location: location}))
  }, [])
  let fallbackUrl = `https://avatar.iran.liara.run/username?username=${form.name}+${form.category}`

  const validateForm = ()=>{
      const newErrors: Partial<OrganizationProps> = {}

      if (!form.cacRegNumber) {
        newErrors.cacRegNumber = "CAC registration number is required";
      } else if (!/^(RC|BN|IT)\s?\d{6,7}$/.test(form.cacRegNumber)) {
        newErrors.cacRegNumber = "Invalid CAC registration number eg. BN 876543";
      }

      if (form.category?.length===0) {
        newErrors.description="Organization type is required";
      }
      if (!form.name) {
        newErrors.name = "Name of organization is required";
      }

      if (!form.location?.lga || !form.location?.state) {
        setLocationerror("Location of organization is required");
      }

      if (!form.address) newErrors.address = "Required";
    

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

 
  return (
    <div className="bg-white rounded-2xl w-full p-6">
    <AlertDialog/>
    {loading && <PageLoader/>}
      <h3 className="text-lg font-semibold mb-4">
        Edit Organization Profile
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        {/* Profile Image */}
        <div className="flex items-center gap-6">
        <img
            src={form.profileUrl || fallbackUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
        />

        <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">
                Organization Logo
            </span>
            <CloudinaryUpload
            folder="avatars"
            buttonText="Change Photo"
            onUploadSuccess={(url) => {
                setForm(prev => ({
                ...prev,
                profileUrl: url,
                }));
            }}
            />
            <p className="text-xs text-gray-400">
            JPG, PNG or WEBP. Max 2MB.
            </p>
        </div>
        </div>

        <div>
          <Input 
          label="Organization Name"
          value={form.name}
          onChange={v => handleChange(v, "name")}
          required
          
          />
          <p className="text-red-500 text-sm mt-1">
            {errors["name"]}
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor={"description"}
            className={`text-xs sm:text-sm text-[#323338]`}
            
          >Organization Type <span className="text-red-500 ml-1">*</span></label>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
              {organizationTypes.map(option => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer rounded-md border border-ui px-3 py-2
                            hover:border-primary transition
                            has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="organizationType"
                    value={option}
                    checked={orgType === option}
                    onChange={(v) => {
                      handleChange(v, "category")
                      setOrgType(option)
                    }}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}

              {/* Other option */}
              <label
                className="flex items-center gap-3 cursor-pointer rounded-md border border-ui px-3 py-2
                          hover:border-primary transition
                          has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="organizationType"
                  value="OTHER"
                  checked={orgType === "OTHER"}
                  onChange={()=>setOrgType("OTHER")}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">Other</span>
              </label>
            </div>

            {/* Custom input — only when Other is selected */}
            {orgType === "OTHER" && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter organization type"
                  value={form.category?form.category[0]: ""}
                  onChange={(e) => {
                   handleChange(e, "category")
                  }}
                  className="w-full rounded-md border border-ui px-3 py-2 outline-none
                            focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          <p className="text-red-500 text-sm mt-1">
            {errors["description"]}
          </p>
        </div>

        
        <div>
          <Input
            label="CAC Registration Number"
            required
            value={form.cacRegNumber}
            onChange={v=>handleChange(v, "cacRegNumber")}/>
            <p className="text-red-500 text-sm mt-1">
            {errors["cacRegNumber"]}
          </p>
        </div>
        
        <Input
          label="Website"
          value={form.website}
          onChange={v => handleChange(v, "website")}
        />

        <div> 
        <LocationSelect onChange={handleLocationChange} lga={form.location?.lga} state={form.location?.state}></LocationSelect>
          
          <Input label="Address"
            required
            value={form.address}
            onChange={v=>handleChange(v, "address")}
            />

          <p className="text-red-500 text-sm mt-1">
            {locationError}
            {errors["address"]}
          </p>
        </div>

        

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={v => setForm(p => ({ ...p, description: v.target.value }))}
          className="border-ui rounded-md pl-3 py-2 outline-none  w-full"
        />
       
        <div className="flex justify-end gap-x-2 pt-2">

          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button  variant="green">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
