"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Building2,
  Briefcase,
  Lock,
  Mail,
  UserCircle,
  Phone,
  Globe,
  Users,
  BarChart,
  CheckCheck,
  TrendingUp,
  Brain,
  Clock,
  Award,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

// Form steps
const steps = [
  { id: 1, title: "Account", icon: <User className="h-5 w-5" /> },
  { id: 2, title: "Personal", icon: <UserCircle className="h-5 w-5" /> },
  { id: 3, title: "Company", icon: <Building2 className="h-5 w-5" /> },
  { id: 4, title: "Role", icon: <Briefcase className="h-5 w-5" /> },
  { id: 5, title: "Complete", icon: <CheckCheck className="h-5 w-5" /> },
]

// Industry options
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Construction",
  "Transportation",
  "Energy",
  "Media & Entertainment",
  "Professional Services",
  "Other",
]

// Company size options
const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5001+ employees",
]

// Department options
const departments = [
  "Human Resources",
  "Talent Acquisition",
  "Executive Leadership",
  "Operations",
  "Administration",
  "Other",
]

// Benefits for each step
const stepBenefits = [
  {
    step: 1,
    title: "Secure & Personalized",
    description: "Your account is the gateway to AI-powered recruitment that saves 76% of screening time",
    icon: <Lock className="h-6 w-6 text-white" />,
    stat: "100% secure data",
  },
  {
    step: 2,
    title: "Tailored Experience",
    description: "We customize your experience based on your role and recruitment needs",
    icon: <UserCircle className="h-6 w-6 text-white" />,
    stat: "95% match accuracy",
  },
  {
    step: 3,
    title: "Industry Insights",
    description: "Gain access to recruitment benchmarks specific to your industry and company size",
    icon: <Building2 className="h-6 w-6 text-white" />,
    stat: "Industry-specific data",
  },
  {
    step: 4,
    title: "Role-Based Solutions",
    description: "Your challenges inform our AI to deliver the most relevant candidate matches",
    icon: <Briefcase className="h-6 w-6 text-white" />,
    stat: "41% faster hiring",
  },
]

// Testimonials
const testimonials = [
  {
    quote: "RecruitAI cut our screening time by 89% and improved our quality of hires dramatically.",
    author: "Sarah J.",
    role: "Head of Talent Acquisition",
  },
  {
    quote: "The AI found patterns in successful employees that we hadn't noticed ourselves.",
    author: "Michael C.",
    role: "CTO",
  },
  {
    quote: "We increased our diversity hiring by surfacing qualified candidates we would have missed.",
    author: "Emily R.",
    role: "VP of HR",
  },
]

// Stats data for carousel
const statsData = [
  {
    icon: <Clock className="h-8 w-8 text-white" />,
    value: "76%",
    label: "Reduction in screening time",
    bgClass: "from-blue-600 to-blue-800 border-blue-500/30",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-white" />,
    value: "3.5x",
    label: "Increase in qualified candidates",
    bgClass: "from-cyan-600 to-cyan-800 border-cyan-500/30",
  },
  {
    icon: <Brain className="h-8 w-8 text-white" />,
    value: "95%",
    label: "AI matching accuracy",
    bgClass: "from-indigo-600 to-indigo-800 border-indigo-500/30",
  },
]

