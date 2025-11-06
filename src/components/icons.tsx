
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
import arrowIcon from "../assets/icons/arrow.svg"
// Simplified Icon for Verified/Checkmark Logo


export const GivrLogoIcon:React.FC<{className?:string}> = ({className = "h-6 w-auto max-w-full"}): React.JSX.Element => <img src={givrLogo} alt="Givr Logo" className={className}/>
export const GivrRoundLogo:React.FC<{className?:string, color?:string}> = ({className="w-6 h-6", color="#1A73E8"})=>(
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect className={className} rx="12" fill="#DAF0FF"/>
<g clip-path="url(#clip0_355_13176)">
<path d="M7.60547 18.113L19.1106 9.5332" stroke={color} stroke-width="1.51798" stroke-miterlimit="10"/>
<path d="M13.0872 9.34377L10.4958 5.63882C9.62408 4.393 7.81877 4.94164 7.40675 6.5778L5.03328 16.0109C4.57789 17.8228 6.22706 19.1705 7.60517 18.1133" stroke={color} stroke-width="1.51798" stroke-miterlimit="10"/>
<path d="M15.9648 14.5449L18.0044 17.1786" stroke={color} stroke-width="1.51798" stroke-miterlimit="10"/>
</g>
<defs>
<clipPath id="clip0_355_13176">
<rect width="16" height="16" fill="white" transform="translate(4 4)"/>
</clipPath>
</defs>
</svg>
)
export const CheckmarkLogoIcon: React.FC<{ className?: string, color?: string }> = ({ className = "w-7 h-7" }) => (
  <img src={blueVerifiedIcon} alt="Verified Check mark Logo" className={className} />
);


export const VerifiedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img src={verifiedIcon} alt="Blue tick Icon" className={className} />
);

export const DigitalCertificate: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => <img src={digitalCertIcon} alt="Figital Certidicate Icon" className={className} />


export const ShieldIcon: React.FC<{ className?: string, fill?:string, color?:string}> = ({ className = "w-12 h-12", fill="#FFE0E1", color= "#FB2C36" }) => (<svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect className={className} rx="30" fill={fill}/>
<path d="M39 29C39 34.55 35.16 39.74 30 41C24.84 39.74 21 34.55 21 29V23L30 19L39 23V29ZM30 39C33.75 38 37 33.54 37 29.22V24.3L30 21.18L23 24.3V29.22C23 33.54 26.25 38 30 39ZM30 26.89C31.6 26.89 32.89 28.18 32.89 29.78C32.89 31.38 31.6 32.67 30 32.67C28.4 32.67 27.11 31.37 27.11 29.78C27.11 28.19 28.41 26.89 30 26.89ZM30 24L31.38 26C30.96 25.82 30.5 25.73 30 25.73C29.5 25.73 29.05 25.82 28.62 26L30 24ZM25 26.89L27.4 26.69C27.06 27 26.74 27.34 26.5 27.76C26.25 28.18 26.1 28.62 26 29.08L25 26.89ZM25 32.67L26.03 30.5C26.11 30.93 26.27 31.38 26.5 31.8C26.75 32.23 27.06 32.59 27.4 32.88L25 32.67ZM35 26.89L34 29.08C33.9 28.62 33.74 28.18 33.5 27.76C33.26 27.34 32.95 27 32.6 26.68L35 26.89ZM35 32.67L32.6 32.87C32.94 32.58 33.25 32.22 33.5 31.8C33.74 31.38 33.89 30.93 33.97 30.5L35 32.67ZM30 35.55L28.61 33.57C29.04 33.72 29.5 33.82 30 33.82C30.5 33.82 30.95 33.72 31.37 33.57L30 35.55Z" fill={color}/>
</svg>


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

export const StarIcon: React.FC<{ className?: string; color?:string; fill?:string}> = ({ className = "w-10 h-10", color = "#FBBC05", fill= "#FFFBC6" }) => (<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect className={className} rx="30" fill={fill}/>
<path d="M30 35.27L36.18 39L34.54 31.97L40 27.24L32.81 26.62L30 20L27.19 26.62L20 27.24L25.45 31.97L23.82 39L30 35.27Z" fill={color}/>
</svg>

);

export const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <img src={recognitionIcon} className={className} />
);

