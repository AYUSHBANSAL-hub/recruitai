"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CheckCircle,
  Brain,
  Users,
  FileText,
  Clock,
  Shield,
  Award,
  MessageSquare,
  Briefcase,
  Search,
  ChevronDown,
  X,
  Zap,
  Calendar,
  PieChart,
  Database,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarCircles } from "@/components/AvatarCircle"

export default function LandingPage() {
  // Refs for scroll animations
  const heroRef = useRef(null)
  const problemRef = useRef(null)
  const solutionRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)
  const ctaRef = useRef(null)

  // InView hooks for triggering animations
  const heroInView = useInView(heroRef, { once: false, amount: 0.2 })
  const problemInView = useInView(problemRef, { once: false, amount: 0.2 })
  const solutionInView = useInView(solutionRef, { once: false, amount: 0.2 })
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 })
  const statsInView = useInView(statsRef, { once: false, amount: 0.2 })
  const howItWorksInView = useInView(howItWorksRef, { once: false, amount: 0.2 })
  const testimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.2 })
  const pricingInView = useInView(pricingRef, { once: false, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.2 })

  // Scroll animations
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Animation for counter
  const [applicationCount, setApplicationCount] = useState(0)
  const [timeValue, setTimeValue] = useState(0)
  const [qualityCandidates, setQualityCandidates] = useState(0)

  useEffect(() => {
    if (problemInView) {
      const appInterval = setInterval(() => {
        setApplicationCount((prev) => {
          if (prev < 350) return prev + 7
          clearInterval(appInterval)
          return 350
        })
      }, 30)

      const timeInterval = setInterval(() => {
        setTimeValue((prev) => {
          if (prev < 85) return prev + 1
          clearInterval(timeInterval)
          return 85
        })
      }, 40)

      const qualityInterval = setInterval(() => {
        setQualityCandidates((prev) => {
          if (prev < 42) return prev + 1
          clearInterval(qualityInterval)
          return 42
        })
      }, 60)

      return () => {
        clearInterval(appInterval)
        clearInterval(timeInterval)
        clearInterval(qualityInterval)
      }
    }
  }, [problemInView])

  // Features data
  const features = [
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
      icon: <TrendingUp className="h-6 w-6 text-white" />,
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
  const testimonials = [
    {
      quote:
        "We used to spend 18 hours per week just sorting through resumes. With HirezApp, we've cut that down to just 2 hours, and the quality of our shortlists has dramatically improved. The ROI was immediate.",
      author: "Sarah Johnson",
      title: "Head of Talent Acquisition, TechGlobal Inc.",
      avatar: "/placeholder.svg?height=80&width=80",
      metrics: {
        "Screening time reduction": "89%",
        "Increase in quality of hires": "42%",
      },
    },
    {
      quote:
        "What impressed me most was the accuracy. The AI found patterns in successful employees that we hadn't noticed ourselves and now uses those insights to identify promising candidates that we would have overlooked.",
      author: "Michael Chen",
      title: "CTO, Innovate Solutions",
      avatar: "/placeholder.svg?height=80&width=80",
      metrics: {
        "Candidate quality improvement": "65%",
        "Technical talent match accuracy": "93%",
      },
    },
    {
      quote:
        "As a fast-growing startup, we couldn't afford to make hiring mistakes. HirezApp not only streamlined our process but actually increased our diversity hiring by surfacing qualified candidates we would have missed with traditional screening.",
      author: "Emily Rodriguez",
      title: "VP of Human Resources, Global Enterprises",
      avatar: "/placeholder.svg?height=80&width=80",
      metrics: {
        "Time-to-hire reduction": "41%",
        "Diversity in talent pipeline": "+58%",
      },
    },
  ]

  // Pricing plans
  const plans = [
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
  const stats = [
    { value: "76%", label: "Reduction in screening time" },
    { value: "3.5x", label: "Increase in qualified candidates" },
    { value: "41%", label: "Decrease in time-to-hire" },
    { value: "95%", label: "Matching accuracy" },
  ]

  // Problem statements to cycle through
  const problemStatements = [
    "Missing top talent in a sea of applications",
    "Wasting hours on manual resume screening",
    "Struggling with biased hiring decisions",
    "Unable to measure recruitment ROI effectively",
  ]
  const avatarUrls = [
    "https://avatars.githubusercontent.com/u/16860528",
    "https://avatars.githubusercontent.com/u/20110627",
    "https://avatars.githubusercontent.com/u/106103625",
    "https://avatars.githubusercontent.com/u/59228569",
  ];

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problemStatements.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden bg-slate-950">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-[70%] h-[80%] opacity-30">
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

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-r from-cyan-500 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  HirezApp
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#problem" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                The Problem
              </Link>
              <Link href="#solution" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Our Solution
              </Link>
              <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-slate-950 text-white">
        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Badge className="mb-4 px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-full">
                  <Zap className="w-3.5 h-3.5 mr-1" /> AI-POWERED TALENT ACQUISITION
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Don't Just Hire.
                  </span>{" "}
                  <br />
                  <span className="text-white">
                    Discover Your <span className="relative">
                      Perfect
                      <motion.span
                        className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </span>{" "} Match.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                  <span className="font-semibold text-white">Drowning in applications?</span> Our data-driven AI
                  platform helps you cut through the noise to find exceptional candidates hiding in your applicant pool.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="rounded-md px-8 py-6 text-base font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0"
                    >
                      Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#problem">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-md px-8 py-6 text-base font-medium border-slate-700 text-white bg-transparent hover:bg-slate-800 hover:text-white"
                    >
                      See The Problem
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start">
                <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
                  <div className="ml-3 text-sm text-slate-400">
                    <span className="font-medium text-cyan-400">500+</span> companies making data-driven hiring
                    decisions
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-slate-900 backdrop-blur-sm border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                    <Image
                      src="/dashboard.jpeg"
                      alt="HirezApp Dashboard"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />

                    {/* Animated overlay elements suggesting AI analysis */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent">
                      <div className="absolute bottom-8 left-0 right-0 px-6">
                        <div className="text-xs text-cyan-400 mb-1 flex items-center">
                          <Brain className="w-3 h-3 mr-1" /> AI ANALYSIS COMPLETE
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-white">Candidate Match Scoring</div>
                          <div className="text-xs text-slate-400">42 candidates analyzed</div>
                        </div>
                        <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: "78%" }}
                            transition={{ duration: 1.5, delay: 0.7 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -top-6 -right-6 bg-slate-900 rounded-lg shadow-lg p-3 border border-slate-800"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Ideal Match Found</p>
                        <p className="text-xs text-slate-400">98% match for Senior Developer</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 bg-slate-900 rounded-lg shadow-lg p-3 border border-slate-800"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Candidate Insights</p>
                        <p className="text-xs text-slate-400">Top 5% leadership potential</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section id="problem" ref={problemRef} className="py-10 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-rose-500/10 text-rose-400 border-rose-500/20 rounded-full">
                The Problem
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Recruitment Is Broken <span className="text-rose-400">.</span>
              </h2>
              <div className="relative h-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProblemIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <p className="text-xl md:text-2xl text-white font-medium">
                      {problemStatements[currentProblemIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-6xl font-bold text-cyan-400 mb-2">{applicationCount}</div>
                <div className="text-lg font-medium mb-3">Applications per position</div>
                <p className="text-slate-400 mb-4">
                  The average corporate job opening receives hundreds of applications, making manual review nearly
                  impossible.
                </p>
                <Progress value={applicationCount / 5} className="h-2 bg-slate-700">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" />
                </Progress>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-6xl font-bold text-cyan-400 mb-2">{timeValue}%</div>
                <div className="text-lg font-medium mb-3">Time wasted on screening</div>
                <p className="text-slate-400 mb-4">
                  HR teams spend most of their time on administrative screening rather than engaging top talent.
                </p>
                <Progress value={timeValue} className="h-2 bg-slate-700">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                </Progress>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-6xl font-bold text-cyan-400 mb-2">{qualityCandidates}</div>
                <div className="text-lg font-medium mb-3">Quality candidates missed</div>
                <p className="text-slate-400 mb-4">
                  On average, traditional screening methods overlook more than 40% of qualified candidates.
                </p>
                <Progress value={qualityCandidates * 2} className="h-2 bg-slate-700">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                </Progress>
              </motion.div>
            </div>

            <div className="mt-16 bg-slate-800/30 border border-slate-700 rounded-xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Traditional Hiring Is Broken</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-rose-400 flex-shrink-0 mr-2 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-medium text-white">LinkedIn and job portals</span> flood you with hundreds
                        of unfiltered applications
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-rose-400 flex-shrink-0 mr-2 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-medium text-white">Manual screening</span> is time-consuming and prone to
                        unconscious bias
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-rose-400 flex-shrink-0 mr-2 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-medium text-white">Keyword-based filtering</span> misses qualified
                        candidates who don't use the exact terminology
                      </span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-rose-400 flex-shrink-0 mr-2 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-medium text-white">CXOs and HR leaders</span> waste valuable time
                        reviewing unsuitable applications
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-transparent rounded-lg blur-xl opacity-30" />
                  <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Search className="h-4 w-4 text-slate-400 mr-2" />
                          <span className="text-sm text-slate-400">Searching applications...</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          350+ Applications
                        </Badge>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-rose-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, delay: i * 0.5, repeat: Number.POSITIVE_INFINITY }}
                          className="flex items-center p-3 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <div className="h-10 w-10 rounded-full bg-slate-700 mr-3 overflow-hidden">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Candidate" />
                              <AvatarFallback className="bg-slate-700 text-white">A</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-slate-700 rounded-full mb-2"></div>
                            <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
                          </div>
                          <div className="ml-2">
                            <div className="h-6 w-6 rounded-full bg-slate-700"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                      <div className="flex items-center text-rose-400 text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Time estimate: 18+ hours for manual review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" ref={howItWorksRef} className="py-24  relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-full">
                Simple Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How HirezApp Works</h2>
              <p className="text-lg text-slate-300">
                A streamlined workflow powered by sophisticated AI that integrates seamlessly with your existing
                processes
              </p>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform -translate-x-1/2 hidden md:block" />

              <div className="space-y-24 md:space-y-0 relative">
                {[
                  {
                    step: "01",
                    title: "Connect Your Data Sources",
                    description:
                      "Integrate with LinkedIn, job boards, your ATS, or upload resumes directly. Our system handles all major formats and maintains data integrity.",
                    icon: <Database className="h-6 w-6 text-white" />,
                    detailPoints: [
                      "Automatic data normalization across platforms",
                      "Secure API connections to major job boards",
                      "Real-time synchronization with your ATS",
                    ],
                  },
                  {
                    step: "02",
                    title: "Define Your Ideal Candidate Profile",
                    description:
                      "Set up your custom requirements including must-have skills, experience levels, and cultural attributes that matter to your organization.",
                    icon: <Users className="h-6 w-6 text-white" />,
                    detailPoints: [
                      "Customizable scoring criteria",
                      "Weight different factors based on importance",
                      "Build from successful hire patterns",
                    ],
                  },
                  {
                    step: "03",
                    title: "AI Analysis & Ranking",
                    description:
                      "Our proprietary algorithms analyze thousands of data points to identify the best matches and provide detailed insights on each candidate.",
                    icon: <Brain className="h-6 w-6 text-white" />,
                    detailPoints: [
                      "Deep semantic understanding of job requirements",
                      "Advanced pattern recognition in career trajectories",
                      "Contextual skill evaluation beyond keywords",
                    ],
                  },
                  {
                    step: "04",
                    title: "Review & Take Action",
                    description:
                      "Explore AI-generated shortlists and detailed candidate profiles to make informed decisions faster than ever before.",
                    icon: <Award className="h-6 w-6 text-white" />,
                    detailPoints: [
                      "Visual comparison of top candidates",
                      "One-click scheduling for interviews",
                      "Collaborative team evaluation tools",
                    ],
                  },
                ].map((item, index) => (
                  <div key={index} className={`md:flex items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 relative group hover:border-cyan-500/50 transition-all"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                        <div className="relative">
                          <div className="text-sm font-bold text-cyan-400 mb-2">{item.step}</div>
                          <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                          <p className="text-slate-300 mb-4">{item.description}</p>
                          <ul className={`space-y-2 text-sm text-slate-400 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                            {item.detailPoints.map((point, i) => (
                              <li key={i} className={`flex items-center ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 mr-2"></div>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>

                    <div className="hidden md:flex justify-center items-center relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center z-10"
                      >
                        {item.icon}
                      </motion.div>
                    </div>

                    <div className="md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" ref={solutionRef} className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={solutionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-full">
                The Solution
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Data-Driven Talent Acquisition <span className="text-cyan-400">.</span>
              </h2>
              <p className="text-lg text-slate-300">
                HirezApp transforms your hiring process through advanced machine learning algorithms developed by
                expert AI engineers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 shadow-lg p-6 md:p-8 relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xl opacity-20" />
                  <Tabs defaultValue="candidates" className="relative">
                    <TabsList className="mb-6 bg-slate-800 border border-slate-700">
                      <TabsTrigger
                        value="candidates"
                        className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                      >
                        Candidate View
                      </TabsTrigger>
                      <TabsTrigger
                        value="insights"
                        className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                      >
                        AI Insights
                      </TabsTrigger>
                      <TabsTrigger
                        value="metrics"
                        className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                      >
                        Metrics
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="candidates">
                      <div className="space-y-4">
                        {[
                          {
                            name: "Sarah Miller",
                            role: "UI/UX Designer",
                            match: 95,
                            tags: ["Design Systems", "Figma Expert"],
                          },
                          {
                            name: "James Wilson",
                            role: "Frontend Developer",
                            match: 88,
                            tags: ["React", "TypeScript"],
                          },
                          { name: "Alex Johnson", role: "Product Manager", match: 82, tags: ["Agile", "B2B SaaS"] },
                        ].map((candidate, i) => (
                          <div
                            key={i}
                            className="flex items-center p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all group gap-4"
                          >
                              <Avatar>
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Candidate" />
                                <AvatarFallback className="bg-slate-700 text-white">A</AvatarFallback>
                              </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-white">{candidate.name}</h4>
                                <div className="flex items-center">
                                  <div
                                    className={`h-2 w-2 rounded-full ${candidate.match > 90 ? "bg-green-500" : "bg-yellow-500"} mr-2`}
                                  ></div>
                                  <span
                                    className={`text-sm font-medium ${candidate.match > 90 ? "text-green-500" : "text-yellow-500"}`}
                                  >
                                    {candidate.match}% match
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-slate-400">{candidate.role}</div>
                              <div className="flex mt-2 space-x-2">
                                {candidate.tags.map((tag, j) => (
                                  <Badge
                                    key={j}
                                    variant="outline"
                                    className="text-xs bg-slate-800 border-slate-700 text-slate-300"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-center text-cyan-400 text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Time saved: 16+ hours of manual screening</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="insights">
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <h4 className="font-medium text-white mb-2">Skill Gap Analysis</h4>
                          <p className="text-sm text-slate-300 mb-3">Top missing skills in your candidate pool:</p>
                          <div className="space-y-2">
                            {[
                              { skill: "Advanced Data Structures", importance: 85 },
                              { skill: "Systems Design", importance: 72 },
                              { skill: "Cloud Infrastructure", importance: 68 },
                            ].map((item, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-300">{item.skill}</span>
                                  <span className="text-cyan-400">{item.importance}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                    style={{ width: `${item.importance}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <h4 className="font-medium text-white mb-2">Performance Predictions</h4>
                          <p className="text-sm text-slate-300 mb-3">Based on historical hiring success:</p>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { metric: "Retention Likelihood", value: "94%" },
                              { metric: "Team Fit Score", value: "High" },
                              { metric: "Productivity Index", value: "8.5/10" },
                              { metric: "Learning Potential", value: "Very High" },
                            ].map((item, i) => (
                              <div key={i} className="bg-slate-800 rounded p-3 border border-slate-700">
                                <div className="text-xs text-slate-400">{item.metric}</div>
                                <div className="text-lg font-medium text-white">{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="metrics">
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <h4 className="font-medium text-white mb-3">Recruitment Analytics</h4>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                              { label: "Applications", value: "350+" },
                              { label: "Time Saved", value: "76%" },
                              { label: "Qualified Candidates", value: "42" },
                              { label: "AI-Assisted Interviews", value: "18" },
                            ].map((stat, i) => (
                              <div key={i} className="bg-slate-800 p-3 rounded border border-slate-700">
                                <div className="text-xs text-slate-400">{stat.label}</div>
                                <div className="text-lg font-medium text-white">{stat.value}</div>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 rounded bg-slate-800 border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-slate-300">Screening Efficiency</span>
                              <span className="text-sm font-medium text-cyan-400">4.2x faster</span>
                            </div>
                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full w-[80%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="flex items-center text-green-400 text-sm">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            <span>ROI: $42,800 in saved recruiting costs</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      HirezApp Transforms Your Process
                    </span>
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                      </div>
                      <div>
                        <span className="font-medium text-white block mb-1">Intelligent Candidate Matching</span>
                        <p className="text-slate-300">
                          Our advanced ML algorithms analyze thousands of data points to find the perfect match between
                          candidates and your open positions.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                      </div>
                      <div>
                        <span className="font-medium text-white block mb-1">Bias-Free Evaluation</span>
                        <p className="text-slate-300">
                          Our algorithms focus solely on skills, experience, and performance indicators—not demographic
                          factors—to ensure fair assessments.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                      </div>
                      <div>
                        <span className="font-medium text-white block mb-1">Executive-Ready Reports</span>
                        <p className="text-slate-300">
                          Get comprehensive insights on your talent pool with visual analytics designed for busy
                          executives and hiring managers.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                      </div>
                      <div>
                        <span className="font-medium text-white block mb-1">Continuous Learning</span>
                        <p className="text-slate-300">
                          Our system learns from your hiring decisions to continuously improve matching accuracy and
                          tailor recommendations to your company culture.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Schedule a Demo</h4>
                      <p className="text-sm text-slate-400">
                        See the technology in action with your actual job openings
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Book 30-minute demo
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-full">
                Core Technologies
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Cutting-Edge AI Recruitment Platform</h2>
              <p className="text-lg text-slate-300">
                Built by experts in machine learning and natural language processing specifically for talent acquisition
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className={`absolute inset-0 ${feature.color} opacity-90`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-900/40" />

                  <div className="relative p-6 h-full flex flex-col">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-200 mb-4 flex-grow">{feature.description}</p>
                    <Badge className="self-start bg-white/10 text-white border-white/20">{feature.highlight}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-full">
                Real Results
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Data-Backed Performance</h2>
              <p className="text-lg text-slate-300">
                Our customers achieve measurable improvements in their hiring metrics
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800 text-center relative group hover:border-cyan-500/50 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="relative">
                    <div className="text-4xl font-bold text-cyan-500 mb-2">{stat.value}</div>
                    <div className="text-slate-300">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" ref={testimonialsRef} className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex w-full items-center justify-center py-4">
              <div className="flex items-center rounded-full border border-border bg-background p-1 shadow shadow-black/5 w-fit">
      <div className="flex -space-x-1.5">
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-03.jpg"
          width={20}
          height={20}
          alt="Avatar 01"
        />
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-04.jpg"
          width={20}
          height={20}
          alt="Avatar 02"
        />
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-05.jpg"
          width={20}
          height={20}
          alt="Avatar 03"
        />
        <img
          className="rounded-full ring-1 ring-background"
          src="https://originui.com/avatar-80-06.jpg"
          width={20}
          height={20}
          alt="Avatar 04"
        />
      </div>
      <p className="px-2 text-xs text-muted-foreground">
        Trusted by <strong className="font-medium text-foreground">60K+</strong> developers.
      </p>
    </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Customers Say</h2>
              <p className="text-lg text-slate-300">
                Hear from HR leaders and executives who have transformed their hiring process with HirezApp
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800 shadow-lg relative group hover:border-cyan-500/50 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-6xl text-cyan-500/10 font-serif">
                    "
                  </div>
                  <div className="relative">
                    <p className="text-slate-300 mb-6 relative z-10">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Candidate" />
                          <AvatarFallback className="bg-slate-700 text-white">A</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="font-medium text-white">{testimonial.author}</div>
                        <div className="text-sm text-slate-400">{testimonial.title}</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {Object.entries(testimonial.metrics).map(([key, value], i) => (
                        <div key={i} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                          <div className="text-xs text-slate-400">{key}</div>
                          <div className="text-lg font-semibold text-cyan-400">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" ref={pricingRef} className="py-24  relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-full">
                Pricing Plans
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Scalable Solutions for Every Team</h2>
              <p className="text-lg text-slate-300">
                Choose the plan that's right for your hiring needs with our transparent, value-based pricing
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col justify-between bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border ${plan.popular ? "border-cyan-500 shadow-lg shadow-cyan-500/10" : "border-slate-700 hover:border-slate-600"} overflow-hidden group transition-all h-full`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="flex h-full flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-cyan-400 flex-shrink-0 mr-2" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  </div>
                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0" : "bg-transparent border border-slate-700 text-white hover:bg-slate-700"}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-24 bg-gradient-to-r from-cyan-950 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <motion.div
              className="absolute top-[10%] left-[20%] w-[60vh] h-[60vh] rounded-full bg-cyan-500/10 blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[10%] right-[20%] w-[50vh] h-[50vh] rounded-full bg-blue-500/10 blur-[100px]"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.1, 0.2],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-white/10 text-white border-white/20 rounded-full">
                Get Started Today
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Hiring Process?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join hundreds of forward-thinking companies using HirezApp to build exceptional teams faster and more
                effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-200 rounded-md px-8 py-6 text-base font-medium"
                  >
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 rounded-md px-8 py-6 text-base font-medium bg-transparent"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-12 px-4 py-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium text-white mb-2">
                    Don't miss out on top talent hiding in your applicant pool
                  </div>
                  <div className="text-slate-400 max-w-2xl mb-6">
                    Every day you wait means more qualified candidates slipping through the cracks. Our data shows the
                    average company misses 42% of ideal candidates using traditional methods.
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#" className="text-white transition-colors">
                      <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Talk to Sales
                      </Button>
                    </Link>
                    <Link href="#" className="text-white transition-colors">
                      <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                        <Briefcase className="h-5 w-5 mr-2" />
                        View Case Studies
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Stay Updated</h3>
              <p className="text-slate-400 mb-6">
                Subscribe to our newsletter for the latest product updates, industry insights, and recruitment tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-md border-slate-700 bg-slate-900 text-white focus:border-cyan-500 focus:ring-cyan-500"
                />
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-r from-cyan-500 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  HirezApp
                </span>
              </Link>
              <p className="text-slate-400 text-sm mb-4">
                Transforming recruitment with data-driven AI to help companies build exceptional teams faster and more
                effectively.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "linkedin", "instagram"].map((social) => (
                  <a key={social} href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-cyan-500/50 transition-colors">
                      <span className="text-xs">{social[0].toUpperCase()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Case Studies", "Reviews", "Updates"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Press", "Partners", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Documentation", "Help Center", "API", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Security", "Cookies", "Compliance"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} HirezApp. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}