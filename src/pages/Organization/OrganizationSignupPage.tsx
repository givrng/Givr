import { useCallback, useRef, useState } from "react";
import type { BasicNatigationProps, organizationType } from "../../interface/interfaces";
import Input from "../../components/form/Input";
import LocationSelect from "../../components/form/LocationSelect";
import { Button } from "../../components/ReuseableComponents";
import { LoadingEffect } from "../../components/icons";
import { useAlert } from "../../components/hooks/useAlert";
import useAuthFetch from "../../components/hooks/useAuthFetch";
import { CloudinaryUpload } from "../../components/CloudinaryWidget";

type inputProps = {
  label?: string;
  type?: string;
  name?: keyof FormFields;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

/**
 * Define a local interface for the form state to avoid colliding with the DOM's FormData type.
 */
// type IdType = "NIN" | "Drivers License" | ""
// const IdMeans: IdType[] = ["NIN", "Drivers License", ""]
// interface IdField {
//   type: IdType;
//   id: string;
// }
interface FormFields {
  email: string;
  password: string;
  confirmPassword: string;
  contactFirstname: string;
  contactLastname: string;
  contactMiddleName: string;
  phoneNumber: string;
  state: string;
  lga: string;
  organizationName: string;
  organizationType: organizationType;
  description: string;
  website: string;
  address:string;
  profileUrl:string;
  cacRegNumber:string;
}

// const IdentificationField = ({ value, onChange }: {
//     value: IdField,
//     onChange: React.Dispatch<React.SetStateAction<IdField>>
//   }) => (<div className="flex flex-col mt-1">
//     <span className="flex gap-x-2">
//       <select name="identification"
//         className="w-[30%] border-ui focus:ring-blue-500 rounded-md pl-3 py-2 outline-none"
//         value={value.type}
//         onChange={e => onChange(prev => ({ ...prev, type: e.target.value as IdType }))}
//       >
//         <option value={""} selected hidden>ID <span className="text-red-500 ml-1">*</span></option>
//         {IdMeans.map(means => {
//           if (means == "")
//             return

//           return <option value={means} key={means}>{means}</option>
//         })}
//       </select>
//       <input type="text" value={value.id}
//         placeholder="Identification number" className="w-full rounded-md pl-3 py-2 outline-none border-ui focus:ring-blue-500"
//         onChange={(e) => {
//           onChange(prev => ({ ...prev, id: e.target.value }))
//         }}
//       />
//     </span>
//   </div>)
  
export const OrganizationSignup: React.FC<BasicNatigationProps> = ({ onToSignIn }) => {
  const [step, setStep] = useState(0)
  const firstFormRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<FormFields>({
    email: "",
    password: "",
    confirmPassword: "",
    contactFirstname: "",
    contactMiddleName: "",
    contactLastname: "",
    phoneNumber: "",
    state: "",
    lga: "",
    organizationName: "",
    organizationType: "",
    description: "",
    website: "",
    address:"",
    profileUrl:"",
    cacRegNumber: ""
  });
 
  const [isLoading, setIsLoading] = useState(false)
  const { alertMessage, AlertDialog } = useAlert({ isOrg: true })
  const { API } = useAuthFetch("organization")
  const handleLocationChange = useCallback(
    (location: { state: string; lga: string }) => {
      setFormData((prev) => ({ ...prev, ...location }));

      //   clears error once an item is selected
      setErrors((prev) => ({
        ...prev,
        ...(location.state && { state: "" }),
        ...(location.lga && { lga: "" }),
      }));
    },
    [] // no dependencies → stable reference
  );

  const [errors, setErrors] = useState<Partial<FormFields>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name as keyof FormFields]: value }));

    // clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name as keyof FormFields]: "" }));
  };

  const validateStepOne = () => {
  const newErrors: Partial<FormFields> = {};

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Invalid email address";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (formData.confirmPassword !== formData.password) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  if (!formData.contactFirstname) newErrors.contactFirstname = "Required";
  if (!formData.contactLastname) newErrors.contactLastname = "Required";


  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Partial<FormFields> = {};

    setIsLoading(true)
    // make a patch request to add interests for volunteer
    const { state, lga, website, ...rest } = formData
    const payload = {
      ...rest, location: {
        state,
        lga
      },
      website: `https://${website}`,
    }
    
    try{
         await API().post(`/auth/signup`, payload)
     
        if(onToSignIn)
          onToSignIn()
    }catch(err:any){
      const status = err?.response?.status;

      switch(status){
        case 400:
          alertMessage("Invalid signup data")
          break
        case 409:
          newErrors.email = "Account exist"
          setErrors(newErrors)
          alertMessage("An account with these details already exists. Try signing in instead.")
          break
        case 500:
          alertMessage("Server error. Try again later")
          break
        default:
          alertMessage("Account Creation failed")
      }
      setStep(0)
    }finally{
      setIsLoading(false)
    }
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!validateStepOne())
      return

    setStep(1)
  }
  const input1: inputProps[] = [
    {
      label: "Contact Firstname",
      type: "text",
      name: "contactFirstname",
      placeholder: "John",
    },
    {
      label: "Contact Middle name",
      type: "text",
      name: "contactMiddleName",
      placeholder: "Doe",
    },
    {
      label: "Contact Lastname",
      type: "text",
      name: "contactLastname",
      placeholder: "***",
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "john@example.com",
      autoComplete: "email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "********",
      autoComplete: "new-password",
    },
    {
      label: "Confirm Password",
      type: "password",
      name: "confirmPassword",
      placeholder: "********",
      autoComplete: "new-password",
    }
  ];

  const input2: inputProps[] = [
    {
      label: "Organization Name",
      type: "text",
      name: "organizationName",
      placeholder: "Volunteering ltd.",
    },
    {
      label: "Organization Type",
      type: "text",
      name: "organizationType",
      placeholder: "Non-profile/NGO",
    },
    {
      label: "Organization Website",
      type: "text",
      name: "website",
      placeholder: "www.example.com",
    },
    {
      label:"Organization Address",
      type: "text",
      name: "address",
      placeholder: "10 AdeLombard Street"
    }
  ]
  const fallbackUrl = `https://avatar.iran.liara.run/username?username=${formData.organizationType} + ${formData.organizationName}`

  return (
    <div className="bg-gray-300 flex place-items-center w-full p-8 min-h-screen h-full">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col px-6 sm:px-8 py-6 mx-auto w-full max-w-5xl pt-5 px-3 sm:px-4 lg:px-4 mx-auto w-full max-w-5xl pb-2">
        <AlertDialog />
        <div className="flex items-center justify-center gap-3 mb-6">
          {[0, 1].map(i => (
            <div
              key={i}
              className={`h-2 w-24 rounded-full transition-all
                ${step === i ? "bg-[#34A853]" : "bg-gray-300"}
              `}
            />
          ))}
        </div>

        {step == 0 ?
          <>
            <form className="space-y-4" onSubmit={handleNext} ref={firstFormRef}>
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#323338]">
                  Create an Organization Account
                </h1>
                <p className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mt-2">Personal Information of the organization representative</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Personal Information
                </h3>

                <div>
                {input1.map((input) => {
                  if (input.name == "contactMiddleName") {
                    return (<Input
                      label={input.label}
                      type={input.type}
                      placeholder={input.placeholder}
                      name={input.name}
                      value={
                        input.name ? formData[input.name as keyof FormFields] : ""
                      }
                      onChange={handleChange}
                    />)
                  }
                return <div key={input.name}>
                  <Input
                    label={input.label}
                    type={input.type}
                    placeholder={input.placeholder}
                    name={input.name}
                    value={
                      input.name ? formData[input.name as keyof FormFields] : ""
                    }
                    onChange={handleChange}
                    required
                  />
                  {input.name && errors[input.name as keyof FormFields] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name as keyof FormFields]}
                    </p>
                  )}
                </div>
              })}
              
                {/* <div> */}
                  {/* <label className="text-sm font-semibold text-gray-700">
                    Identification
                  </label> */}
                  {/* Identification  */}
                  {/* <IdentificationField value={identification} onChange={setIdentification}/> */}
                {/* </div> */}
              </div>
             </div>


              <Button
                variant="green"
                className="w-full py-3 text-sm font-semibold"
              >
                Continue
              </Button>
            </form>
          </> :
          <>
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mt-2">Organization Details</h3>
              <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-6">
                  <img
                      src={ formData.profileUrl || fallbackUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border object-cover"
                  />
                
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                        Organization Logo
                    </p>
                    <CloudinaryUpload
                    folder="avatars"
                    buttonText="Change Photo"
                    onUploadSuccess={(url) => {
                        setFormData(prev => ({
                        ...prev,
                        profileUrl: url,
                        }));
                    }}
                    />
                    <p className="text-xs text-gray-400">
                      JPG, PNG or WEBP • Max 2MB.
                      </p>
                    </div>
                  </div>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Organization Details
                  </h3>
                  
                  <div>
                    {input2.map((input) => {

                  if (input.name == "organizationType") {
                    let options: organizationType[] = ["NGO/Non profit", "Religious Group", "Government Agency", "Educational Institution", "Corporate Foundation", "Community Group"]
                    return <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor={"description"}
                        className={`text-xs sm:text-sm text-[#323338]`}
                      >{input.label} </label>
                      <select name={input.name}
                        className="w-full border-ui focus:ring-blue-500 rounded-md pl-3 py-2 outline-none"
                        onChange={handleChange}>

                        <option selected hidden value={""} key={"default"}>{input.label}</option>

                        {options.map(option => <option key={option}>{option}</option>)}
                      </select>
                    </div>
                  }

                  return <div key={input.name}>
                    <Input
                      label={input.label}
                      type={input.type}
                      placeholder={input.placeholder}
                      name={input.name}
                      value={
                        input.name ? formData[input.name as keyof FormFields] : ""
                      }
                      onChange={handleChange}

                    />
                  </div>
                })}
                </div>
                
                {/*  LocationSelect component here */}
                  <div >
                    <LocationSelect
                      onChange={handleLocationChange}
                      error={{ state: errors.state, lga: errors.lga }}
                    />
                  </div>
                  <div>
                    
                  <div>
                    <label
                      className="text-sm font-semibold"
                    >Description</label>
                    <textarea className="w-full rounded-md border-ui p-3"
                      name={"description" as keyof FormFields} value={formData.description} 
                      onChange={handleChange} rows={4} placeholder="Briefly describe your organization"/>
                      
                  </div>
                  </div>
              </div>
              <div className="flex gap-x-4">
                <Button variant="outline"
                  className="text-sm px-4 py-2 shadow-none mt-4 w-full"
                  onClick={() => setStep(0)}
                >Back</Button>
                <Button
                  variant="green"
                  className="text-sm px-4 py-2 shadow-none mt-4 w-full"
                >
                  {isLoading ? <LoadingEffect message="Creating Account..." /> : "Skip"}
                </Button>
              </div>
            </form>
          </>
        }
      </div>
    </div>
  );
};