import { Brain, TrendingUp, Database, FileText, PieChart, Shield } from "lucide-react"

  // Features data
export const features = [
    {
      icon: <Brain className="h-6 w-6 text-white" />,
      title: "AI-Powered Candidate Matching",
      description:
        "Advanced ML algorithms process resume data against job requirements, delivering 95% matching accuracy with natural language understanding.",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      highlight: "95% matching accuracy",
    },
    {
      icon: <Database className="h-6 w-6 text-white" />,
      title: "Smart Resume Parsing",
      description:
        "Instantly extract and categorize skills, experience, education, and achievements from resumes in any format using our proprietary NLP engine.",
      color: "bg-gradient-to-br from-purple-600 to-purple-800",
      highlight: "Any format, instant parsing",
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Dynamic Screening Automation",
      description:
        "Create customized screening workflows that automatically rank, tag, and filter candidates based on your specific hiring criteria.",
      color: "bg-gradient-to-br from-indigo-600 to-indigo-800",
      highlight: "76% time saved on screening",
    },
    {
      icon: <TrendingUp  className="h-6 w-6 text-white" />,
      title: "Predictive Performance Analytics",
      description:
        "Go beyond skills matching with behavioral analysis and performance predictors based on successful hire patterns in your organization.",
      color: "bg-gradient-to-br from-cyan-600 to-cyan-800",
      highlight: "80% better hire retention",
    },
    {
      icon: <PieChart className="h-6 w-6 text-white" />,
      title: "Comprehensive Data Insights",
      description:
        "Gain complete visibility into your talent pipeline with customizable dashboards showing conversion rates, source effectiveness, and diversity metrics.",
      color: "bg-gradient-to-br from-emerald-600 to-emerald-800",
      highlight: "Real-time hiring analytics",
    },
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Enterprise-Grade Security",
      description:
        "Your candidate data is protected with SOC 2 Type II compliance, end-to-end encryption, and GDPR-ready data handling protocols.",
      color: "bg-gradient-to-br from-slate-600 to-slate-800",
      highlight: "SOC 2 Type II certified",
    },
  ]

  // Testimonials data
export const testimonials = [
    {
      quote:
        "We used to spend 18 hours per week just sorting through resumes. With HirezApp, we've cut that down to just 2 hours, and the quality of our shortlists has dramatically improved. The ROI was immediate.",
      author: "Vanshaj Arora",
      title: "Consultant Google(xWF)",
      avatar: "/placeholder.svg?height=80&width=80",
      metrics: {
        "Screening time reduction": "89%",
        "Increase in quality of hires": "42%",
      },
    },
    {
      quote:
        "What impressed me most was the accuracy. The AI found patterns in successful employees that we hadn't noticed ourselves and now uses those insights to identify promising candidates that we would have overlooked.",
      author: "Kishan Maitin",
      title: "Your Web Solutions - Co-Founder",
      avatar: "/placeholder.svg?height=80&width=80",
      metrics: {
        "Candidate quality improvement": "65%",
        "Technical talent match accuracy": "93%",
      },
    },
    {
      quote:
        "As a fast-growing startup, we couldn't afford to make hiring mistakes. HirezApp not only streamlined our process but actually increased our diversity hiring by surfacing qualified candidates we would have missed with traditional screening.",
      author: "Ayush Bansal",
      title: "Acciojob - Product Manager",
      avatar: "/placeholder.svg?height=80&width=80",
      metrics: {
        "Time-to-hire reduction": "41%",
        "Diversity in talent pipeline": "+58%",
      },
    },
  ]

  // Pricing plans
export const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 5 active job postings",
        "AI candidate matching",
        "Basic form builder",
        "Email notifications",
        "Standard support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$249",
      period: "per month",
      description: "Ideal for growing companies",
      features: [
        "Up to 15 active job postings",
        "Advanced AI candidate ranking",
        "Custom form builder with templates",
        "Candidate communication tools",
        "Analytics dashboard",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited job postings",
        "Enterprise-grade AI matching",
        "Advanced analytics and reporting",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  // Stats data
export const stats = [
    { value: "76%", label: "Reduction in screening time" },
    { value: "3.5x", label: "Increase in qualified candidates" },
    { value: "41%", label: "Decrease in time-to-hire" },
    { value: "95%", label: "Matching accuracy" },
  ]

  // Problem statements to cycle through
export const problemStatements = [
    "Missing top talent in a sea of applications",
    "Wasting hours on manual resume screening",
    "Struggling with biased hiring decisions",
    "Unable to measure recruitment ROI effectively",
  ]
export const avatarUrls = [
    "https://avatars.githubusercontent.com/u/16860528",
    "https://avatars.githubusercontent.com/u/20110627",
    "https://avatars.githubusercontent.com/u/106103625",
    "https://avatars.githubusercontent.com/u/59228569",
  ];