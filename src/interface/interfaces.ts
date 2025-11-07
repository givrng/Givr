import type { ReactNode } from "react";

export interface NavLinkProps {
  label: string;
  href: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline'| 'green'|'disabled'|'void';
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
    onSignInAttempt: (email: string, pass: string) => void;
}

export interface BasicNatigationProps{
  onToSignUp?: ()=> void;
  onToSignIn?: ()=> void
  onToInterest?:(userId:string)=>void;
  toForgotPassword?:string;
  toSignUp?:string;
  toVolunteerDetails?:string;
  
}

export interface MetricProps{
  title: string;
  icon: ReactNode;
  value: string;
  context: string;
  color?:string;
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
}
