import React, { useState, useCallback } from "react";
import Input from "../../form/Input";
import {
  Button,
} from "../landingPageComponents";
import LocationSelect from "../../form/LocationSelect";
import type { BasicNatigationProps } from "../../../interface/interfaces";
import { useSignup } from "./SignupContext";


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

interface FormFields {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  state: string;
  lga: string;
}

const UserDetails:React.FC<BasicNatigationProps> = ({onToInterest}) => {
  
  const setFormPayload = useSignup()
  const [formData, setFormData] = useState<FormFields>({
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      state: "",
      lga: "",
    });

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
        
        let {state, lga, ...rest} = formData;
        
        const payload = {...rest, location: {
          state, lga
        }}
    
       setFormPayload?.setFormPayload(prev=>({...prev, ...payload}))
       console.log("Handling to this point")
       if(onToInterest)
        onToInterest()
        
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
      <div className="bg-[#F3FAFA] flex flex-col min-h-screen pt-5 px-3 sm:px-4 lg:px-4 mx-auto w-full">
        <form className="form " onSubmit={handleSubmit} noValidate>
          <h2 className=" font-bold text-2xl leading-4 text-[#323338]  ">
            Input your details
          </h2>
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
          {/*  LocationSelect component here */}
          <div>
            <LocationSelect
              onChange={handleLocationChange}
              error={{ state: errors.state, lga: errors.lga }}
            />
          </div>
          <Button
            variant="primary"
            className="text-sm px-4 py-2 shadow-none w-full mt-4"
          >
            Next
          </Button>
        </form>
      </div>
    );
};
export default UserDetails;
