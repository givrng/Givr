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

export interface ProjectProps{
  id: string;
  title: string;
  organization:string;
  status: "Verified" | "Not Verified";
  startDate: string;
  attendanceHours: string;
  location: string;
  totalApplicants: number;
  maxApplicants: number;
  categories: Array<string>;
  superVolunteer?:string;
}

export interface ProjectComponentProps extends ProjectProps{
  className?:string
  viewDetails?:boolean
  applied?:boolean
}

export interface OrganizationProps{
  name: string;
  description:string;
  location:string;
  categories:Array<string>;
  status: "Verified" | "Unverified";
  numOfActiveProjects:number;
}
export interface OrganizationComponentProps extends OrganizationProps{
  hasVolunteered?:boolean
}
export interface DashboardProps{
  metrics?: MetricProps[];
  projects: ProjectProps[];
  className?:string
  triggerAction?:(action:QuickActions)=>void
}
export type NavTypes = "Dashboard" | "Find Opportunities"| "My Volunteering"| "Profile & Achievements";
export type QuickActions = "Find Opportunities"| "View Organizations" | "Update Profile"|""


export type ProjectType = {
  id: number;
  title: string;
  company: string;
  location: string;
  dateStarted: string;
  status: string;
  rating?: string;
  description: string;
  verified?: boolean;
  userApplied?: boolean;
  companyAddress?: string;
  companyActiveProjects?: number;
  companyIndustries?: string[];
};

export type ProfileType = {
  id: number;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  skills: string[];
  interests: string[];
  phoneVerified: boolean;
  emailVerified: boolean;
  role?: string;
};

export type DataType = {
  id: number;
  title: string;
  company: string;
  earned: string;
  verified: boolean;
  hoursContributed: number;
  companyIndustries: string[];
  userName: string
  role: string
};

export type BadgeType = {
  id: number;
  icon: React.ReactNode;
  description: string;
  earned?: boolean;
};


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
  appliedAt:string;
}

export interface VolunteerDashboardProps{
  firstname:string;
  projectApplication:VolunteerProjectApplicationProps[]
}