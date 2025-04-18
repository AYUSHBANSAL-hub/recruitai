"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Briefcase, FileText, Upload, CheckCircle, AlertCircle, Loader2, ArrowRight, XCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PDFDocument } from 'pdf-lib';
import { JobForm } from "@/types";

export default function ApplyForm() {
  const router = useRouter();
  const params = useParams();
  const [formId, setFormId] = useState<string | string[] | undefined>("");
  const [form, setForm] = useState<JobForm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(false);
  useEffect(() => {
    if (params) {
      setFormId(params.formID);
    }
  }, [params]);
  useEffect(()=>{
    const savedFormId = localStorage.getItem("savedFormId");
    if (savedFormId === formId) {
      setSubmittedStatus(true);
    }
  }, [formId]);

  useEffect(() => {
    if (!formId) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) throw new Error("Failed to fetch job application form");
        const data = await res.json();
        setForm(data);

        // Initialize responses object with empty values
        const initialResponses: { [key: string]: string } = {};
        data.fields.forEach((field: any) => {
          initialResponses[field.label] = "";
        });
        setResponses(initialResponses);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (fieldLabel: string, value: string) => {
    setResponses({ ...responses, [fieldLabel]: value });

    // Clear error for this field if it exists
    if (formErrors[fieldLabel]) {
      const newErrors = { ...formErrors };
      delete newErrors[fieldLabel];
      setFormErrors(newErrors);
    }
  };
  const validateFile = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      throw new Error("Invalid file");
    }
  
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
  
    return pageCount <= 2; // Returns true if 2 pages or less
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        setResumeError(
          "Please upload a PDF or Word document (.pdf, .doc, .docx)"
        );
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setResumeError("File size must be less than 5MB");
        return;
      }

      try {
        const isValid = await validateFile(file);
        if (!isValid) {
          setResumeError("Please upload a PDF with max 2 pages");
          return;
        }
      } catch (error) {
        setResumeError("Error validating PDF file");
        return;
      }
      setResume(file);
    }
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    try {
      setUploadProgress(10);
      const res = await fetch("/api/upload-url", {
        method: "POST",
        body: JSON.stringify({ fileType: file.type }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, fileUrl } = await res.json();
      setUploadProgress(30);
      setUploadProgress(50);

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload resume");

      setUploadProgress(100);
      return fileUrl;
    } catch (error: any) {
      console.error("❌ Error uploading file:", error);
      throw new Error(error.message);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Validate all required fields
    form?.fields.forEach((field) => {
      if (
        field.required && field.id!="fixed-resume" &&
        (!responses[field.label] || responses[field.label].trim() === "")
      ) {
        errors[field.label] = `${field.label} is required`;
        isValid = false;
      }
    });

    if (!resume) {
      setResumeError("Please upload your resume");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResumeError("");

    // Delay validation slightly to ensure state updates
    setTimeout(() => {
      if (!validateForm()) return;
    }, 50);
    try {
      setSubmitting(true);

      if (!formId) throw new Error("Form ID is missing");
      let resumeUrl = "";
      if (resume) {
        resumeUrl = await uploadFileToS3(resume);
      }
      const applicationData = { formId, responses, resumeUrl, formTitle: form?.title };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (!res.ok) {
        const responseData = await res.json().catch(() => ({})); // Handle potential JSON parsing errors
        const errorMessage = responseData.error || "Unknown error occurred"; // Fallback for missing error message
        throw new Error(`Application submission failed: ${errorMessage}`);
      }
      localStorage.removeItem("savedFormId"); // Remove any existing form ID from local storage
      localStorage.setItem("savedFormId", Array.isArray(formId) ? formId[0] : formId || ""); // Set the new form ID
      localStorage.setItem("savedFormId", Array.isArray(formId) ? formId[0] : formId || ""); // Ensure formId is a string
      setSuccess(true);
    } catch (err: any) {
      console.error("❌ Error during submission:", err);
      setError(err.message);
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for applying. We'll review your application and get back
              to you soon.
            </CardDescription>
          </CardHeader>
          {/* <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Redirecting you in a moment...
            </p>
          </CardFooter> */}
        </Card>
      </div>
    );
  }
  if (submittedStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
            <CardDescription>
              Your application has been submitted successfully. We appreciate your interest and will get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  if (form && form.active === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-100">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Application Closed</CardTitle>
            <CardDescription className="mt-2">
              We're sorry, but this job application form has been closed and is no longer accepting submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-800" />
              <AlertTitle>Please note</AlertTitle>
              <AlertDescription>
                If you believe this is an error or would like more information about this position, please contact the
                job poster directly.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-lg text-gray-600">
            Loading job application form...
          </p>
        </div>
      ) : error ? (
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      ) : form ? (
        <div className="max-w-3xl mx-auto">
          {/* Job Details Card */}
          <Card className="mb-8 border-indigo-100">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {form.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-indigo max-w-none ql-editor">
                <div
                  dangerouslySetInnerHTML={{ __html: form.jobDescription }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Please fill out all required fields and upload your resume to
                apply for this position.
              </CardDescription>
            </CardHeader>

            {error && (
              <div className="px-6">
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {form.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="flex items-center">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      {field.isFixed && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Required
                        </Badge>
                      )}
                    </Label>

                    {field.type === "text" && (
                      <Input
                        id={field.id}
                        type="text"
                        required={field.required}
                        value={responses[field.label] || ""}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={formErrors[field.label] ? "border-red-500" : ""}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    )}

                    {field.type === "email" && (
                      <Input
                        id={field.id}
                        type="email"
                        required={field.required}
                        value={responses[field.label] || ""}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={formErrors[field.label] ? "border-red-500" : ""}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    )}

                    {field.type === "phone" && (
                      <Input
                        id={field.id}
                        type="tel"
                        required={field.required}
                        value={responses[field.label] || ""}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={formErrors[field.label] ? "border-red-500" : ""}
                        placeholder="e.g., +1 (555) 123-4567"
                      />
                    )}

                    {field.type === "textarea" && (
                      <Textarea
                        id={field.id}
                        required={field.required}
                        value={responses[field.label] || ""}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={formErrors[field.label] ? "border-red-500" : ""}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        rows={4}
                      />
                    )}

                    {field.type === "select" && field.options && (
                      <Select
                        value={responses[field.label] || ""}
                        onValueChange={(value) => handleChange(field.label, value)}
                      >
                        <SelectTrigger
                          className={
                            formErrors[field.label] ? "border-red-500" : ""
                          }
                        >
                          <SelectValue
                            placeholder={`Select ${field.label.toLowerCase()}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.type === "file" &&
                      field.label.toLowerCase().includes("resume") && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center w-full">
                            <Label
                              htmlFor="resume-upload"
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                                resumeError
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300 bg-gray-50"
                              } border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {resume ? (
                                  <>
                                    <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                                    <p className="mb-2 text-sm text-gray-700 font-medium">
                                      {resume.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(resume.size / (1024 * 1024)).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      PDF, DOC, DOCX (MAX. 5MB)
                                    </p>
                                  </>
                                )}
                              </div>
                              <Input
                                id="resume-upload"
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                className="hidden"
                              />
                            </Label>
                          </div>
                          {resumeError && (
                            <p className="text-sm text-red-500">
                              {resumeError}
                            </p>
                          )}
                          {resume && (
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setResume(null)}
                                className="text-gray-500"
                              >
                                Change File
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                    {formErrors[field.label] && (
                      <p className="text-sm text-red-500">
                        {formErrors[field.label]}
                      </p>
                    )}
                  </div>
                ))}

                {/* Resume upload if not included in fields */}
                {!form.fields.some(
                  (field) =>
                    field.type === "file" &&
                    field.label.toLowerCase().includes("resume")
                ) && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="resume-upload"
                      className="flex items-center"
                    >
                      Resume Upload <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <Label
                        htmlFor="resume-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                          resumeError
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {resume ? (
                            <>
                              <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                              <p className="mb-2 text-sm text-gray-700 font-medium">
                                {resume.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(resume.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX (MAX. 5MB)
                              </p>
                            </>
                          )}
                        </div>
                        <Input
                          id="resume-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                      </Label>
                    </div>
                    {resumeError && (
                      <p className="text-sm text-red-500">{resumeError}</p>
                    )}
                    {resume && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setResume(null)}
                          className="text-gray-500"
                        >
                          Change File
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Uploading resume...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Job Application Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The job application form you're looking for doesn't exist or has
              been removed.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Return to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
