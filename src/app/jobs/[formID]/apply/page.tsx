"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Form {
  id: string;
  title: string;
  jobDescription: string;
  fields: {
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }[];
}

export default function ApplyForm() {
  const router = useRouter();
  const { formId } = useParams(); // ✅ Extracting formId from URL
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    if (!formId) return;

    const fetchForm = async () => {
      try {
        console.log("🔍 Fetching form with ID:", formId);
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) throw new Error("Failed to fetch form");
        const data = await res.json();
        setForm(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (fieldId: string, value: string) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (!formId) throw new Error("❌ Form ID is missing");
  
      console.log("📤 Submitting application for Form ID:", formId);
      let resumeUrl = "";
  
      if (resume) {
        console.log("📤 Uploading resume...");
        const formData = new FormData();
        formData.append("file", resume);
  
        const uploadRes = await fetch("/api/upload-url", {
          method: "POST",
          body: formData,
        });
  
        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(`❌ Resume upload failed: ${uploadError.error}`);
        }
  
        const uploadData = await uploadRes.json();
        resumeUrl = uploadData.fileUrl; // ✅ Ensure the correct public file URL is used
        console.log("✅ Resume uploaded successfully:", resumeUrl);
      }
  
      if (!resumeUrl) throw new Error("❌ Resume upload failed, no URL received");
  
      const applicationData = { formId, responses, resumeUrl };
  
      console.log("📤 Sending application data to API:", applicationData);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });
  
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(`❌ Application submission failed: ${responseData.error}`);
      }
  
      console.log("✅ Application submitted successfully:", responseData);
      alert("🎉 Application submitted successfully!");
      router.push("/");
    } catch (err: any) {
      console.error("❌ Error during submission:", err);
      setError(err.message);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : form ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
          <p className="text-gray-700 mb-6">{form.jobDescription}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                {field.type === "text" || field.type === "email" ? (
                  <input
                    type={field.type}
                    required={field.required}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300"
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    className="mt-1 block w-full rounded-md border-gray-300"
                    rows={3}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                ) : field.type === "select" && field.options ? (
                  <select
                    required={field.required}
                    className="mt-1 block w-full rounded-md border-gray-300"
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    {field.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="mt-1" />
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
              Submit Application
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-600">Form not found.</p>
      )}
    </div>
  );
}
