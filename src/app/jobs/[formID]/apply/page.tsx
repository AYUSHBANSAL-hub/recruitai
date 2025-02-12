
// src/app/jobs/[formId]/apply/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUpload from '@/components/ResumeUpload';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface JobForm {
  id: string;
  title: string;
  jobDescription: string;
  fields: FormField[];
}

export default function ApplicationPage({ params }: { params: { formId: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<JobForm | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${params.formId}`);
        if (!res.ok) throw new Error('Failed to fetch form');
        const data = await res.json();
        setForm(data);
      } catch (err) {
        setError('Failed to load application form');
      }
    };
    fetchForm();
  }, [params.formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      setError('Please upload your resume');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: params.formId,
          responses,
          resumeUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit application');

      router.push('/applications/success');
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
        <div className="bg-gray-50 p-4 rounded mb-8">
          <h2 className="font-semibold mb-2">Job Description</h2>
          <p className="whitespace-pre-wrap">{form.jobDescription}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                />
              )}
            </div>
          ))}

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
            <ResumeUpload onUploadComplete={setResumeUrl} />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}