export const GoogleIcon: React.FC <{className?:string}> = ({className= "w-6 h-6"})=>(
  <img src={googleIcon} alt="Google Logo Icon" className={className}/>
)
export const ArrowIcon:React.FC<{className?:string}>= ({className= "w-8 h-8"})=>(
  <img src={arrowIcon} alt="Arrow Icon" className={className}></img>
)

export const ClockIcon:React.FC<{className?:string, color?:string}> = ({className = "w-8 h-8", color="#1A73E8"}):React.JSX.Element=>(
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.33333 5.33366H8.66667V9.33366H7.33333V5.33366ZM10 0.666992H6V2.00033H10V0.666992ZM8 13.3337C5.42 13.3337 3.33333 11.247 3.33333 8.66699C3.33333 6.08699 5.42 4.00033 8 4.00033C10.58 4.00033 12.6667 6.08699 12.6667 8.66699C13.1333 8.66699 13.5733 8.75366 14 8.90033C14 8.82033 14 8.74699 14 8.66699C14 7.25366 13.5067 5.95366 12.6867 4.92699L13.6333 3.98033C13.3333 3.64033 13.0333 3.33366 12.6933 3.04033L11.7467 4.00033C10.7133 3.16033 9.41333 2.66699 8 2.66699C4.68667 2.66699 2 5.35366 2 8.66699C2 11.9803 4.68667 14.667 8 14.667C8.39333 14.667 8.77333 14.627 9.14 14.5537C8.93333 14.167 8.78667 13.7337 8.72 13.2737C8.48 13.307 8.24667 
        13.3337 8 13.3337ZM14.2267 10.5603L11.8333 12.9537L10.7733 11.8937L10 12.667L11.8333 14.667L15 11.5003L14.2267 10.5603Z" fill={color}/>
    </svg>
)

export const CalendarIcon:React.FC<{className?:string, color?: string}> = ({className ="w-6 h-6", color= "#676879"})=>(
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 19H5V8H19M16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 3.89 20.1 3 19 3H18V1" fill={color}/>
</svg>
)

export const LocationIcon: React.FC<{className?:string, color?: string}> = ({className ="w-6 h-6", color= "#676879"})=>(<svg className={className} viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 4.5C7.66304 4.5 8.29893 4.76339 8.76777 5.23223C9.23661 5.70107 9.5 6.33696 9.5 7C9.5 7.3283 9.43534 7.65339 9.3097 7.95671C9.18406 8.26002 8.99991 8.53562 8.76777 8.76777C8.53562 8.99991 8.26002 9.18406 7.95671 9.3097C7.65339 9.43534 7.3283 9.5 7 9.5C6.33696 9.5 5.70107 9.23661 5.23223 8.76777C4.76339 8.29893 4.5 7.66304 4.5 7C4.5 6.33696 4.76339 5.70107 5.23223 5.23223C5.70107 4.76339 6.33696 4.5 7 4.5ZM7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 12.25 7 20 7 20C7 20 0 12.25 0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0ZM7 2C5.67392 2 4.40215 2.52678 3.46447 3.46447C2.52678 4.40215 2 5.67392 2 7C2 8 2 10 7 16.71C12 10 12 8 12 7C12 5.67392 11.4732 4.40215 10.5355 3.46447C9.59785 
2.52678 8.32608 2 7 2Z" fill={color}/>
</svg>
)

