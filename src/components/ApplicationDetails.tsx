// src/components/ApplicationDetails.tsx
import { useState,useEffect } from "react";
interface ApplicationDetailsProps {
    applicationId: string;
  }
  
  function ApplicationDetails({ applicationId }: ApplicationDetailsProps) {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchDetails();
    }, [applicationId]);
  
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/applications/${applicationId}`);
        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching application details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const updateStatus = async (status: string) => {
      try {
        await fetch(`/api/applications/${applicationId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        fetchDetails();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };
  
    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!details) return null;
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{details.candidate.name}</h2>
            <p className="text-gray-600">{details.candidate.email}</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={details.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="rounded-md border-gray-300"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Match Score</h3>
            <div className="text-4xl font-bold text-blue-600">
              {details.matchScore}%
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Matches</h3>
            <ul className="list-disc list-inside space-y-1">
              {details.matchingQualifications?.map((qual: string, i: number) => (
                <li key={i} className="text-sm">{qual}</li>
              ))}
            </ul>
          </div>
        </div>
  
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Detailed Analysis</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {details.matchReasoning}
          </div>
        </div>
  
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Application Responses</h3>
          <div className="space-y-4">
            {Object.entries(details.responses).map(([question, answer]) => (
              <div key={question} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium mb-1">{question}</div>
                <div className="text-gray-600">{String(answer)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }