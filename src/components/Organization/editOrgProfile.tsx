import { useCallback, useState } from "react";
import Input from "../form/Input";
import type { location, OrganizationProps } from "../../interface/interfaces";
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
  const [location, setLocation] = useState<location>({
    state:"",
    lga:""
  })
  const {alertMessage, AlertDialog} = useAlert({isOrg:true})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
        setLoading(true);
        await onSave(form);
    }catch{
        alertMessage("Unexpected error, failed to update profile")
    }
    finally{
        setLoading(false);
    }
  };

  const handleLocationChange = useCallback((location:location)=>{
    setLocation(location)
  }, [])
  let fallbackUrl = `https://avatar.iran.liara.run/username?username=${form.name}+${form.category}`
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

        <Input
          label="Organization Name"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, organizationName: v }))}
          required
          key={form.name}
        />

        <Input
          label="Organization Type"
          value={form.category}
          onChange={v => setForm(p => ({ ...p, organizationType: v }))}
          required
          
        />

        <Input
          label="CAC Registration Number"
          value={form.cacRegNumber}
          onChange={v =>
            setForm(p => ({ ...p, cacRegistrationNumber: v }))
          }
          required
          key={form.cacRegNumber}
        />

        <Input
          label="Website"
          value={form.website}
          onChange={v => setForm(p => ({ ...p, website: v.target.value }))}
        />

        <LocationSelect onChange={handleLocationChange} lga={location.lga} state={location.state}></LocationSelect>
        
        <Input label="Address"
        value={form.address}
        onChange={v=>setForm(p=>({...p, address:v.target.value}))}
        />

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
