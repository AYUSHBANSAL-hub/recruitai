import { Brain, Briefcase, Building2, CheckCheck, Clock, Lock, TrendingUp, User, UserCircle } from "lucide-react"

// Form steps
export const steps = [
    { id: 1, title: "Account", icon: <User className="h-5 w-5" /> },
    { id: 2, title: "Personal", icon: <UserCircle className="h-5 w-5" /> },
    { id: 3, title: "Company", icon: <Building2 className="h-5 w-5" /> },
    { id: 4, title: "Role", icon: <Briefcase className="h-5 w-5" /> },
    { id: 5, title: "Complete", icon: <CheckCheck className="h-5 w-5" /> },
  ]
  
  // Industry options
export const industries = [
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
export const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001-5000 employees",
    "5001+ employees",
  ]
  
  // Department options
export const departments = [
    "Human Resources",
    "Talent Acquisition",
    "Executive Leadership",
    "Operations",
    "Administration",
    "Other",
  ]
  
  // Benefits for each step
export const stepBenefits = [
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
export const testimonials = [
    {
      quote: "HirezApp cut our screening time by 89% and improved our quality of hires dramatically.",
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
export const statsData = [
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