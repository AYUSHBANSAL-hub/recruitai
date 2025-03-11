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

    // Validate file type (PDF & Word only)
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type)) {
      setError('❌ Please upload a valid PDF or Word document');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      console.log("📤 Requesting upload URL for:", file.name);

      // ✅ Use FormData to send fileType to API
      const formData = new FormData();
      formData.append("fileType", file.type);

      const response = await fetch('/api/upload-url', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.error || '❌ Failed to get upload URL');
      }

      const { uploadUrl, fileUrl } = await response.json();
      console.log("✅ Received upload URL:", uploadUrl);

      // ✅ Upload the file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('❌ Failed to upload file to S3');
      }

      console.log("✅ Resume uploaded successfully:", fileUrl);
      onUploadComplete(fileUrl); // Pass the URL to parent component

    } catch (err: any) {
      setError(err.message);
      console.error("❌ Upload error:", err);
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

      {uploading && <div className="text-center text-gray-600">⏳ Uploading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
}
