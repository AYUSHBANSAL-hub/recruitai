"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Users, FileText, Clock } from "lucide-react";
import FormsList from "./forms/page";

interface Form {
  id: string;
  title: string;
  createdAt: string;
  active: boolean;
}

interface Application {
  id: string;
  status: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📢 Fetching forms and applications...");

        const [formsRes, applicationsRes] = await Promise.all([
          fetch("/api/forms"),
          fetch("/api/applications"),
        ]);

        if (!formsRes.ok || !applicationsRes.ok) {
          throw new Error(
            `Failed to fetch data: Forms ${formsRes.status}, Applications ${applicationsRes.status}`
          );
        }

        const formsData = await formsRes.json();
        const applicationsData = await applicationsRes.json();

        console.log("✅ Forms Data:", formsData);
        console.log("✅ Applications Data:", applicationsData);

        setForms(formsData);
        setApplications(applicationsData);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeForms = forms.filter((form) => form.active).length;
  const totalApplications = applications.length;
  const pendingReviews = applications.filter(
    (app) => app.status === "PENDING"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Admin Dashboard
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/forms/create")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Create New Form
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Active Forms
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? "..." : activeForms}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Applications
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? "..." : totalApplications}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Pending Review
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {loading ? "..." : pendingReviews}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* <motion.div
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800">Recent Forms</h2>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"
              />
            </div>
          ) : forms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No forms created yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {forms.map((form) => (
                    <motion.tr
                      key={form.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.4)" }}
                      className="transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-gray-800">{form.title}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          form.active 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {form.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        */}
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
          <FormsList />
        </motion.div>
      </motion.div>
    </div>
  );
}
