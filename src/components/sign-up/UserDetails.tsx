import React, { useState, useCallback } from "react";
import Input from "../form/Input";
import { Button } from "../ReuseableComponents";
import LocationSelect from "../form/LocationSelect";

import { useSignup } from "../Volunteer/sign-up/SignupContext";
import { CloudinaryUpload } from "../CloudinaryWidget";
import type { FormFields } from "../../pages/Volunteer/volunteerSignup";


type inputProps = {
    label?: string;
    type?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string  ;
    autoComplete?: string;
}

/**
 * Define a local interface for the form state to avoid colliding with the DOM's FormData type.
 */

const UserDetails:React.FC<{formData:FormFields; setFormData:(d: React.SetStateAction<FormFields>)=>void, next:()=>void}> =({formData, setFormData, next}) => {
  const setFormPayload = useSignup()
 
    const handleLocationChange = useCallback(
    (location: { state: string; lga: string }) => {
      setFormPayload?.setFormPayload((prev) => ({ ...prev, ...location }));

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name as keyof FormFields]: value }));

      // clear error when user starts typing
      setErrors((prev) => ({ ...prev, [name as keyof FormFields]: "" }));
    };

    const validateForm = (): Partial<FormFields> => {
      const newErrors: Partial<FormFields> = {};

      // First name validation
      if (!formData.firstname.trim()) {
        newErrors.firstname = "First name is required";
      } else if (formData.firstname.trim().length < 2) {
        newErrors.firstname = "First name must be at least 2 characters";
      }

      // Middle name validation (optional but validate length if provided)
      if (
        formData.middlename &&
        formData.middlename.trim().length > 0 &&
        formData.middlename.trim().length < 2
      ) {
        newErrors.middlename = "Middle name must be at least 2 characters";
      }

      // Last name validation
      if (!formData.lastname.trim()) {
        newErrors.lastname = "Last name is required";
      } else if (formData.lastname.trim().length < 2) {
        newErrors.lastname = "Last name must be at least 2 characters";
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Phone validation
      const phoneRegex = /^\d{11,}$/;
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Phone number must be at least 11 digits";
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      // Confirm Password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

    if (!formData.state) newErrors.state = "State is required";
    if (!formData.lga) newErrors.lga = "LGA is required";

      return newErrors;
    };

 const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        let {state, lga, profileUrl,...rest} = formData;
        
        
        const payload = {...rest, location: {
          state, lga
        },
        profileUrl: profileUrl || `https://avatar.iran.liara.run/username?username=${formData.firstname} + ${formData.lastname}`
      }
    
       setFormPayload?.setFormPayload(prev=>({...prev, ...payload}))
       
        next()
    };

    const inputs: inputProps[] = [
       {
         label: "First Name",
         type: "text",
         name: "firstname",
         placeholder: "John",
         autoComplete: "given-name",
       },
       {
         label: "Middle Name",
         type: "text",
         name: "middlename",
         placeholder: "Michael",
         autoComplete: "additional-name",
       },
       {
         label: "Last Name",
         type: "text",
         name: "lastname",
         placeholder: "Doe",
         autoComplete: "family-name",
       },
       {
         label: "Email",
         type: "email",
         name: "email",
         placeholder: "john@example.com",
         autoComplete: "email",
       },
       {
         label: "Phone Number",
         type: "tel",
         name: "phone",
         placeholder: "08123456789",
         autoComplete: "tel",
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

     ];
    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-200 to-gray-300 place-items-center w-full p-8">
      <div className="bg-[#F3FAFA] rounded-2xl shadow-xl flex flex-col min-h-screen max-w-4xl p-8 sm:p-10 mx-auto w-full">
        <form className="form mb-4 grid grid-cols-1 gap-y-4" onSubmit={handleSubmit} noValidate>
         <h2 className="font-bold text-2xl text-[#323338] mb-6 relative">
          Input your details
          <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-blue-500"></span>
        </h2>

          
           <div className="flex items-center gap-6 p-4 rounded-xl bg-white/60 border border-gray-200">
            <img
                src={ formData.profileUrl || `https://avatar.iran.liara.run/username?username=${formData.firstname}+${formData.lastname}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border shadow-sm"
            />
        
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-600">
                  Profile Photo
              </span>
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
                JPG, PNG or WEBP. Max 2MB.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputs.map((input) => (
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
                error={
                  input.name
                    ? errors[input.name as keyof FormFields]
                    : undefined
                }
                // required
              />
              {input.name && errors[input.name as keyof FormFields] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[input.name as keyof FormFields]}
                </p>
              )}
            </div>
          ))}
          </div>
          {/*  LocationSelect component here */}
          <div>
            <LocationSelect
              onChange={handleLocationChange}
              state={setFormPayload?.formData.location?.state}
              lga={setFormPayload?.formData.location?.lga}
              error={{ state: errors.state, lga: errors.lga }}
            />
          </div>
          <Button
            variant="primary"
            className="text-sm px-4 py-3 shadow-md w-full mt-6 hover:shadow-lg transition"
          >
            Next
          </Button>
        </form>
      </div>
    </div>
    );
};
export default UserDetails;
