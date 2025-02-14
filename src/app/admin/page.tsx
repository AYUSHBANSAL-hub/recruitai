"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function AdminDashboard() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching forms and applications...");
  
        const [formsRes, applicationsRes] = await Promise.all([
          fetch('/api/forms'), // ✅ Fetch all forms
          fetch('/api/applications'), // ✅ Fetch all applications
        ]);
  
        console.log("Forms Response Status:", formsRes.status);
        console.log("Applications Response Status:", applicationsRes.status);
  
        if (!formsRes.ok || !applicationsRes.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const formsData = await formsRes.json();
        const applicationsData = await applicationsRes.json();
  
        console.log("Forms Data:", formsData);
        console.log("Applications Data:", applicationsData);
  
        setForms(formsData);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
    <div className="container text-black mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => router.push("/admin/forms/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Active Forms</h3>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? "..." : activeForms}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">
            {loading ? "..." : totalApplications}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {loading ? "..." : pendingReviews}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Forms</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : forms.length === 0 ? (
            <p className="p-4 text-gray-500">No forms created yet</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Title</th>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id} className="border-t">
                    <td className="px-4 py-2">{form.title}</td>
                    <td className="px-4 py-2">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {form.active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
