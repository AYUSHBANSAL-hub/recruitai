// /admin/forms/[formId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Application {
  id: string;
  userId: string;
  responses: { [key: string]: string };
  resumeUrl: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';
}

export default function ApplicationsList() {
  const router = useRouter();
  const { formId } = useParams();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/applications?formId=${formId}`);
        if (!res.ok) throw new Error('Failed to fetch applications');

        const data = await res.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [formId]);

  const updateStatus = async (appId: string, newStatus: Application['status']) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err: any) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Applications</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4">{app.userId}</td>
                  <td className="px-6 py-4">
                    <a href={app.resumeUrl} target="_blank" className="text-blue-600 hover:text-blue-800">
                      View Resume
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-sm font-semibold ${
                      app.status === 'PENDING' ? 'text-yellow-600 bg-yellow-100' :
                      app.status === 'SHORTLISTED' ? 'text-green-600 bg-green-100' :
                      app.status === 'REJECTED' ? 'text-red-600 bg-red-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => updateStatus(app.id, 'SHORTLISTED')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700">
                      Shortlist
                    </button>
                    <button onClick={() => updateStatus(app.id, 'REJECTED')} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700">
                      Reject
                    </button>
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
