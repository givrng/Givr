import type { ReactNode } from "react";

export interface NavLinkProps {
  label: string;
  href: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline'| 'green'|'disabled'|'void'|'danger';
  onClick?: (E?:React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export interface FeatureCardProps {
  title: string;
  description: string | Array<string>;
  icon?: React.ReactNode;
  color: 'red' | 'green' | 'yellow' | 'blue' | 'lock';
  cta?:string
  action?:()=>void
}

export interface Cards {
    icon?: string;
    header: string;
    content: string | string[]
}

export interface LabeledIcon {
    icon: string;
    label: string;
    altText: string
}

// Sign in
export interface SignInFormProps extends BasicNatigationProps {
    onSignInAttempt: (email: string, pass: string) => Promise<boolean>;

}

export interface BasicNatigationProps{
  onToSignUp?: ()=> void;
  onToSignIn?: ()=> void
  onToInterest?:()=>void;
  onToDashboard?: ()=>void;
  onToVolunteerSignUp?: ()=>void;
  onToOrgSignUp?:()=>void;
  toForgotPassword?:string;
  toSignUp?:string;
  toVolunteerDetails?:string;
  toDashBoard?:string;
  toOppurtunities?:string;

  isOrganization?:boolean;
}
export interface MetricProps{
  title: string;
  icon: ReactNode;
  value: string;
  context: string;
  color?:string;
  projects?:VolunteerProjectApplicationProps[]
}

export interface MetricComponentProps extends MetricProps{
  className?:string
}

export interface location{
  state:string;
  lga:string;
}

export interface ProjectProps{
  id: number;
  title: string;
  organization?:OrganizationProps;
  status: "OPEN" | "ONGOING" | "COMPLETED"| "DRAFT";
  startDate: string;
  endDate:string;
  attendanceHours: {
    from:string;
    to:string;
  };
  location: location;
  totalApplicants: number;
  maxVolunteers: number;
  categories: string[];
  superVolunteer?:string;
  applicationDeadline:string;
  description?:string;
  specialRequirements:string;
  requiredSkills:string[];
  createdAt:string;
  updatedAt:string;
  }

export interface ProjectFormProps{
  id?:number;
  title:string;
  description:string;
  category:string;
  maxVolunteers:number;
  startDate:string;
  endDate:string;
  attendanceHours:{
    from:string;
    to:string;
  };
  applicationDeadline:string;
  location: {
    state:string;
    lga:string;
  }
  requiredSkills:string[];
  specialRequirements:string;
  
}

export interface ProjectComponentProps extends ProjectProps{
  className?:string;
  manage?:boolean;
  applied?:boolean;
  isDraft?:boolean;
  isOrganization?:boolean;
  onDelete?:(projectId:number, title:string)=>void;
  onEdit?:(prj:ProjectProps)=>void;
  onPublish?:(projectId:number, title:string)=>void;
}

export interface OrganizationProps{
  name?: string;
  description?:string;
  location?:location;
  category?:string[];
  status?: "VERIFIED" | "UNVERIFIED";
  numOfActiveProjects?:number;
  website?:string;
  address?:string;
  activeProjects?: ProjectProps[]
  cacRegNumber?:string;
  rating?:number;
  profileCompleted?:boolean;
  profileUrl?:string;
}

export interface OrgContantProfileProps{
  contactFirstname:string;
  contactLastname:string;
  contactMiddleName:string;
  phoneNumber:string;
  email:string;
  emailVerified:boolean;
}
export interface OrganizationProfileProps{
  organizationContact: OrgContantProfileProps;
  organization: OrganizationProps;
}

export interface MyCertificationProps {
  id?: string;
  title?: string;
      organization?: OrganizationProps;
  earned?: string;
  hoursContributed?: number;
  userName?: string;
  role?: string;
}
export interface MyVolunteeringProps {
  id?: string;
  organization?: OrganizationProps;
  project?:ProjectProps;
  status?: "IN_PROGRESS" | "COMPLETED";
  rating?:string;
}


export interface ProfileProps {
  id?: string;
  firstname?: string;
  middleName?:string;
  lastname?:string;
  profileUrl?: string;
  location?: location;
  rating?: string | number | undefined;
  skills: string[];
  interests?: string[];
  phoneIsVerified?: boolean;
  emailIsVerified?: boolean;
  role?: "VOLUNTEER"|"ORGANIZATION";
  email?:string;
};

export interface BadgeProps {
  id: number;
  icon: React.ReactNode;
  description: string;
  earned?: boolean;
};


export interface OrganizationComponentProps extends OrganizationProps{
  hasVolunteered?:boolean
}


export interface DashboardProps{
  metrics?: MetricProps[];
  projects?: ProjectProps[];
  className?:string
  triggerAction?:(action:VolunteerQuickActions)=>void
  orgTriggerAction?: (action: OrganizationQuickActions)=>void
  hasMounted:()=>void;
}


export type NavTypes = "Dashboard" | "Find Opportunities"| "My Volunteering"| "Profile & Achievements";
export type VolunteerQuickActions = "Find Opportunities"| "View Organizations" | "Update Profile"|""

export type OrganizationNavTypes = "Dashboard"| "Project Management" | "Applications" | "Profile"
export type OrganizationQuickActions = "Create New Project"| "Review pending applications"| "Edit Profile"

export interface VolunteerProfileProps{
  firstName:string;
  lastName:string;
  middleName:string;
  email:string;
  location:location;
  phoneNumber:string;
  skills:string[]
  profileUrl:string;
}

export interface FormDataProps{
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: {
    state: string;
    lga:string;
  }
  interests: string[];
  profileUrl:string;
}


export interface VolunteerProjectApplicationProps{
  id:number;
  volunteer:number;
  project:number;
  status:'APPLIED'|"APPROVED"|"REJECTED";
  title?:string;
  appliedAt:string;
}

export interface VolunteerDashboardProps{
  firstname:string;
  projectApplications:VolunteerProjectApplicationProps[]
}
interface skillProps{
  name:string;
}

export interface VolunteerProps{
  volunteerId:string;
  firstName?:string;
  middleName:string;
  lastname:string;
  phoneNumber:string;
  email:string;
  skills:skillProps[];
}

export interface ProjectApplicationProps{
  id: number;
  project:ProjectProps;
  status: string;
  appliedAt:string;
  applicationReason:string;
  availableDays:string;
}

export interface VolunteerApplicationProps{
  firstname:string;
  lastname:string;
  skills:string[];
  projectApplied: VolunteerProjectApplicationProps
}

export type organizationType = "NGO/Non profit" | "Community Group" | "Religious Group"| "Educational Institution" | "Government Agency"|"Corporate Foundation"|""

export interface OrganizationSignupProps{
  email:string;
  password:string;
  confirmPassword:string;
  contactFirstname:string;
  contactLastname:string;
  contactMiddleName:string;
  phoneNumber:string;

  location: {
    state:string;
    lga:string;
  }
  address:string;
  organizationName:string;
  organizationType:organizationType;
  cacRegNumber:string;
  driversLicenseNumber:string;
  description:string;
}

export interface ProjectMap {
  draftProjects: ProjectProps[];
  openProjects: ProjectProps[];
  ongoingProjects: ProjectProps[];
  completedProjects: ProjectProps[]; 
}

export const projectStatuses= ["DRAFT", "OPEN", "ONGOING", "COMPLETED"] as const


export interface OrganizationDashboardProps {
  name:string;
  projects: ProjectMap;
  rating: number;
  applicationStats: {
    numApplied:number;
    numApproved:number;
    numRejected:number;
  }
  isRestricted:boolean;
}

export type UserTypes = "volunteer"|"organization"|"";

export type OtpPurpose = "EMAIL_VERIFICATION" | "PASSWORD_UPDATE"