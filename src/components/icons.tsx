
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
export const SuperVolunteer: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    width="24"
    height="30"
    viewBox="0 0 24 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 0L24 5.33333V13.3333C24 20.7333 18.88 27.6533 12 29.3333C5.12 27.6533 0 20.7333 0 13.3333V5.33333L12 0ZM12 2.90667L2.66667 7.06667V13.6267C2.66667 19.3867 7 25.3333 12 26.6667C17 25.3333 21.3333 19.3867 21.3333 13.6267V7.06667L12 2.90667ZM17.3333 17.3333V19.3333V19.4533C17.28 19.7467 17.04 19.9467 16.7067 20H16.5733H7.42667H7.29333C6.96 19.9467 6.72 19.7467 6.66667 19.4533V19.3333V17.3333H17.3333ZM18.6667 9.33333L17.3333 16H6.66667L5.33333 9.33333L8.89333 12.8933L12 9.78667L15.1067 12.8933L18.6667 9.33333Z"
      fill="currentColor"
    />
  </svg>
);

export const OrganizationIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    width="24"
    height="30"
    viewBox="0 0 24 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.3333 2.66667V26.6667H13.3333V22H10.6667V26.6667H2.66667V2.66667H21.3333ZM16 8H18.6667V5.33333H16V8ZM10.6667 8H13.3333V5.33333H10.6667V8ZM5.33333 8H8V5.33333H5.33333V8ZM16 13.3333H18.6667V10.6667H16V13.3333ZM10.6667 13.3333H13.3333V10.6667H10.6667V13.3333ZM5.33333 13.3333H8V10.6667H5.33333V13.3333ZM16 18.6667H18.6667V16H16V18.6667ZM10.6667 18.6667H13.3333V16H10.6667V18.6667ZM5.33333 18.6667H8V16H5.33333V18.6667ZM16 24H18.6667V21.3333H16V24ZM5.33333 24H8V21.3333H5.33333V24ZM24 0H0V29.3333H24V0Z"
      fill="currentColor"
    />
  </svg>
);

export const HeartHandIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 1.64C20.9467 0.546667 22.1467 0 23.6 0C24.8133 0 25.8267 0.44 26.6667 1.33333C27.5067 2.22667 27.9467 3.24 28 4.4C28 5.33333 27.56 6.41333 26.6667 7.68C25.7733 8.94667 24.9067 10 24.04 10.8667C23.1733 11.72 21.8267 12.9867 20 14.6667C18.1467 12.9867 16.7867 11.72 15.92 10.8667C15.0533 10.0133 14.1733 8.94667 13.2933 7.68C12.4133 6.41333 12 5.33333 12 4.4C12 3.18667 12.4267 2.17333 13.2933 1.33333C14.16 0.493333 15.2 0.0533333 16.4133 0C17.84 0 19.0267 0.546667 20 1.64ZM28 22.6667V24L17.3333 27.3333L8 24.7467V26.6667H0V12H10.6267L18.84 15.0667C20.3333 15.6267 21.3333 17.0667 21.3333 18.6667H24C26.2133 18.6667 28 20.4533 28 22.6667ZM5.33333 24V14.6667H2.66667V24H5.33333ZM25.2 22.0933C24.9867 21.6533 24.52 21.3333 24 21.3333H16.8667C16.1467 21.3333 15.44 21.2267 14.76 21L11.5867 19.9467L12.4267 17.4133L15.6 18.4667C16 18.6 18.6667 18.6667 18.6667 18.6667C18.6667 18.1733 18.36 17.7333 17.9067 17.56L10.1467 14.6667H8V22L17.2933 24.5467L25.2 22.0933Z"
      fill="currentColor"
    />
  </svg>
);


