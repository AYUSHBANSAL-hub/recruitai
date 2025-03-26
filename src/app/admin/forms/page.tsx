"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ExternalLink, Calendar, CheckCircle, XCircle } from "lucide-react";

interface Form {
  id: string;
  title: string;
  jobDescription: string;
  createdAt: string;
  active: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/forms");
        if (!res.ok) throw new Error("Failed to fetch forms");
        const data = await res.json();
        setForms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="min-h-screen ">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8"
        >
          Job Application Forms
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : error ? (
          <motion.div 
            variants={fadeIn}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        ) : forms.length === 0 ? (
          <motion.div 
            variants={fadeIn}
            className="text-center text-gray-500 py-12"
          >
            No job forms found.
          </motion.div>
        ) : (
          <motion.div
            variants={fadeIn}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Apply Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {forms.map((form: Form) => (
                    <motion.tr
                      key={form.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.4)" }}
                      className="transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-gray-800">
                        <div className="font-medium">{form.title}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          form.active 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {form.active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          {form.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/forms/${form.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View Applications
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/jobs/${form.id}/apply`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Apply Now
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}