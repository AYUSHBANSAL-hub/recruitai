"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  X,
  Plus,
  AlertCircle,
  FileText,
  Type,
  List,
  Mail,
  Upload,
  Phone,
  User,
  Info,
  ArrowLeft,
  Save,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "file" | "email" | "phone";
  label: string;
  required: boolean;
  options?: string[];
  isFixed?: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Fixed fields that will always be included
const fixedFields: FormField[] = [
  {
    id: "fixed-name",
    type: "text",
    label: "Full Name",
    required: true,
    isFixed: true,
  },
  {
    id: "fixed-email",
    type: "email",
    label: "Email Address",
    required: true,
    isFixed: true,
  },
  {
    id: "fixed-phone",
    type: "phone",
    label: "Phone Number",
    required: true,
    isFixed: true,
  },
  {
    id: "fixed-resume",
    type: "file",
    label: "Resume Upload",
    required: true,
    isFixed: true,
  },
];

// Quill editor modules and formats
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

// const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "indent", "link"]
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "indent",
  "link",
];

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a state to store the token
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="));
  
      setAuthToken(cookie ? cookie.split("=")[1] : ""); // Fallback to empty string
    }
  }, []);  

  // All fields combined (fixed + custom)
  const allFields = [...fixedFields, ...customFields];

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label:
        type === "text"
          ? "Text Field"
          : type === "textarea"
          ? "Text Area"
          : type === "select"
          ? "Dropdown"
          : type === "file"
          ? "File Upload"
          : type === "email"
          ? "Email Field"
          : "Phone Field",
      required: false,
      options:
        type === "select" ? ["Option 1", "Option 2", "Option 3"] : undefined,
    };
    setCustomFields([...customFields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!title.trim()) {
      setError("Job title is required");
      setIsSubmitting(false);
      return;
    }

    if (!jobDescription.trim()) {
      setError("Job description is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Combine fixed and custom fields for submission
      const fieldsToSubmit = [...customFields];

      const res = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          jobDescription,
          fields: allFields,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create form");

      router.push("/admin/forms");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  // Function to render field preview based on type
  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        );
      case "textarea":
        return (
          <textarea
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
            rows={3}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        );
      case "select":
        return (
          <select
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
            disabled
          >
            <option value="">Select an option</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "file":
        return (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX (MAX. 5MB)
                </p>
              </div>
              <input type="file" className="hidden" disabled />
            </label>
          </div>
        );
      case "email":
        return (
          <Input
            type="email"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        );
      case "phone":
        return (
          <Input
            type="tel"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        );
      default:
        return null;
    }
  };

  // Get icon for field type
  const getFieldIcon = (type: FormField["type"]) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />;
      case "textarea":
        return <FileText className="h-4 w-4" />;
      case "select":
        return <List className="h-4 w-4" />;
      case "file":
        return <Upload className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Job Application Form
            </h1>
            <p className="text-gray-500">
              Design your job application form with custom fields
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="details" className="text-sm">
              Job Details
            </TabsTrigger>
            <TabsTrigger value="fields" className="text-sm">
              Application Fields
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-sm">
              Form Preview
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Enter the basic information about the job position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Senior Frontend Developer"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <div className="h-64">
                      <ReactQuill
                        theme="snow"
                        value={jobDescription}
                        onChange={setJobDescription}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="h-48 bg-white"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use the formatting toolbar to style your job description
                      with headings, lists, and more.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("fields")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Continue to Application Fields
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fields">
              <Card>
                <CardHeader>
                  <CardTitle>Application Fields</CardTitle>
                  <CardDescription>
                    Configure the fields candidates will fill out in your
                    application form
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Fixed Fields
                    </h3>
                    <p className="text-sm text-indigo-700 mb-4">
                      These fields are automatically included in every
                      application form and cannot be removed.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fixedFields.map((field) => (
                        <div
                          key={field.id}
                          className="bg-white rounded-lg p-4 border border-indigo-100 flex items-center"
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            {field.type === "text" ? (
                              <User className="h-4 w-4 text-indigo-600" />
                            ) : field.type === "email" ? (
                              <Mail className="h-4 w-4 text-indigo-600" />
                            ) : field.type === "phone" ? (
                              <Phone className="h-4 w-4 text-indigo-600" />
                            ) : (
                              <Upload className="h-4 w-4 text-indigo-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {field.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              Required field
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Custom Fields</h3>
                      <div className="flex flex-wrap gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addField("text")}
                              >
                                <Type className="h-4 w-4 mr-1" />
                                Text
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add a single-line text field</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addField("textarea")}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                TextArea
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add a multi-line text field</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addField("select")}
                              >
                                <List className="h-4 w-4 mr-1" />
                                Select
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add a dropdown selection field</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addField("file")}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                File
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add a file upload field</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {customFields.length === 0 ? (
                      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">
                          No custom fields added yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Add custom fields to collect additional information
                          from candidates
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addField("text")}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Field
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {customFields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  {getFieldIcon(field.type)}
                                </div>
                                <Input
                                  type="text"
                                  placeholder="Field Label"
                                  className="w-full"
                                  value={field.label}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      label: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeField(field.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              <Badge variant="outline" className="bg-gray-50">
                                {field.type.charAt(0).toUpperCase() +
                                  field.type.slice(1)}{" "}
                                Field
                              </Badge>
                              <div className="flex items-center">
                                <Checkbox
                                  id={`required-${field.id}`}
                                  checked={field.required}
                                  onCheckedChange={(checked) =>
                                    updateField(field.id, {
                                      required: checked === true,
                                    })
                                  }
                                />
                                <label
                                  htmlFor={`required-${field.id}`}
                                  className="ml-2 text-sm font-medium text-gray-700"
                                >
                                  Required field
                                </label>
                              </div>
                            </div>

                            {field.type === "select" && (
                              <div className="mt-4">
                                <Label className="mb-2 block">
                                  Options (comma-separated)
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Option 1, Option 2, Option 3"
                                  className="w-full"
                                  value={field.options?.join(", ")}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      options: e.target.value.split(", "),
                                    })
                                  }
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                    >
                      Back to Job Details
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Preview Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Form Preview</CardTitle>
                  <CardDescription>
                    Preview how your application form will appear to candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {title || "Job Title"}
                    </h2>

                    <div className="prose prose-indigo max-w-none mb-8">
                      {jobDescription ? (
                        <div
                          className="ql-editor"
                          dangerouslySetInnerHTML={{ __html: jobDescription }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">
                          Job description will appear here...
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Application Form
                      </h3>

                      <div className="space-y-6">
                        {allFields.length > 0 ? (
                          allFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              <Label className="flex items-center">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                                {field.isFixed && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs bg-gray-50"
                                  >
                                    Fixed Field
                                  </Badge>
                                )}
                              </Label>
                              {renderFieldPreview(field)}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">
                            No fields added yet...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("fields")}
                    >
                      Back to Fields
                    </Button>
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Job Form
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  );
}
