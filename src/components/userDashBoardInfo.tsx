import { GivrRoundLogo } from "./icons";
import { RadioButton } from "./ReuseableComponents";

const UserDashboardInformation:React.FC<{username:string; buttons:Array<string>; activeButton:string; onClick: (event: React.MouseEvent<HTMLButtonElement>)=>void}> = ({username, buttons,activeButton, onClick})=>{

    {/* Displays welcome message */}
    const WelcomeBanner = ()=><>
    <div className="p-4 flex gap-2"> 
        <div className="flex flex-col mb-2">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Welcome back, <span className="text-gray-900">{username}!</span>
            </h1>
            <p className="text-lg text-gray-600">Ready to make some impact today?</p>
        </div>
        
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 p-1">
            <GivrRoundLogo/>
        </div>
    </div>
    </>

    {/* Navigation*/}
    const NavigationBar: React.FC<{buttons:Array<string>; active:string; onclick:(event:React.MouseEvent<HTMLButtonElement>)=>void}> = ({buttons, active, onclick}) => {
        return (
            <div className="w-full flex justify-center mb-3">
                <nav className="w-full bg-[#E7E9EF] rounded-xl shadow-inner-sm">
                    <div className="flex justify-evenly gap-x-1">
                        {buttons.map((label) => (
                        <RadioButton
                            key={label}
                            active={active === label}
                            onClick={onclick}
                        >
                            {label}
                        </RadioButton>
                        ))}
                    </div>
                </nav>
            </div>
                );
            };
    
        return <>
                <WelcomeBanner/>
                <NavigationBar buttons={buttons} active={activeButton} onclick={onClick}/>
        </>
}

export default UserDashboardInformation;