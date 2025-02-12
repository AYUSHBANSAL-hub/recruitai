// src/components/ResumeUpload.tsx
'use client';

import { useState } from 'react';

interface ResumeUploadProps {
  onUploadComplete: (fileUrl: string) => void;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Get presigned URL
      const response = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: file.type }),
      });
      
      const { uploadUrl, fileUrl } = await response.json();

      // Upload file directly to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      onUploadComplete(fileUrl);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-sm">Select your resume</span>
          <input
            type='file'
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <div className="text-center text-gray-600">
          Uploading...
        </div>
      )}
      {error && (
        <div className="text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}