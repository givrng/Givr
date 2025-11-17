import type { ReactNode } from "react";

export interface NavLinkProps {
  label: string;
  href: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline'| 'green'|'disabled'|'void'|'danger';
  onClick?: () => void;
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

interface location{
  state:string;
  lga:string;
}

export interface ProjectProps{
  id: string;
  title: string;
  organization?:OrganizationProps;
  status: "PENDING" | "ACTIVE" | "COMPLETED"| "DRAFT";
  startDate: string;
  attendanceHours: string;
  location: location;
  totalApplicants: number;
  maxApplicants: number;
  category: string[];
  superVolunteer?:string;
  deadline:string;
  }

export interface ProjectFormProps{
  title:string;
  description:string;
  category:string;
  maxVolunteers:number;
  startDate:string;
  endDate:string;
  attendanceHours:string;
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
  isOrganization?:boolean;
}

export interface OrganizationProps{
  name?: string;
  description?:string;
  location?:location;
  category?:string;
  status?: "VERIFIED" | "UNVERIFIED";
  numOfActiveProjects?:number;
}

export interface OrganizationComponentProps extends OrganizationProps{
  hasVolunteered?:boolean
}


export interface DashboardProps{
  metrics?: MetricProps[];
  projects: ProjectProps[];
  className?:string
  triggerAction?:(action:VolunteerQuickActions)=>void
  orgTriggerAction?: (action: OrganizationQuickActions)=>void
}


export type NavTypes = "Dashboard" | "Find Opportunities"| "My Volunteering"| "Profile & Achievements";
export type VolunteerQuickActions = "Find Opportunities"| "View Organizations" | "Update Profile"|""

export type OrganizationNavTypes = "Dashboard"| "Project Management" | "Applications" | "Analytics"
export type OrganizationQuickActions = "Create New Project"| "Review pending applications"| "View Analytics"

export interface VolunteerProfileProps{
  firstName:string;
  lastName:string;
  email:string;
  Location:string;

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
  firstName?:string;
  lastname:string;
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
  organizationName:string;
  organizationType:organizationType;
  cacRegNumber:string;
  driversLicenseNumber:string;
  description:string;
}

export interface OrganizationDashboardProps {
  name:string;

  projects:ProjectProps[]
}