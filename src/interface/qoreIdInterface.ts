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
  className?:string
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