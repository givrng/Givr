
import verifiedIcon from "../assets/icons/check-decagram.svg"
import givrLogo from "../assets/icons/givr-icon.svg"
import digitalCertIcon from "../assets/icons/digital-cert.svg"
import trustIssueIcon from "../assets/icons/trustIssue.svg"
import discoverIcon from "../assets/icons/discover.svg"
import recognitionIcon from "../assets/icons/recognition.svg"
import groupIcon from "../assets/icons/group.svg"
import blueVerifiedIcon from "../assets/icons/blue-tick-badge.svg"
import ratingIcon from "../assets/icons/shield.svg"
import roundCert from "../assets/icons/round-cert.svg"
import bulletPointIcon from "../assets/icons/radiobox-marked.svg"
import googleIcon from "../assets/icons/google.svg"
// Simplified Icon for Verified/Checkmark Logo


export const GivrLogoIcon:React.FC<{className?:string}> = ({className = "h-6 w-auto max-w-full"}): React.JSX.Element => <img src={givrLogo} alt="Givr Logo" className={className}/>

export const CheckmarkLogoIcon: React.FC<{ className?: string, color?: string }> = ({ className = "w-7 h-7" }) => (
  <img src={blueVerifiedIcon} alt="Verified Check mark Logo" className={className} />
);


export const VerifiedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img src={verifiedIcon} alt="Blue tick Icon" className={className} />
);

export const DigitalCertificate: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => <img src={digitalCertIcon} alt="Figital Certidicate Icon" className={className} />


export const ShieldIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img src={trustIssueIcon} alt="Sheild icon" className={className} />
);

export const RoundDigitalCert: React.FC <{className?:string}> = ({className="w-12 h-12"})=>(
  <img src={roundCert} alt="Rounded certificate badge" className={className} />
)
export const SearchTimeIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img src={discoverIcon} alt='Search icon' className={className} />
);

export const GreenCheck: React.FC <{className?:string}> = ({className = "w-9 h-9"})=>(
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
<path d="M15.3337 8.00001L13.707 6.14667L13.9337 3.69334L11.527 3.14667L10.267 1.02667L8.00033 2.00001L5.73366 1.02667L4.47366 3.14667L2.06699 3.68667L2.29366 6.14001L0.666992 8.00001L2.29366 9.85334L2.06699 12.3133L4.47366 12.86L5.73366 14.98L8.00033 14L10.267 14.9733L11.527 12.8533L13.9337 12.3067L13.707 9.85334L15.3337 8.00001ZM6.66699 11.3333L4.00033 8.66667L4.94033 7.72667L6.66699 9.44667L11.0603 5.05334L12.0003 6.00001L6.66699 11.3333Z" fill="#34A853"/>
</svg>

)

export const YelloBadge: React.FC<{className?:string}> = ({className = "w-9 h9"})=>(
  <svg width="16" height="16" className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.66667 11.3334L4 8.66669L4.94 7.72669L6.66667 9.44669L11.06 5.05335L12 6.00002M8 0.666687L2 3.33335V7.33335C2 11.0334 4.56 14.4934 8 15.3334C11.44 14.4934 14 11.0334 14 7.33335V3.33335L8 0.666687Z" fill="#FBBC05"/>
</svg>)

export const BulletIcon:React.FC <{className?:string}> = ({className="w-9 h-9"})=>(
  <img src={bulletPointIcon} className={className} alt="Bullet icon" />
)

export const FileXIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img src={recognitionIcon} alt="Digital certificate icon" className={className} />
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <img src={groupIcon} alt="Group of users icon" className={className} />
);

export const StarIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <img src={ratingIcon} alt="Star rating icon" className={className} />
);

export const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img src={recognitionIcon} className={className} />
);

export const GoogleIcon: React.FC <{className?:string}> = ({className= "w-6 h-6"})=>(
  <img src={googleIcon} alt="Google Logo Icon" className={className}/>
)