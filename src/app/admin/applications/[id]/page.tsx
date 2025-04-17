"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import CalendarIntegration from "@/components/CalendarIntegration"
import EmailPreview from "@/components/EmailPreview"

export default function ApplicationDetail() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`/api/applications/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch application")
        const data = await res.json()
        setApplication(data)
      } catch (error) {
        console.error("Error fetching application:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchApplication()
    }
  }, [params.id])

  const updateStatus = async (status: string) => {
    try {
      setUpdating(true)
      const res = await fetch(`/api/applications/${params.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      const updatedApplication = await res.json()
      setApplication(updatedApplication)

      // Show email preview tab after status update
      if (status === "SHORTLISTED" || status === "REJECTED") {
        setActiveTab("email")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold">Application not found</h2>
        </div>
      </div>
    )
  }

  const candidateName = application.responses["Full Name"] || application.responses["fixed-name"] || "Candidate"
  const candidateEmail = application.responses["Email Address"] || application.responses["fixed-email"] || ""

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle>{candidateName}</CardTitle>
                <p className="text-sm text-gray-500">{candidateEmail}</p>
              </div>
            </div>
            <Badge
              className={
                application.status === "SHORTLISTED"
                  ? "bg-green-100 text-green-800"
                  : application.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : application.status === "REVIEWED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
              }
            >
              {application.status}
            </Badge>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => updateStatus("SHORTLISTED")}
              disabled={application.status === "SHORTLISTED" || updating}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Shortlist
            </Button>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => updateStatus("REJECTED")}
              disabled={application.status === "REJECTED" || updating}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Application Details</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          {(application.status === "SHORTLISTED" || application.status === "REJECTED") && (
            <TabsTrigger value="email">Email Preview</TabsTrigger>
          )}
          {application.status === "SHORTLISTED" && <TabsTrigger value="calendar">Calendar</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          {/* Application details content */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Application Responses</h3>
              <div className="space-y-4">
                {Object.entries(application.responses).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-1">
                      {key
                        .replace(/^fixed-/, "")
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </p>
                    <p className="text-gray-700">{value as string}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <iframe
                  src={application.resumeUrl}
                  className="w-full h-[600px] border rounded"
                  title="Resume Preview"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <EmailPreview
            status={application.status as "SHORTLISTED" | "REJECTED"}
            candidateName={candidateName}
            jobTitle={application.form?.title || "Job Position"}
            applicationDate={new Date(application.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            hasCalendarLink={application.status === "SHORTLISTED"}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <CalendarIntegration
                candidateName={candidateName}
                candidateEmail={candidateEmail}
                jobTitle="Job Position"
                provider="cal"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}