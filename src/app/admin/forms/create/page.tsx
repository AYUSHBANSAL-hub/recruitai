// src/app/admin/forms/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'email';
  label: string;
  required: boolean;
  options?: string[];
}

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [error, setError] = useState('');

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: '',
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined, // Defaults for select dropdowns
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ Ensure we send the auth token manually
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1]}`,
        },
        body: JSON.stringify({ title, jobDescription, fields }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create form');
  
      console.log('Form created successfully:', data);
      router.push('/admin/forms');
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating form:', err);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create Job Application Form</h1>

        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              required
              className="mt-1 p-2 block w-full rounded-md border-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300"
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <input
                      type="text"
                      placeholder="Field Label"
                      className="w-2/3 rounded-md border-gray-300 p-2"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                    <button type="button" onClick={() => removeField(field.id)} className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>

                  {field.type === 'select' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Options</label>
                      <input
                        type="text"
                        placeholder="Comma separated values"
                        className="w-full rounded-md border-gray-300 p-2 mt-1"
                        value={field.options?.join(', ')}
                        onChange={(e) => updateField(field.id, { options: e.target.value.split(', ') })}
                      />
                    </div>
                  )}

                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2">Required</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 space-x-2">
              <button type="button" onClick={() => addField('text')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Add Text</button>
              <button type="button" onClick={() => addField('textarea')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Add TextArea</button>
              <button type="button" onClick={() => addField('select')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Add Select</button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Form</button>
          </div>
        </form>
      </div>
    </div>
  );
}
