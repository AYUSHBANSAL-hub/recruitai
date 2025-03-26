import { Mail, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EmailPreviewProps {
  status: "SHORTLISTED" | "REJECTED"
  candidateName: string
  jobTitle: string
  applicationDate?: string
  hasCalendarLink?: boolean
}

export default function EmailPreview({
  status,
  candidateName,
  jobTitle,
  applicationDate = "January 15, 2024",
  hasCalendarLink = false,
}: EmailPreviewProps) {
  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center gap-2 bg-indigo-600 text-white">
        <Mail className="h-5 w-5" />
        <CardTitle className="text-sm font-medium">Email Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {status === "SHORTLISTED" ? (
          <div className="space-y-0">
            <div className="flex items-center gap-2 p-3 border-b bg-indigo-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="font-medium text-sm">
                Subject: Congratulations! You've been shortlisted for {jobTitle} | Recruit AI
              </p>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="bg-green-100 text-green-800 p-2 text-center text-xs font-medium rounded">
                Congratulations! Your application has been shortlisted
              </div>

              <p>Hello {candidateName},</p>

              <p>
                Great news! We're pleased to inform you that you've been shortlisted for the <strong>{jobTitle}</strong>{" "}
                position that you applied for on {applicationDate}.
              </p>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 text-xs">
                <p>
                  <strong>Application Status:</strong> Shortlisted
                </p>
                <p>
                  <strong>Position:</strong> {jobTitle}
                </p>
                <p>
                  <strong>Application Date:</strong> {applicationDate}
                </p>
              </div>

              <p>
                Your qualifications, experience, and skills have impressed our hiring team, and we would like to invite
                you to the next stage of our selection process.
              </p>

              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium text-indigo-700">Next Steps</p>
                <p>
                  Please schedule an interview with our hiring team. You'll be able to select a date and time that works
                  best for you.
                </p>
              </div>

              {hasCalendarLink && (
                <div className="text-center my-3">
                  <span className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-medium inline-block">
                    Schedule Your Interview
                  </span>
                </div>
              )}

              <p>
                Best regards,
                <br />
                Recruit AI Team
              </p>

              <div className="text-center text-xs text-gray-500 border-t pt-3 mt-4">
                © {new Date().getFullYear()} Recruit AI. All rights reserved.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            <div className="flex items-center gap-2 p-3 border-b bg-indigo-50">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <p className="font-medium text-sm">Subject: Update on your {jobTitle} application | Recruit AI</p>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p>Hello {candidateName},</p>

              <p>
                Thank you for your interest in the <strong>{jobTitle}</strong> position at our company and for taking
                the time to submit your application on {applicationDate}.
              </p>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 text-xs">
                <p>
                  <strong>Application Status:</strong> Not Selected
                </p>
                <p>
                  <strong>Position:</strong> {jobTitle}
                </p>
                <p>
                  <strong>Application Date:</strong> {applicationDate}
                </p>
              </div>

              <p>
                After careful consideration of all applications, we regret to inform you that we have decided to move
                forward with other candidates whose qualifications more closely align with our current needs for this
                specific role.
              </p>

              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium text-indigo-700">What's Next?</p>
                <p>
                  We encourage you to apply for future positions that match your skills and experience. We retain all
                  applications for six months and will consider your profile for upcoming opportunities.
                </p>
              </div>

              <p>
                Best regards,
                <br />
                Recruit AI Team
              </p>

              <div className="text-center text-xs text-gray-500 border-t pt-3 mt-4">
                © {new Date().getFullYear()} Recruit AI. All rights reserved.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}