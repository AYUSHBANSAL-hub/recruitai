'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Application {
  id: string;
  candidate: {
    name: string;
    email: string;
  };
  matchScore: number;
  status: string;
  submittedAt: string;
}

// Component to handle search params inside Suspense
function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const searchParams = useSearchParams(); // ✅ Wrapped in Suspense
  const formId = searchParams.get('formId');

  useEffect(() => {
    if (formId) {
      fetchApplications(formId);
    }
  }, [formId]);

  const fetchApplications = async (formId: string) => {
    try {
      const res = await fetch(`/api/applications?formId=${formId}`);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Applications List */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Candidates</h2>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {applications.map((app) => (
            <div
              key={app.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedApp === app.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedApp(app.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{app.candidate.name}</h3>
                  <p className="text-sm text-gray-500">{app.candidate.email}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{app.matchScore}%</div>
                  <div className="text-sm text-gray-500">Match</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for Application Details */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow">
        {selectedApp ? (
          <div className="p-8">Showing details for application ID: {selectedApp}</div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Select an application to view details
          </div>
        )}
      </div>
    </div>
  );
}

// Page Component with Suspense
export default function ApplicationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export to CSV
          </button>
        </div>
      </div>

      {/* Wrap ApplicationsList inside Suspense */}
      <Suspense fallback={<div className="text-center text-gray-500">Loading applications...</div>}>
        <ApplicationsList />
      </Suspense>
    </div>
  );
}