export default function SignUp() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(20)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentStat, setCurrentStat] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    // Account details
    email: "",
    password: "",
    confirmPassword: "",

    // Personal details
    firstName: "",
    lastName: "",
    phoneNumber: "",

    // Company details
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "",

    // Role details
    jobTitle: "",
    department: "",
    recruitmentChallenges: [],

    // Terms
    acceptTerms: false,
  })

  // Update progress based on current step
  useEffect(() => {
    setProgress(currentStep * 20)
  }, [currentStep])

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % statsData.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle checkbox array changes
  const handleCheckboxArrayChange = (value, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        recruitmentChallenges: [...formData.recruitmentChallenges, value],
      })
    } else {
      setFormData({
        ...formData,
        recruitmentChallenges: formData.recruitmentChallenges.filter((item) => item !== value),
      })
    }
  }

  // Navigate to next step
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
      setError("")
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError("")
  }

  // Validate current step
  const validateCurrentStep = () => {
    setError("")

    // Validate Account step
    if (currentStep === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields.")
        return false
      }

      if (!isValidEmail(formData.email)) {
        setError("Please enter a valid email address.")
        return false
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.")
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.")
        return false
      }
    }

    // Validate Personal step
    else if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError("Please enter your name.")
        return false
      }
    }

    // Validate Company step
    else if (currentStep === 3) {
      if (!formData.companyName || !formData.industry || !formData.companySize) {
        setError("Please fill in all required company information.")
        return false
      }
    }

    // Validate Role step
    else if (currentStep === 4) {
      if (!formData.jobTitle || !formData.department) {
        setError("Please fill in your job title and department.")
        return false
      }

      if (!formData.acceptTerms) {
        setError("You must accept the terms and conditions to continue.")
        return false
      }
    }

    return true
  }

  // Validate email format
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Only process submission if we're on the final step
    if (currentStep !== 4) {
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Sign-up failed")
      }

      // Move to success step
      setCurrentStep(5)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${currentStep >= step.id ? "text-cyan-600" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors
                  ${
                    currentStep > step.id
                      ? "bg-cyan-100 text-cyan-600 border-2 border-cyan-500"
                      : currentStep === step.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
              >
                {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.icon}
              </div>
              <span className={`text-xs font-medium ${step.id === 5 && currentStep !== 5 ? "hidden sm:block" : ""}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2 bg-slate-200">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
        </Progress>
      </div>
    )
  }

  // Render account step
  const renderAccountStep = () => {
    return (
      <motion.div
        key="account-step"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-600 mt-1">First, let's set up your login credentials</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-500" />
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-500" />
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
            <p className="text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-cyan-500" />
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  // Render personal details step
  const renderPersonalStep = () => {
    return (
      <motion.div
        key="personal-step"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600 mt-1">Tell us a bit about yourself</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-500" />
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-500" />
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-500" />
              Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  // Render company details step
  const renderCompanyStep = () => {
    return (
      <motion.div
        key="company-step"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
          <p className="text-gray-600 mt-1">Tell us about your organization</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-500" />
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Your company name"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-500" />
              Company Website <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              type="url"
              placeholder="https://yourcompany.com"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-cyan-500" />
              Industry
            </Label>
            <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-500" />
              Company Size
            </Label>
            <Select value={formData.companySize} onValueChange={(value) => handleSelectChange("companySize", value)}>
              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render role details step
  const renderRoleStep = () => {
    return (
      <motion.div
        key="role-step"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Role & Needs</h2>
          <p className="text-gray-600 mt-1">Help us understand your recruitment needs</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-cyan-500" />
              Job Title
            </Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="Your job title"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-500" />
              Department
            </Label>
            <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-cyan-500" />
              What recruitment challenges are you facing? (Select all that apply)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {[
                "Too many applications to screen",
                "Finding qualified candidates",
                "Time-consuming hiring process",
                "Assessing candidate skills accurately",
                "Diversity in hiring",
                "High turnover rate",
                "Competitive job market",
                "Limited recruitment budget",
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={`challenge-${challenge}`}
                    checked={formData.recruitmentChallenges.includes(challenge)}
                    onCheckedChange={(checked) => {
                      handleCheckboxArrayChange(challenge, checked)
                    }}
                  />
                  <Label
                    htmlFor={`challenge-${challenge}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {challenge}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      acceptTerms: checked,
                    })
                  }}
                  required
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <Link href="/terms" className="text-cyan-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render success step
  const renderSuccessStep = () => {
    return (
      <motion.div
        key="success-step"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Created Successfully!</h2>
          <p className="text-gray-600 mt-2">
            Welcome to RecruitAI, {formData.firstName}! Your account has been created and you're ready to transform your
            hiring process.
          </p>
        </div>

        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100 max-w-md mx-auto">
          <p className="text-cyan-800 text-sm">
            We've sent a confirmation email to <span className="font-medium">{formData.email}</span>. Please verify your
            email to get started.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => router.push("/login")}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to Login
          </Button>
        </div>
      </motion.div>
    )
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderAccountStep()
      case 2:
        return renderPersonalStep()
      case 3:
        return renderCompanyStep()
      case 4:
        return renderRoleStep()
      case 5:
        return renderSuccessStep()
      default:
        return null
    }
  }

  // Render benefit card for current step
  const renderCurrentBenefit = () => {
    const benefit = stepBenefits.find((b) => b.step === currentStep)
    if (!benefit || currentStep === 5) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            {benefit.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
            <p className="text-slate-300 mb-3">{benefit.description}</p>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 px-3 py-1">{benefit.stat}</Badge>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render recruitment stats carousel
  const renderRecruitmentStats = () => {
    return (
      <div className="relative h-[100px] mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStat}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${statsData[currentStat].bgClass} rounded-xl p-4 shadow-lg border`}
          >
            <div className="flex items-center gap-3">
              {statsData[currentStat].icon}
              <div>
                <div className="text-2xl font-bold text-white">{statsData[currentStat].value}</div>
                <div className="text-sm text-blue-100">{statsData[currentStat].label}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {statsData.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStat ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Render testimonial
  const renderTestimonial = () => {
    const testimonial = testimonials[currentTestimonial]

    return (
      <motion.div
        key={currentTestimonial}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 mb-6"
      >
        <div className="text-lg font-medium text-white mb-4 italic">"{testimonial.quote}"</div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">{testimonial.author[0]}</span>
          </div>
          <div>
            <div className="font-medium text-white">{testimonial.author}</div>
            <div className="text-sm text-slate-400">{testimonial.role}</div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-[70%] h-[80%] opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[20%] w-[40vh] h-[40vh] rounded-full bg-cyan-500/20 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] right-[30%] w-[35vh] h-[35vh] rounded-full bg-indigo-500/20 blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-[20%] right-[10%] w-[30vh] h-[30vh] rounded-full bg-blue-500/20 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Header */}
      <header className="bg-slate-100/90 backdrop-blur-sm shadow-sm py-4 px-6 border-b border-slate-300 relative z-10">
        <div className="container mx-auto flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-r from-cyan-500 to-blue-600">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">R</div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              RecruitAI
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left side - Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-slate-100/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-300 p-6 md:p-8 h-full">
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}

                {/* Step indicator */}
                {renderStepIndicator()}

                {/* Form */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

                  {/* Navigation buttons */}
                  {currentStep < 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between mt-8 pt-4 border-t border-gray-100"
                    >
                      {currentStep > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="px-6 py-2 border border-slate-400 bg-white rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              Create Account
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </motion.div>
                  )}
                </form>

                {/* Sign in link */}
                {currentStep < 5 && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Benefits and Stats */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              {/* Current step benefit */}
              <AnimatePresence mode="wait">{currentStep < 5 && renderCurrentBenefit()}</AnimatePresence>

              {/* Recruitment stats carousel */}
              {currentStep < 5 && renderRecruitmentStats()}

              {/* Testimonial */}
              <AnimatePresence mode="wait">{currentStep < 5 && renderTestimonial()}</AnimatePresence>

              {/* Path to better hiring */}
              {currentStep < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg border border-slate-700"
                >
                  <h3 className="text-lg font-bold text-white mb-3">Your Path to Better Hiring</h3>
                  <div className="space-y-3">
                    {[
                      { step: 1, text: "Create your account", icon: <User className="h-4 w-4" /> },
                      { step: 2, text: "Set up your profile", icon: <UserCircle className="h-4 w-4" /> },
                      { step: 3, text: "Connect your company", icon: <Building2 className="h-4 w-4" /> },
                      { step: 4, text: "Define your needs", icon: <Briefcase className="h-4 w-4" /> },
                      { step: 5, text: "Start finding top talent", icon: <Award className="h-4 w-4" /> },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-2">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            currentStep > item.step
                              ? "bg-green-500 text-white"
                              : currentStep === item.step
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {currentStep > item.step ? <CheckCircle className="h-3 w-3" /> : item.icon}
                        </div>
                        <div
                          className={`text-xs ${
                            currentStep > item.step
                              ? "text-green-400"
                              : currentStep === item.step
                                ? "text-white font-medium"
                                : "text-slate-400"
                          }`}
                        >
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-slate-600 text-sm bg-slate-200/50 border-t border-slate-300 relative z-10">
        <p>&copy; {new Date().getFullYear()} RecruitAI. All rights reserved.</p>
      </footer>
    </div>
  )
}