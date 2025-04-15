"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
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
  Code,
  Megaphone,
  Building,
  Mic,
  Github,
  Linkedin,
  Sparkles,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormField } from "../../../../lib/formGenerator"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

// Hiring domain types
type HiringDomain = "tech" | "non-tech" | "sales" | ""

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

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
]

// Domain-specific fields
const techFields: FormField[] = [
  {
    id: "tech-github",
    type: "text",
    label: "GitHub Profile",
    required: true,
    isFixed: true,
  },
  {
    id: "tech-linkedin",
    type: "text",
    label: "LinkedIn Profile",
    required: true,
    isFixed: true,
  },
  {
    id: "tech-experience",
    type: "select",
    label: "Years of Experience",
    required: true,
    isFixed: true,
    options: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
  },
]

const salesFields: FormField[] = [
  {
    id: "sales-linkedin",
    type: "text",
    label: "LinkedIn Profile",
    required: true,
    isFixed: true,
  },
  {
    id: "sales-experience",
    type: "select",
    label: "Sales Experience",
    required: true,
    isFixed: true,
    options: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
  },
  {
    id: "sales-pitch",
    type: "file",
    label: "Sales Pitch Recording (2 min)",
    required: true,
    isFixed: true,
  },
]

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
}

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "indent", "link"]

