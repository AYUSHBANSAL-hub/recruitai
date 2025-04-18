// src/types/index.ts
export interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'file' | 'email' | 'tel' | 'phone';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select fields
    isAIGenerated? : boolean;
    isFixed? : boolean;
  }
  
  export interface JobForm {
    id: string;
    title: string;
    jobDescription: string;
    fields: FormField[];
    createdAt: Date;
    updatedAt: Date;
    active : boolean;
    hiringDomain : string;
    userId : string;
    applicationsCount? : number

  }
  
  export interface Application {
    id: string;
    formId: string;
    responses: Record<string, any>;
    resumeUrl: string;
    matchScore?: number;
    matchReasoning?: string;
    status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
    submittedAt: Date;
    userId?: string;
    createdAt?: string;
    strengths ?: string[];
    weaknesses ?: string[]; 
  }
  
  