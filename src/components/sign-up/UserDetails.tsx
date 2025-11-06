import React, { useState } from "react";
import Input from "../form/Input";
import {
  Button,
} from "../landingPageComponents";
import type { BasicNatigationProps } from "../../interface/interfaces";


type inputProps = {
    label?: string;
    type?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
}

/**
 * Define a local interface for the form state to avoid colliding with the DOM's FormData type.
 */
interface FormFields {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: string;
}

const UserDetails:React.FC<BasicNatigationProps> = ({onToInterest}) => {
    const [formData, setFormData] = useState<FormFields>({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      location: "",
    });

    const [errors, setErrors] = useState<Partial<FormFields>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name as keyof FormFields]: value }));

      // clear error when user starts typing
      setErrors((prev) => ({ ...prev, [name as keyof FormFields]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: Partial<FormFields> = {};

      // simple required field validation
      (Object.keys(formData) as (keyof FormFields)[]).forEach((key) => {
        if (!formData[key]) {
          newErrors[key] = "This field is required";
        }
      });

      setErrors(newErrors);

      // if no errors, proceed
      if (Object.keys(newErrors).length === 0) {
        // navigate or go to next page here
      }

      if(onToInterest){
        onToInterest("id")
      }
        

    };
     const inputs: inputProps[] = [
       {
         label: "Full Name",
         type: "text",
         name: "name",
         placeholder: "John Doe",
       },
       {
         label: "Email",
         type: "email",
         name: "email",
         placeholder: "john@example.com",
       },
       {
         label: "Phone Number",
         type: "tel",
         name: "phone",
         placeholder: "08123456789",
       },
       {
         label: "Password",
         type: "password",
         name: "password",
         placeholder: "********",
       },
       {
         label: "Confirm Password",
         type: "password",
         name: "confirmPassword",
         placeholder: "********",
       },
       {
         label: "Location",
         type: "text",
         name: "location",
         placeholder: "Lagos, Nigeria",
       },
     ];
    return (
      <div className="bg-[#F3FAFA] flex flex-col min-h-screen pt-5 px-3 sm:px-4 lg:px-4 mx-auto w-full">
        <form className="form " onSubmit={handleSubmit}>
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
                value={input.name ? formData[input.name as keyof FormFields] : ''}
                onChange={handleChange}
                error={input.name ? errors[input.name as keyof FormFields] : undefined}
                // required
              />
              {input.name && errors[input.name as keyof FormFields] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[input.name as keyof FormFields]}
                </p>
              )}
            </div>
          ))}


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