export default function CreateForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [customFields, setCustomFields] = useState<FormField[]>([])
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hiringDomain, setHiringDomain] = useState<HiringDomain>("")
  const [domainFields, setDomainFields] = useState<FormField[]>([])
  const [aiGeneratedFields, setAiGeneratedFields] = useState<FormField[]>([])
  const [isGeneratingFields, setIsGeneratingFields] = useState(false)
  const [isGeneratingJobDescription, setIsGeneratingJobDescription] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  // Add a state to store the token
  const [authToken, setAuthToken] = useState("")

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookie = document.cookie.split("; ").find((row) => row.startsWith("auth-token="))

      setAuthToken(cookie ? cookie.split("=")[1] : "") // Fallback to empty string
    }
  }, [])

  // Update domain fields when hiring domain changes
  useEffect(() => {
    if (hiringDomain === "tech") {
      setDomainFields(techFields)
    } else if (hiringDomain === "sales") {
      setDomainFields(salesFields)
    } else {
      setDomainFields([])
    }
  }, [hiringDomain])

  // Generate AI fields when job description and hiring domain are set
  const generateAIFields = async () => {
    if (!jobDescription || !hiringDomain) {
      setError("Please enter a job description and select a hiring domain first")
      return
    }

    setIsGeneratingFields(true)
    try {
      // Call the API route instead of the function directly
      const response = await fetch("/api/generate-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          jobDescription,
          hiringDomain,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate fields")
      }

      const data = await response.json()
      setAiGeneratedFields(data.fields)
    } catch (err) {
      console.error("Error generating fields:", err)
      setError("Failed to generate fields. Please try again or add fields manually.")
    } finally {
      setIsGeneratingFields(false)
    }
  }

  const jobDescriptionAI = async () => {
    if (!jobDescription) {
      setError("Please enter a job description first")
      return
    }
    try {
      setIsGeneratingJobDescription(true)
      // Call the API route instead of the function directly
      const response = await fetch("/api/generate-job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          jobDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate fields")
      }

      const data = await response.json()
      setJobDescription(data.jobDescriptionAI)
    } catch (err) {
      console.error("Error generating job description:", err)
      setError("Failed to generate job description. Please try again or add fields manually.")
    } finally {
      setIsGeneratingJobDescription(false)
    }
  }

  // All fields combined (fixed + domain-specific + AI-generated + custom)
  const allFields = [...fixedFields, ...domainFields, ...aiGeneratedFields, ...customFields]

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
      options: type === "select" ? ["Option 1", "Option 2", "Option 3"] : undefined,
    }
    setCustomFields([...customFields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    // Check if it's an AI-generated field
    if (id.startsWith("ai-")) {
      setAiGeneratedFields(aiGeneratedFields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
    } else {
      // Otherwise it's a custom field
      setCustomFields(customFields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
    }
  }

  const removeField = (id: string) => {
    // Check if it's an AI-generated field
    if (id.startsWith("ai-")) {
      setAiGeneratedFields(aiGeneratedFields.filter((field) => field.id !== id))
    } else {
      // Otherwise it's a custom field
      setCustomFields(customFields.filter((field) => field.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validation
    if (!title.trim()) {
      setError("Job title is required")
      setIsSubmitting(false)
      return
    }

    if (!jobDescription.trim()) {
      setError("Job description is required")
      setIsSubmitting(false)
      return
    }

    if (!hiringDomain) {
      setError("Please select a hiring domain")
      setIsSubmitting(false)
      return
    }

    try {
      // Include hiring domain in the form data
      const fieldsToSubmit = [...allFields]

      const res = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          jobDescription,
          fields: fieldsToSubmit,
          hiringDomain, // Include the hiring domain
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create form")

      router.push("/admin")
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  // Function to render field preview based on type
  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
        return <Input type="text" placeholder={`Enter ${field.label.toLowerCase()}`} disabled />
      case "textarea":
        return (
          <textarea
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
            rows={3}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        )
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
        )
      case "file":
        return (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {field.label.includes("Recording") ? "MP3, WAV (MAX. 5MB)" : "PDF, DOC, DOCX (MAX. 5MB)"}
                </p>
              </div>
              <input type="file" className="hidden" disabled />
            </label>
          </div>
        )
      case "email":
        return <Input type="email" placeholder={`Enter ${field.label.toLowerCase()}`} disabled />
      case "phone":
        return <Input type="tel" placeholder={`Enter ${field.label.toLowerCase()}`} disabled />
      default:
        return null
    }
  }

  // Get icon for field type
  const getFieldIcon = (type: FormField["type"]) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "textarea":
        return <FileText className="h-4 w-4" />
      case "select":
        return <List className="h-4 w-4" />
      case "file":
        return <Upload className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // Get icon for hiring domain
  const getDomainIcon = (domain: HiringDomain) => {
    switch (domain) {
      case "tech":
        return <Code className="h-5 w-5 text-blue-600" />
      case "non-tech":
        return <Building className="h-5 w-5 text-purple-600" />
      case "sales":
        return <Megaphone className="h-5 w-5 text-green-600" />
      default:
        return <Briefcase className="h-5 w-5 text-gray-600" />
    }
  }

  // Render an editable field
  const renderEditableField = (field: FormField) => {
    const isEditing = editingField === field.id

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-white rounded-lg p-6 border ${field.isAIGenerated ? "border-amber-200" : "border-gray-200"} shadow-sm`}
      >
        {isEditing ? (
          // Editing mode
          <div className="space-y-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full ${field.isAIGenerated ? "bg-amber-100" : "bg-gray-100"} flex items-center justify-center mr-3`}
                >
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingField(null)}
                  className="text-gray-500"
                >
                  Done
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Select
                value={field.type}
                onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
              >
                <SelectTrigger className="w-full max-w-[200px]">
                  <SelectValue placeholder="Field Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Field</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="email">Email Field</SelectItem>
                  <SelectItem value="phone">Phone Field</SelectItem>
                </SelectContent>
              </Select>

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
                <label htmlFor={`required-${field.id}`} className="ml-2 text-sm font-medium text-gray-700">
                  Required field
                </label>
              </div>
            </div>

            {field.type === "select" && (
              <div className="mt-4">
                <Label className="mb-2 block">Options (comma-separated)</Label>
                <Input
                  type="text"
                  placeholder="Option 1, Option 2, Option 3"
                  className="w-full"
                  value={field.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      options: e.target.value.split(", "),
                    })
                  }
                />
              </div>
            )}
          </div>
        ) : (
          // View mode
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full ${field.isAIGenerated ? "bg-amber-100" : "bg-gray-100"} flex items-center justify-center mr-3`}
                >
                  {getFieldIcon(field.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{field.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-gray-50">
                      {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field
                    </Badge>
                    {field.required && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Required
                      </Badge>
                    )}
                    {field.isAIGenerated && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField(field.id)}
                  className="text-gray-500 hover:text-indigo-600"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {field.type === "select" && field.options && (
              <div className="mt-2 pl-11">
                <p className="text-sm text-gray-500 mb-1">Options:</p>
                <div className="flex flex-wrap gap-1">
                  {field.options.map((option, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gray-50">
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Job Application Form</h1>
            <p className="text-gray-500">Design your job application form with custom fields</p>
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
                  <CardDescription>Enter the basic information about the job position</CardDescription>
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

                  {/* Hiring Domain Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="hiringDomain">Hiring Domain</Label>
                    <Select value={hiringDomain} onValueChange={(value) => setHiringDomain(value as HiringDomain)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hiring domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-blue-600" />
                            <span>Tech (Development, Engineering)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="non-tech">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            <span>Non-Tech (Operations, Marketing, Support)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sales">
                          <div className="flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-green-600" />
                            <span>Sales</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      This will determine the default fields and requirements for applicants
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between w-full ">
                    <Label htmlFor="description">Job Description</Label>
                    <Button
                          type="button"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                          onClick={jobDescriptionAI}
                          disabled={isGeneratingJobDescription}
                        >
                          {isGeneratingJobDescription ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              "Rewrite with AI" 
                            </>
                          )}
                        </Button>
                    </div>
                    <div className="h-64">
                      <ReactQuill
                        theme="snow"
                        value={jobDescription}
                        onChange={(value) => setJobDescription(value)}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="h-48 bg-white"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use the formatting toolbar to style your job description with headings, lists, and more. The
                      system will analyze this to suggest relevant fields.
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
                    Configure the fields candidates will fill out in your application form
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Domain-specific fields info */}
                  {hiringDomain && (
                    <div
                      className={`bg-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-50 border border-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-100 rounded-lg p-4 mb-6`}
                    >
                      <h3
                        className={`text-sm font-medium text-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-800 mb-2 flex items-center`}
                      >
                        {getDomainIcon(hiringDomain)}
                        <span className="ml-2">
                          {hiringDomain === "tech"
                            ? "Tech Hiring"
                            : hiringDomain === "sales"
                              ? "Sales Hiring"
                              : "Non-Tech Hiring"}
                        </span>
                      </h3>
                      <p
                        className={`text-sm text-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-700 mb-4`}
                      >
                        {hiringDomain === "tech"
                          ? "Technical positions include additional fields for GitHub, LinkedIn, and technical experience."
                          : hiringDomain === "sales"
                            ? "Sales positions include a 2-minute sales pitch recording requirement and LinkedIn profile."
                            : "Non-technical positions include standard application fields."}
                      </p>
                    </div>
                  )}

                  {/* AI Field Generation Button */}
                  {hiringDomain && jobDescription && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-600" />
                          <h3 className="text-sm font-medium text-amber-800">AI-Generated Fields</h3>
                        </div>
                        <Button
                          type="button"
                          onClick={generateAIFields}
                          disabled={isGeneratingFields}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {isGeneratingFields ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              {aiGeneratedFields.length > 0 ? "Regenerate Fields" : "Generate Fields"}
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-amber-700 mt-2">
                        Let AI analyze your job description and suggest relevant fields for your application form.
                      </p>
                    </div>
                  )}

                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Fixed Fields
                    </h3>
                    <p className="text-sm text-indigo-700 mb-4">
                      These fields are automatically included in every application form and cannot be removed.
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
                            <p className="font-medium text-gray-800">{field.label}</p>
                            <p className="text-xs text-gray-500">Required field</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Domain-specific fields */}
                  {domainFields.length > 0 && (
                    <div
                      className={`bg-${hiringDomain === "tech" ? "blue" : "green"}-50 border border-${hiringDomain === "tech" ? "blue" : "green"}-100 rounded-lg p-4 mb-6`}
                    >
                      <h3
                        className={`text-sm font-medium text-${hiringDomain === "tech" ? "blue" : "green"}-800 mb-2 flex items-center`}
                      >
                        {hiringDomain === "tech" ? (
                          <Code className="h-4 w-4 mr-2" />
                        ) : (
                          <Megaphone className="h-4 w-4 mr-2" />
                        )}
                        {hiringDomain === "tech" ? "Tech-Specific Fields" : "Sales-Specific Fields"}
                      </h3>
                      <p className={`text-sm text-${hiringDomain === "tech" ? "blue" : "green"}-700 mb-4`}>
                        These fields are automatically included for {hiringDomain} positions.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {domainFields.map((field) => (
                          <div
                            key={field.id}
                            className="bg-white rounded-lg p-4 border border-gray-200 flex items-center"
                          >
                            <div
                              className={`h-8 w-8 rounded-full bg-${hiringDomain === "tech" ? "blue" : "green"}-100 flex items-center justify-center mr-3`}
                            >
                              {field.label.includes("GitHub") ? (
                                <Github className={`h-4 w-4 text-${hiringDomain === "tech" ? "blue" : "green"}-600`} />
                              ) : field.label.includes("LinkedIn") ? (
                                <Linkedin
                                  className={`h-4 w-4 text-${hiringDomain === "tech" ? "blue" : "green"}-600`}
                                />
                              ) : field.label.includes("Pitch") ? (
                                <Mic className={`h-4 w-4 text-${hiringDomain === "tech" ? "blue" : "green"}-600`} />
                              ) : (
                                getFieldIcon(field.type)
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{field.label}</p>
                              <p className="text-xs text-gray-500">
                                {field.required ? "Required field" : "Optional field"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI-generated fields */}
                  {aiGeneratedFields.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-medium flex items-center">
                        <Sparkles className="h-5 w-5 text-amber-600 mr-2" />
                        AI-Generated Fields
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        These fields were generated based on your job description. You can edit or remove them.
                      </p>
                      <div className="space-y-4">{aiGeneratedFields.map((field) => renderEditableField(field))}</div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Custom Fields</h3>
                      <div className="flex flex-wrap gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type="button" variant="outline" size="sm" onClick={() => addField("text")}>
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
                              <Button type="button" variant="outline" size="sm" onClick={() => addField("textarea")}>
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
                              <Button type="button" variant="outline" size="sm" onClick={() => addField("select")}>
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
                              <Button type="button" variant="outline" size="sm" onClick={() => addField("file")}>
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
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No custom fields added yet</h3>
                        <p className="text-gray-500 mb-4">
                          Add custom fields to collect additional information from candidates
                        </p>
                        <Button type="button" variant="outline" onClick={() => addField("text")}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Field
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">{customFields.map((field) => renderEditableField(field))}</div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
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
                  <CardDescription>Preview how your application form will appear to candidates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      {hiringDomain && (
                        <Badge
                          className={`bg-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-100 text-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-800 border-${hiringDomain === "tech" ? "blue" : hiringDomain === "sales" ? "green" : "purple"}-200`}
                        >
                          {hiringDomain === "tech"
                            ? "Technical Position"
                            : hiringDomain === "sales"
                              ? "Sales Position"
                              : "Non-Technical Position"}
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title || "Job Title"}</h2>

                    <div className="prose prose-indigo max-w-none mb-8">
                      {jobDescription ? (
                        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: jobDescription }} />
                      ) : (
                        <p className="text-gray-500 italic">Job description will appear here...</p>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Form</h3>

                      <div className="space-y-6">
                        {allFields.length > 0 ? (
                          allFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              <Label className="flex items-center">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                {field.isFixed && (
                                  <Badge variant="outline" className="ml-2 text-xs bg-gray-50">
                                    Fixed Field
                                  </Badge>
                                )}
                                {field.isAIGenerated && (
                                  <Badge className="ml-2 text-xs bg-amber-100 text-amber-800 border-amber-200">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI Generated
                                  </Badge>
                                )}
                              </Label>
                              {renderFieldPreview(field)}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No fields added yet...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("fields")}>
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
  )
}