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
    onSignInAttempt: (email: string, pass: string) => Promise<number>;
    onSignInWithGoogle: ()=>Promise<void>;
    redirect?:string|null;
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
  createdAt?:string;
  updatedAt?:string;
  address?:string;
  broadcastEnabled?:boolean;
  rating?:number;
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
  address?:string;
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
export type IdType =  "DL"|"vNIN"|"VOTER_CARD"|"PASSPORT"
export type VerificationStatus =  "VERIFIED" | "UNVERIFIED"| "PENDING";
export interface OrganizationProps{
  name?: string;
  description?:string;
  location?:location;
  category?:string[];
  status?: VerificationStatus;
  numOfActiveProjects?:number;
  website?:string;
  address?:string;
  activeProjects?: ProjectProps[]
  cacRegNumber?:string;
  rating?:number;
  profileCompleted?:boolean;
  profileUrl?:string;
  cacDocUrl?:string;
  contactVerification?:{
    idType?: IdType,
    idNumber?: string;
    docImgUrl?: string;
    usrImgUrl?:string;
  }
  dateOfBirth?:string;
  contactFirstname?:string;
  contactLastname?:string;
}

export interface OrgContantProfileProps{
  contactFirstname:string;
  contactLastname:string;
  contactMiddleName:string;
  phoneNumber:string;
  email:string;
  emailEditable: boolean;
  emailVerified:boolean;
}
export interface OrganizationProfileProps{
  organizationContact: OrgContantProfileProps;
  organization: OrganizationProps;
}

export type EmailExistProps = {
  email:String;
  exists:boolean;
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
  project:ProjectProps;
  status?: "IN_PROGRESS" | "COMPLETED";
  rating?:number;
  reviewable?:boolean;
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
  emailEditable?: boolean;
  email?:string;
  createdAt?:string;
};

export interface BadgeProps {
  id: number;
  icon: React.ReactNode;
  description: string;
  earned?: boolean;
};


export interface OrganizationComponentProps extends OrganizationProps{
  hasVolunteered?: boolean;
  
}


export interface DashboardProps{
  metrics?: MetricProps[];
  projects?: ProjectProps[];
  className?:string
  profileCompleted?:boolean ;
  triggerAction?:(action:VolunteerQuickActions)=>void
  orgTriggerAction?: (action: OrganizationQuickActions)=>void
  hasMounted:()=>void;
}


export type NavTypes = "Dashboard" | "Find Opportunities"| "My Volunteering"| "Profile & Achievements";
export type VolunteerQuickActions = "Find Opportunities"| "View Organizations" | "Update Profile"|""

export type OrganizationNavTypes = "Dashboard"| "Project Management" | "Applications" | "Profile"
export type OrganizationQuickActions = "Create New Project"| "Review pending applications"| "Edit Profile"

export interface VolunteerProfileProps{
  firstname:string;
  lastname:string;
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
  profileCompleted:boolean;
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
  reason:string;
  projectApplied: VolunteerProjectApplicationProps
}

export type ParticipationStatus = "IN_PROGRESS" | "COMPLETED" | "REJECTED"
export interface ParticipantProps{
  id:number;
  status: ParticipationStatus;
  project: ProjectProps;
  reviewable?:boolean;
  endDate?:string;
  volunteer: ProfileProps;
  reason:string;
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
  status:VerificationStatus;
}

export type UserTypes = "volunteer"|"organization"|"";

export type OtpPurpose = "EMAIL_VERIFICATION" | "PASSWORD_UPDATE"

// Qore Id verification

// types/qoreid.ts

export interface QoreIdApplicantData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  middlename?: string;
  [key: string]: string | undefined;
}

export interface QoreIdSuccessResponse {
  status: 'success';
  jobId: string;
  customerReference: string;
  livenessScore?: number;
  verificationStatus?: string;
  sessionId?: string;
  timestamp: string;
  // Additional fields based on product code
  bvnData?: Record<string, unknown>;
  documentData?: Record<string, unknown>;
}

export interface QoreIdErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface QoreIdExitResponse {
  status: 'exit';
  reason: 'user_closed' | 'timeout' | 'error';
  sessionId?: string;
}

export type QoreIdCallbackResponse =
  | QoreIdSuccessResponse
  | QoreIdErrorResponse
  | QoreIdExitResponse;

export type QoreIdEnvironment = 'production' | 'sandbox';

export interface QoreIdLivenessCheckProps {
  clientId: string;
  customerReference: string;
  applicantData?: QoreIdApplicantData;
  onSuccess?: (response: QoreIdSuccessResponse) => void;
  onError?: (error: QoreIdErrorResponse) => void;
  onExit?: (response: QoreIdExitResponse) => void;
  hideButton?: boolean;
  buttonText?: string;
  buttonClassName?: string;
  environment?: QoreIdEnvironment;
  productCode?: QoreIdProductCode;
}

export type QoreIdProductCode =
  | 'liveness'
  | 'liveness_bvn'
  | 'liveness_drivers_license'
  | 'liveness_nin'
  | 'liveness_passport'
  | 'liveness_ocr'
  | 'liveness_voters_card'
  | 'liveness_nin_slip';

// Extend Window interface for QoreId SDK
declare global {
  interface Window {
    QoreIDWebSdk?: {
      start: () => void;
      stop: () => void;
    };
    QoreIdRegenerateSDK?: () => void;
  }
}


export interface QoreIdSDKMessageEvent extends MessageEvent {
  data: {
    type: 'QOREID_SDK_CALLBACK';
    status: 'success' | 'error' | 'exit';
    response: QoreIdCallbackResponse;
  };
}

export interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  dashboardPath?: string;
  buttonLabel?: string;
}
