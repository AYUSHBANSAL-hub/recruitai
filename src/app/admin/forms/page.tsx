'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Form {
  id: string;
  title: string;
  jobDescription: string;
  createdAt: string;
  active: boolean;
}

export default function FormsList() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch('/api/forms');
        if (!res.ok) throw new Error('Failed to fetch forms');

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
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Job Application Forms</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : forms.length === 0 ? (
        <p className="text-gray-600">No job forms found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apply Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{form.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(form.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-sm font-semibold ${form.active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                      {form.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/forms/${form.id}`} className="text-blue-600 hover:text-blue-800">
                      View Applications
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/jobs/${form.id}/apply`} className="text-green-600 hover:text-green-800 underline">
                      Apply Now
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
