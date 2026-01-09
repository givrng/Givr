import type { BadgeProps, ProfileProps } from "../interface/interfaces";
import { Button } from "./ReuseableComponents";
interface ProfileAchievementsProps {
  profile: ProfileProps;
  badges: BadgeProps[];
  onEditProfile: () => void;
}

export default function ProfileAchievements({
    profile,
  badges,
  onEditProfile,
}: ProfileAchievementsProps) {
  return (
    <div className=" grid lg:grid-cols-6 gap-8 w-full ">
      {/* ------------------ Profile Section ------------------ */}
      <div className="border border-ui rounded-2xl  p-6 col-span-4">
        <h2 className="text-xl text-[#323338] font-semibold mb-4">
          Profile Information
        </h2>

        <div className="flex flex-col  md:items-start gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <img
              src={profile.profileUrl}
              alt={profile.firstname}
              className="w-28 h-28 rounded-full object-cover border"
            />

            {/* Info */}

            <div>
              
              <h3 className="text-lg font-semibold">{profile.lastname}</h3>
              <h3 className="text-lg font-semibold">{profile.firstname}</h3>
              <h3 className="text-lg font-semibold">{profile.middleName? profile.middleName:""}</h3>
              <span className="text-[#676879] text-sm">{profile.role}</span>
              <span className="text-[#676879] text-sm ml-2">
                {`${profile.location?.state}, ${profile.location?.lga}`}
              </span>
              {/* Rating */}
              <p className="text-yellow-500 text-sm">
                {profile.rating}
                <span className="text-gray-500 ml-1">({profile.rating}/5)</span>
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-base text-[#323338] font-medium">Interests</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs border border-ui rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          {/* <div>
            <p className="text-base text-[#323338] font-medium">Interests</p>
            <div className="flex flex-wrap gap-2 mt-1  ">
              {profile.interests?.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs border border-ui rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div> */}

          {/* Verification */}
          <div className="flex items-center gap-4 mt-3">
            <p
              className={`text-md text-white px-3 py-1 rounded-full ${
                profile.phoneIsVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-700"
              }`}
            >
              Phone {profile.phoneIsVerified ? "Verified" : "Not Verified"}
            </p>

            <p
              className={`text-md text-white px-3 py-1 rounded-full ${
                profile.emailIsVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-700"
              }`}
            >
              Email {profile.emailIsVerified ? "Verified" : "Not Verified"}
            </p>
          </div>

          {/* Edit Button */}
          <Button 
          variant="primary" className="w-[40%]"
          onClick={onEditProfile}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* ------------------ Achievement Section ------------------ */}
      <div className="border border-ui lg:col-span-2  col-span-4   rounded-2xl   p-6">
        <h2 className="text-base text-[#323338] font-semibold mb-4">
          Badges & Achievements
        </h2>

        <div className="grid  lg:grid-cols-2 sm:grid-cols-4 grid-cols-2 w-full gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col w-full  items-center p-4 rounded-xl   ${
                badge.earned
                  ? "border border-[#FFDB1E] bg-[#FFFDEA] font-semibold text-[#323338] "
                  : "border border-ui"
              } `}
            >
              <p
                className={`${
                  badge.earned
                    ? " bg-[#676879]  rounded-full mb-2"
                    : "  rounded-full mb-2"
                }`}
              >
                {badge.icon}
              </p>

              <p className="text-xs text-gray-500 text-center mt-1">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
