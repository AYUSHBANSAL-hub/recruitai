"use client"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink } from "lucide-react"

interface CalendarIntegrationProps {
  candidateName: string
  candidateEmail: string
  jobTitle: string
  provider: "calendly" | "cal" | "google"
}

export default function CalendarIntegration({
  candidateName,
  candidateEmail,
  jobTitle,
  provider = "cal",
}: CalendarIntegrationProps) {
  // Generate the appropriate calendar link based on the provider
  const getCalendarLink = () => {
    switch (provider) {
      case "calendly":
        return `https://calendly.com/your-company/interview?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}`
      case "cal":
        return `https://cal.com/your-company/interview?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}&job=${encodeURIComponent(jobTitle)}`
      case "google":
        // This is a simplified example - Google Calendar requires more parameters
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview with ${encodeURIComponent(candidateName)}&details=Job: ${encodeURIComponent(jobTitle)}`
      default:
        return "#"
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-indigo-600" />
        <h3 className="font-medium text-gray-900">Schedule Interview</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Send a calendar invitation to schedule an interview with this candidate.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>Typical duration: 45 minutes</span>
        </div>

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          onClick={() => window.open(getCalendarLink(), "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Scheduling Page
        </Button>
      </div>
    </div>
  )
}

