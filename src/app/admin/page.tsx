// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobForm {
  id: string;
  title: string;
  createdAt: string;
  active: boolean;
}

export default function AdminDashboard() {
  const [forms, setForms] = useState<JobForm[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [pendingReview, setPendingReview] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        setForms(data.forms);
        setTotalApplications(data.totalApplications);
        setPendingReview(data.pendingReview);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container text-black mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push('/admin/forms/create')}
        >
          Create New Form
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Active Forms</h3>
          <p className="text-3xl font-bold text-blue-600">{forms.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">{totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingReview}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Forms</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {forms.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4">Title</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id} className="border-t">
                    <td className="p-4">{form.title}</td>
                    <td className="p-4">{new Date(form.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded ${form.active ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500">No forms created yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
