"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Lock, Mail, ArrowRight, CheckCircle, Brain, TrendingUp } from "lucide-react"
import { useBearImages } from "@/hooks/useBearImages"
import { useBearAnimation } from "@/hooks/useBearAnimation"
import BearAvatar from "@/components/BearAvatar"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export default function Login() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { watchBearImages, hideBearImages } = useBearImages()
  const { currentBearImage, setCurrentFocus } = useBearAnimation({
    watchBearImages,
    hideBearImages,
    emailLength: email.length,
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
      }

      router.push("/admin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[40vh] h-[40vh] rounded-full bg-cyan-500/20 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[20%] w-[40vh] h-[40vh] rounded-full bg-blue-500/20 blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-[40%] right-[30%] w-[30vh] h-[30vh] rounded-full bg-indigo-500/20 blur-[100px]"
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
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl">
            {/* Left side - Benefits */}
            <div className="hidden lg:block relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,255,0.15),transparent_40%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(100,100,255,0.15),transparent_40%)]"></div>
              </div>

              <div className="relative h-full flex flex-col justify-center p-10 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Transform Your Hiring
                    </span>
                  </h2>

                  <div className="space-y-8">
                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                        <Brain className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-lg mb-2">AI-Powered Matching</h4>
                        <p className="text-slate-300">Find the perfect candidates with 95% matching accuracy</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                        <TrendingUp className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-lg mb-2">Streamlined Process</h4>
                        <p className="text-slate-300">Reduce screening time by 76% and improve hiring quality</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                        <CheckCircle className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-lg mb-2">Data-Driven Decisions</h4>
                        <p className="text-slate-300">Make confident hiring choices backed by powerful analytics</p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="mt-10 p-5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <p className="text-white italic">
                      "RecruitAI cut our screening time by 89% and improved our quality of hires dramatically."
                    </p>
                    <div className="mt-3 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">SJ</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-medium">Sarah Johnson</p>
                        <p className="text-slate-400 text-sm">Head of Talent Acquisition</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-white p-8 md:p-12">
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to access your RecruitAI dashboard</p>
                </div>

                {/* Bear Animation */}
                <div className="flex justify-center mb-8">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-100 rounded-full p-3 shadow-md"
                  >
                    {currentBearImage && <BearAvatar currentImage={currentBearImage} />}
                  </motion.div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="text-red-700">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-500" />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="email"
                        required
                        ref={emailRef}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
                        value={email}
                        onFocus={() => setCurrentFocus("EMAIL")}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-500" />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        required
                        ref={passwordRef}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 transition-all duration-200 outline-none"
                        value={password}
                        onFocus={() => setCurrentFocus("PASSWORD")}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 mt-4 text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Sign up link */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </motion.div>
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