export const GroupIcon: React.FC<{className?:string, color?: string}> = ({className ="w-6 h-6", color= "#676879"})=>(<svg className={className} viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.07 6.41005C11.6774 5.56132 12.0041 4.54377 12.0041 3.50005C12.0041 2.45634 11.6774 1.43879 11.07 0.590053C11.6385 0.202008 12.3117 -0.00378014 13 5.2579e-05C13.9283 5.2579e-05 14.8185 0.368802 15.4749 1.02518C16.1313 1.68156 
16.5 2.57179 16.5 3.50005C16.5 4.42831 16.1313 5.31855 15.4749 5.97493C14.8185 6.6313 13.9283 7.00005 13 7.00005C12.3117 7.00389 11.6385 6.7981 11.07 6.41005ZM3.5 3.50005C3.5 2.80782 3.70527 2.13113 4.08986 1.55556C4.47444 0.979985 5.02107 0.531381 5.66061
 0.266474C6.30015 0.00156766 7.00388 -0.067744 7.68282 0.0673043C8.36175 0.202353 8.98539 0.535695 9.47487 1.02518C9.96436 1.51466 10.2977 2.1383 10.4327 2.81724C10.5678 3.49617 10.4985 4.1999 10.2336 4.83944C9.96867 5.47899 9.52007 6.02561 8.9445 6.4102C8.36892 
 6.79478 7.69223 7.00005 7 7.00005C6.07174 7.00005 5.1815 6.6313 4.52513 5.97493C3.86875 5.31855 3.5 4.42831 3.5 3.50005ZM5.5 3.50005C5.5 3.79672 5.58797 4.08673 5.7528 4.33341C5.91762 4.58008 6.15189 4.77234 6.42597 4.88587C6.70006 4.9994 7.00166 5.02911 7.29264 4.97123C7.58361 4.91335
  7.85088 4.77049 8.06066 4.56071C8.27044 4.35093 8.4133 4.08366 8.47118 3.79269C8.52906 3.50172 8.49935 3.20012 8.38582 2.92603C8.27229 2.65194 8.08003 2.41767 7.83335 2.25285C7.58668 2.08803 7.29667 2.00005 7 2.00005C6.60218 2.00005 6.22064 2.15809 5.93934 2.43939C5.65804 2.7207 5.5 3.10223 5.5 3.50005ZM14 13.0001V15.0001H0V13.0001C0 13.0001 0 9.00005 7 9.00005C14 9.00005 14 13.0001 14 13.0001ZM12 13.0001C11.86 12.2201 10.67 11.0001 7 11.0001C3.33 11.0001 2.07 12.3101 2 13.0001M13.95 9.00005C14.5629 9.47678 15.064 10.0819 15.4182 10.7729C15.7723 11.4639 15.9709 12.2241 16 13.0001V15.0001H20V13.0001C20 13.0001 20 9.37005 13.94 9.00005H13.95Z" fill={color}/>
</svg>
)

export const BriefcaseIcon:React.FC<{className?:string; color?:string;}> = ({className="w-6 h-6", color="#34A853"})=><svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.333 3.99967C13.7197 3.99967 14.033 4.13301 14.2797 4.39301C14.533 4.66634 14.6663 4.96634 14.6663 5.33301V12.6663C14.6663 13.033 14.533 13.333 14.2797 13.6063C14.033 13.8663 13.7197 13.9997 13.333 13.9997H2.66634C2.27967 13.9997 1.96634 13.8663 1.71967 13.6063C1.46634 13.333 1.33301 13.033 1.33301 12.6663V5.33301C1.33301 4.96634 1.46634 4.66634 1.71967 4.39301C1.96634 4.13301 2.27967 3.99967 2.66634 3.99967H5.33301V2.66634C5.33301 2.27967 5.46634 1.96634 5.71967 1.71967C5.96634 1.46634 6.27967 1.33301 6.66634 1.33301H9.33301C9.71967 1.33301 10.033 1.46634 10.2797 1.71967C10.533 1.96634 10.6663 2.27967 10.6663 2.66634V3.99967H13.333ZM2.66634 5.33301V12.6663H13.333V5.33301H2.66634ZM9.33301 3.99967V2.66634H6.66634V3.99967H9.33301Z" fill={color}/>
</svg>
