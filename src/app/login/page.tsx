'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { useBearImages } from '@/hooks/useBearImages';
import { useBearAnimation } from '@/hooks/useBearAnimation';
import BearAvatar from '@/components/BearAvatar';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export default function Login() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { watchBearImages, hideBearImages } = useBearImages();
  const { currentBearImage, setCurrentFocus } = useBearAnimation({
    watchBearImages,
    hideBearImages,
    emailLength: email.length,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div initial="initial" animate="animate" exit="exit" variants={fadeIn} className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600">Sign in to access your ResumeAI dashboard</p>
        </div>

        {/* Bear Animation */}
        <div className="flex justify-center mb-4">
          {currentBearImage && <BearAvatar currentImage={currentBearImage} />}
        </div>

        <motion.div variants={fadeIn} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          {error && (
            <motion.div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={emailRef}
                  type="email"
                  required
                  className="w-full pl-10 py-3 rounded-lg border-gray-300"
                  value={email}
                  onFocus={() => setCurrentFocus('EMAIL')}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                ref={passwordRef}
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border-gray-300"
                value={password}
                onFocus={() => setCurrentFocus('PASSWORD')}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg">
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
