import { useCallback, useState } from "react";
import type { BasicNatigationProps, organizationType } from "../../interface/interfaces";
import Input from "../../components/form/Input";
import LocationSelect from "../../components/form/LocationSelect";
import { Button } from "../../components/ReuseableComponents";
import { LoadingEffect } from "../../components/icons";
import { useAlert } from "../../components/hooks/useAlert";
import useAuthFetch from "../../components/hooks/useAuthFetch";

type inputProps = {
  label?: string;
  type?: string;
  name?: keyof FormFields;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

/**
 * Define a local interface for the form state to avoid colliding with the DOM's FormData type.
 */
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
  cacRegNumber: string;
  driversLicenseNumber: string;
  description: string;
  website: string;
}

export const OrganizationSignup: React.FC<BasicNatigationProps> = ({ onToSignIn }) => {
  const [step, setStep] = useState(0)

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
    cacRegNumber: "",
    driversLicenseNumber: "",
    description: "",
    website: ""
  });

  const [isLoading, setIsLoading] = useState(false)
  const { alertMessage, AlertDialog } = useAlert()
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

  const validateForm = (): Partial<FormFields> => {
    const newErrors: Partial<FormFields> = {};


    //   // Email validation
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!formData.email) {
    //     newErrors.email = "Email is required";
    //   } else if (!emailRegex.test(formData.email)) {
    //     newErrors.email = "Please enter a valid email address";
    //   }

    //   // Phone validation
    //   const phoneRegex = /^\d{11,}$/;
    //   if (!formData.cacRegNumber) {
    //     newErrors. = "Phone number is required";
    //   } else if (!phoneRegex.test(formData.phone)) {
    //     newErrors.phone = "Phone number must be at least 11 digits";
    //   }

    //   // Password validation
    //   if (!formData.password) {
    //     newErrors.password = "Password is required";
    //   } else if (formData.password.length < 6) {
    //     newErrors.password = "Password must be at least 6 characters";
    //   }

    //   // Confirm Password validation
    //   if (!formData.confirmPassword) {
    //     newErrors.confirmPassword = "Please confirm your password";
    //   } else if (formData.password !== formData.confirmPassword) {
    //     newErrors.confirmPassword = "Passwords do not match";
    //   }

    // if (!formData.state) newErrors.state = "State is required";
    // if (!formData.lga) newErrors.lga = "LGA is required";

    return newErrors;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    // make a patch request to add interests for volunteer
    const { state, lga, website, ...rest } = formData
    const payload = {
      ...rest, location: {
        state,
        lga
      },
      website: `https://${website}`
    }
    console.log(payload)
    API().post(`/auth/signup`, payload).then(() => {
      if (onToSignIn)
        onToSignIn()
    }, () => {

      alertMessage("Account Creation failed, please try again")
      setIsLoading(false)
      setStep(0)
    })
  };

  const input1: inputProps[] = [
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
    },
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
      label: "Phone Number",
      type: "text",
      name: "phoneNumber",
      placeholder: "09012345689",
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
      label: "CAC Registration Number",
      type: "text",
      name: "cacRegNumber",
      placeholder: "CAC Reg No.",
    },
    {
      label: "Contact Identication",
      type: "text",
      name: "driversLicenseNumber",
      placeholder: "Driver's License Number",
    },
    {
      label: "Organization Website",
      type: "text",
      name: "website",
      placeholder: "www.example.com",
    }
  ]


  return (
    <div className="bg-[#F3FAFA] flex flex-col min-h-screen pt-5 px-3 sm:px-4 lg:px-4 mx-auto w-full">
      <AlertDialog />
      <form className="form " onSubmit={handleSubmit} noValidate>
        <h2 className=" font-bold text-2xl text-center leading-4 text-[#323338]  ">
          Create an Organization Account
        </h2>

        {step == 0 ?
          <>
            {input1.map((input) => (
              <div key={input.name}>
                <Input
                  label={input.label}
                  type={input.type}
                  placeholder={input.placeholder}
                  name={input.name}
                  value={
                    input.name ? formData[input.name as keyof FormFields] : ""
                  }
                  onChange={handleChange}

                // required
                />
                {input.name && errors[input.name as keyof FormFields] && (
                  <p className="text-red-500 text-sm mt-1">

                  </p>
                )}
              </div>
            ))}

            {/*  LocationSelect component here */}
            <div >
              <LocationSelect
                onChange={handleLocationChange}
                error={{ state: errors.state, lga: errors.lga }}
              />
            </div>
            <Button
              variant="green"
              onClick={() => setStep(1)}
              className="text-sm px-4 py-2 shadow-none w-full mt-4"
            >
              Next
            </Button>
          </> :
          <>
            {input2.map((input) => {

              if (input.name == "organizationType") {
                let options: organizationType[] = ["NGO/Non profit", "Religious Group", "Government Agency", "Educational Institution", "Corporate Foundation", "Community Group"]
                return <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor={"description"}
                    className={`text-xs sm:text-sm text-[#323338]`}
                  >{input.label} <span className="text-red-500 ml-1">*</span></label>
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
                  required
                />
              </div>
            })}
            <label
              htmlFor={"description"}
              className={`text-xs sm:text-sm text-[#323338]`}
            >Description</label>
            <textarea className="w-full border-ui focus:ring-blue-500 rounded-md pl-3 py-2 outline-none "
              name={"description" as keyof FormFields} value={formData.description} onChange={handleChange} rows={4} placeholder="Organization description"></textarea>
            <Button
              variant="green"
              className="text-sm px-4 py-2 shadow-none w-full mt-4"
            >
              {isLoading ? <LoadingEffect message="Creating Account..." /> : "Create Account"}
            </Button>
          </>
        }

      </form>
    </div>
  );
};