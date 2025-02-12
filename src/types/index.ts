// src/types/index.ts
export interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'file' | 'email' | 'tel';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select fields
  }
  
  export interface JobForm {
    id: string;
    title: string;
    jobDescription: string;
    fields: FormField[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Application {
    id: string;
    formId: string;
    responses: Record<string, any>;
    resumeUrl: string;
    matchScore?: number;
    matchReasoning?: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
    submittedAt: Date;
  }
  
  