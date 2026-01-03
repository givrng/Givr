import type { BasicNatigationProps } from "../../interface/interfaces";
import { Button } from "../ReuseableComponents";
import { useState } from "react";
import { useSignup } from "../Volunteer/sign-up/SignupContext";
import { LoadingEffect } from "../icons";
import { useAlert } from "../hooks/useAlert";
import { interestCategories } from "../interest";


const PickInterests: React.FC<{nav: BasicNatigationProps, back:()=>void, selectedInterests:string[], setSelectedInterests:(e:React.SetStateAction<string[]>)=>void}> = ({nav, back, selectedInterests, setSelectedInterests}) => {
  
  const usesignup = useSignup()
  const [isLoading, setIsloading] = useState(false)
  const {alertMessage, AlertDialog} = useAlert({})

  // Toggle selection
  const handleSelect = (item: string): void => {
    setSelectedInterests(
        (prev: string[]) =>
            prev.includes(item)
                ? prev.filter((interest: string) => interest !== item) // remove if already selected
                : [...prev, item] // add if not selected
  );};
  
  const handleSubmit = async ()=>{
    setIsloading(true)
    // make a patch request to add interests for volunteer
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      ...usesignup?.formData,
      interests: selectedInterests
    }

    const response = await fetch(`${baseUrl}/volunteer/auth/signup`, {
      method: 'POST', 
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }
    )
    console.log(payload)
  
    if(response.ok && nav.onToSignIn){
      nav.onToSignIn()
    }else{
      alertMessage("Account Creation failed, please try again")
      setIsloading(false) 
    }
    
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
    <div className="flex flex-col justify-center items-center min-h-screen px-4 mx-auto w-full max-w-4xl text-[#323338]">
      <AlertDialog/>
      
       {/* Header */}
    <div className="text-center mb-6">
      <h1 className="md:text-5xl sm:text-3xl text-xl font-bold">
        Select your skills & interests
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        Choose at least one — this helps us personalize your experience
      </p>

      {/* Selected count */}
      <div className="mt-3 text-sm font-medium text-[#323338]">
          Selected:{" "}
          <span className="text-(--primary-color)">
            {selectedInterests.length}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full space-y-6 ">
        {interestCategories.map((category, index) => (
          <div key={index}
            className="bg-white rounded-2xl p-5 shadow-sm border border-ui"
          >
          <h3 className="sm:text-xl text-base font-semibold mb-3">
            {category.title}
          </h3>

          <div className="flex flex-wrap gap-3">
                    {category.items.map((item, i) => {
                      const isSelected = selectedInterests.includes(item);
                        return (
                          <button
                            onClick={() => handleSelect(item)}
                            key={i}
                            className={`
                              px-4 py-2 rounded-full text-sm sm:text-base
                              transition-all duration-150
                              ${
                                isSelected
                                  ? "bg-(--primary-color) text-white shadow-md scale-[1.03]"
                                  : "bg-gray-100 text-gray-700 hover:bg-(--primary-color)/10"
                              }
                            `}
                          >
                            {item}
                          </button>
                        );
                    })}
            </div>
          </div>
        ))}
      </div>

       {/* Actions */}
      <div className="flex justify-center mt-8 mb-4 space-x-3 w-full">
        {/* User should provide their interest, it is required for recommendation */}
        <Button
          variant="outline"
          className="text-sm px-4 py-2 sm:w-60 w-full"
          onClick={back}
        >
          Back
        </Button>
        <Button
          variant={selectedInterests.length == 0? "disabled":"primary"}
          className="text-sm px-4 py-2 sm:w-60 w-full "
          onClick={handleSubmit}

        >
          {isLoading? <LoadingEffect message="Creating Account..."/>: "Create Account"}
        </Button>
      </div>
    </div>
  </div>
  );
}
export default PickInterests