import type { BasicNatigationProps } from "../../interface/interfaces";
import { Button } from "../ReuseableComponents";
import { useState } from "react";
import { useSignup } from "../Volunteer/sign-up/SignupContext";
import { LoadingEffect } from "../icons";
import { useAlert } from "../hooks/useAlert";
import { interestCategories } from "../interest";


const PickInterests: React.FC<BasicNatigationProps> = ({onToSignIn}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const usesignup = useSignup()
  const [isLoading, setIsloading] = useState(false)
  const {alertMessage, AlertDialog} = useAlert()

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
    const baseUrl = import.meta.env.VITE_API_BASE_VOLUNTEER_URL
    const payload = {
      ...usesignup?.formData,
      interests: selectedInterests
    }

    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST', 
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }
    )
    console.log(payload)
  
    if(response.ok && onToSignIn){
      onToSignIn()
    }else{
      alertMessage("Account Creation failed, please try again")
      setIsloading(false) 
    }
    
  }
  
  return (
    <div className=" flex flex-col justify-center items-center  min-h-screen pt-5 px-3 sm:px-4 lg:px-4 mx-auto w-full text-[#323338]">
      <AlertDialog/>
      <h1 className="md:text-5xl sm:text-3xl text-xl  text-center">
        Select your skills and interests
      </h1>
      <div className="form  border-none shadow-none ">
        {interestCategories.map((category, index) => (
          <div key={index}>
            <h3 className="sm:text-2xl text-base font-semibold text-[#323338] mb-2">
              {category.title}
            </h3>

            <div className="flex flex-wrap gap-2">
                    {category.items.map((item, i) => {
                      const isSelected = selectedInterests.includes(item);
                        return (
                          <span
                            key={i}
                                className={`rounded-xl p-2 sm:text-lg text-sm rounded-2xl cursor-pointer  text-[#323338] hover:bg-(--primary-color) hover:text-white  ${isSelected ? "bg-(--primary-color) text-white" : "text-[#323338] bg-gray-200"}`}
                            onClick={() => handleSelect(item)}
                          >
                            <p>{item}</p>
                          </span>
                        );
                    })}
            </div>
            <hr className="border border-ui mt-5" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-2 space-x-3 w-full">
        {/* User should provide their interest, it is required for recommendation */}
        {/* <Button
          variant="outline"
          className="text-sm px-4 py-2 shadow-none sm:w-60 w-full "
          onClick={onBackToSignIn}
        >
          skip
        </Button> */}
        <Button
          variant="primary"
          className="text-sm px-4 py-2 shadow-none sm:w-60 w-full "
          onClick={handleSubmit}
        >
          {isLoading? <LoadingEffect message="Creating Account..."/>: "Create Account"}
        </Button>
      </div>

      {/* A user that has an account should not get to the pick interest stage */}
      {/* <span className="text-base text-[#676879] my-6 ">
        Already have an account?
        <Link to="signin" className="text-[#323338] font-bold ml-2 ">
          SignIn here
        </a>
      </span> */}
    </div>
  );
}
export default PickInterests