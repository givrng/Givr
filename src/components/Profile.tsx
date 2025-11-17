// import ProfileAchievements from "./ProfileAchievement";

import Certifications from "./Volunteer/Certifications";

// import { BadgeIcon } from "./icons";



// const data = [
//   {
//     id: 1,
//     title: "Frontend Developer",
//     company: "TechCorp Ltd",
//     earned: "2025-11-10",
//     verified: true,
//     hoursContributed: 5,
//     companyIndustries: ["Technology", "Education"],
//     userName: "Habib Yusuf",
//     role: "super volunteer",
//   },
//   {
//     id: 2,
//     title: "Graphic Designer",
//     company: "Designify Studios",
//     earned: "2025-11-10",
//     verified: true,
//     hoursContributed: 7,
//     companyIndustries: ["Technology", "Education"],
//     userName: "Habib Yusuf",
//     role: "super volunteer",
//   },
//   {
//     id: 3,
//     title: "UI/UX Designer",
//     company: "SoftBridge",
//     earned: "2025-11-10",
//     verified: true,
//     hoursContributed: 5,
//     companyIndustries: ["Technology", "Education"],
//     userName: "Habib Yusuf",
//     role: "super volunteer",
//   },
// ];



// const sampleProfile= {
//   id: 1,
//   name: "Habib Yusuf",
//   avatar: "/user.png",
//   location: "Abuja, Nigeria",
//   rating: 4,
//   skills: [
//     "React",
//     "TypeScript",
//     "TailwindCSS",
//     "TailwindCSS",
//     "TailwindCSS",
//     "TailwindCSS",
//     "TailwindCSS",],
//   interests: ["Frontend", "UI/UX", "Mobile Dev"],
//   phoneVerified: true,
//   emailVerified: true,
//   role: "Volunteer",
// };

// const sampleBadges = [
//   {
//     id: 1,
//     icon: <BadgeIcon  />,
//     description: "Community Helper",
//     earned: true,
//   },
//   {
//     id: 2,
//     icon: <BadgeIcon />,
//     description: "Community Helper",
//     earned: false,
//   },
//   {
//     id: 3,
//     icon: <BadgeIcon />,
//     description: "Community Helper",
//     earned: false,
//   },
//   {
//     id: 4,
//     icon: <BadgeIcon />,
//     description: "Community Helper",
//     earned: false,
//   },
// ];

export default function ProfilePage() {
  return (
      <div className="p-6 space-y-6 flex flex-col justify-center items-center">
              {/* <ProfileAchievements
      profile={sampleProfile}
      badges={sampleBadges}
      onEditProfile={() => console.log("Edit clicked")}
    /> */}
    <Certifications
    data={null}
      onDownload={() => console.log("download clicked")}
          />
        </div>
  );
}
