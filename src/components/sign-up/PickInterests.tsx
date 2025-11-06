
import type { BasicNatigationProps } from "../../interface/interfaces";
import { Button } from "../landingPageComponents";
import { useState } from "react";
type interestprops = {
    title: string;
    items: string[];
}


const PickInterests: React.FC<BasicNatigationProps> = ({onToSignIn}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // const location = useLocation();
  // const {volunteerId} = location.state
  const interestCategories: interestprops[] = [
    {
      title: "Creative & Media",
      items: [
        "Graphic Design",
        "UX/UI Design",
        "Photography",
        "Video Editing",
        "Animation / Illustration",
        "Content Creation",
        "Copywriting",
        "Storytelling & Journalism",
        "Podcast Production",
        "Film & Documentary Production",
        "Creative Writing",
        "Art & Mural Projects",
        "Music & Performing Arts",
        "Event Hosting / MC",
      ],
    },
    {
      title: "Tech & Digital Skills",
      items: [
        "Web Development",
        "Product Design",
        "Data Analysis",
        "Social Media Management",
        "Marketing & Communications",
        "Project Management",
        "Customer Support",
        "Research & Documentation",
      ],
    },
    {
      title: "Business, Leadership & Operations",
      items: [
        "Fundraising",
        "Grant Writing",
        "Financial Literacy / Accounting",
        "Legal Support",
        "Event Planning",
        "Public Speaking",
        "Team Leadership",
        "Strategic Planning",
      ],
    },
    {
      title: "Community Development & Social Impact",
      items: [
        "Youth Mentorship",
        "Women Empowerment",
        "Child Education",
        "Poverty Alleviation",
        "Homelessness Relief",
        "Food Distribution",
        "Senior Care / Elderly Support",
        "Rural Development",
        "Human Rights Advocacy",
        "Civic Engagement",
        "Refugee & IDP Support",
        "Diversity & Inclusion",
        "Skill Acquisition / Vocational Training",
      ],
    },
    {
      title: "CHealth & Wellness",
      items: [
        "Mental Health Support",
        "Health & Wellness Promotion",
        "Public Health Education",
        "Disability Support",
        "First Aid & Emergency Response",
      ],
    },
    {
      title: "Environment & Sustainability",
      items: [
        "Environmental Awareness",
        "Tree Planting",
        "Recycling & Waste Management",
        "Climate Action Campaigns",
        "Wildlife Conservation",
        "Sustainable Agriculture",
        "Clean Water Projects",
        "Renewable Energy Advocacy",
        "Urban Gardening",
        "Eco-Product Design",
      ],
    },
  ];

  // Toggle selection
  const handleSelect = (item: string): void => {
    setSelectedInterests(
        (prev: string[]) =>
            prev.includes(item)
                ? prev.filter((interest: string) => interest !== item) // remove if already selected
                : [...prev, item] // add if not selected
  );};
  
  const handleSubmit = ():void=>{
    // make a patch request to add interests for volunteer

    if(onToSignIn)
      onToSignIn()
  }
  
  return (
    <div className=" flex flex-col justify-center items-center  min-h-screen pt-5 px-3 sm:px-4 lg:px-4 mx-auto w-full text-[#323338] ">
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
                                className={`border border-ui px-5  sm:text-lg text-sm rounded-2xl cursor-pointer  text-[#323338] hover:bg-(--primary-color) hover:text-white  ${isSelected ? "bg-(--primary-color) text-white" : "text-[#323338] bg-white"}`}
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
      <div className="flex justify-center space-x-3 w-full">
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
          Next
        </Button>
      </div>

      {/* A user that has an account should not get to the pick interest stage */}
      {/* <span className="text-base text-[#676879] my-6 ">
        Already have an account?
        <a href="signin" className="text-[#323338] font-bold ml-2 ">
          SignIn here
        </a>
      </span> */}
    </div>
  );
}
export default PickInterests