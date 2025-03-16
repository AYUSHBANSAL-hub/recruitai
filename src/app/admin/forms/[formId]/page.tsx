"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Search, ChevronUp, ChevronDown, Info, FileText, User, Award, AlertTriangle, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface Application {
  id: string
  userId?: string | null
  responses: { [key: string]: string }
  resumeUrl: string
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED"
  matchScore?: number | null // ✅ AI-generated match score (0-100)
  matchReasoning?: string | null // ✅ AI's reasoning for the match
  parsedResume?: {
    strengths?: string[] // ✅ Key strengths identified by AI
    weaknesses?: string[] // ✅ Weaknesses or missing skills
  } | null
}

export default function ApplicationsList() {
  const router = useRouter()
  const { formId } = useParams()

  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // New state variables for search, sorting, and filtering
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"matchScore" | "">("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<Application["status"] | "ALL">("ALL")
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/applications?formId=${formId}`)
        if (!res.ok) throw new Error("Failed to fetch applications")

        const data = await res.json()
        setApplications(data)
        setFilteredApplications(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [formId])

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...applications]

    // Apply status filter based on tab or dropdown
    if (activeTab !== "all") {
      result = result.filter((app) => app.status === activeTab.toUpperCase())
    } else if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (app) =>
          app.userId?.toLowerCase().includes(query) ||
          false ||
          Object.values(app.responses).some((response) => response.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    if (sortBy === "matchScore") {
      result.sort((a, b) => {
        const scoreA = a.matchScore ?? -1
        const scoreB = b.matchScore ?? -1

        return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA
      })
    }

    setFilteredApplications(result)
  }, [applications, searchQuery, sortBy, sortDirection, statusFilter, activeTab])

  const updateStatus = async (appId: string, newStatus: Application["status"]) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      setApplications(applications.map((app) => (app.id === appId ? { ...app, status: newStatus } : app)))
    } catch (err: any) {
      console.error("Error updating status:", err)
    }
  }

  const toggleSort = () => {
    if (sortBy !== "matchScore") {
      setSortBy("matchScore")
      setSortDirection("desc")
    } else {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    }
  }

  const toggleRowExpansion = (appId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }))
  }

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Pending</Badge>
      case "REVIEWED":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200">Reviewed</Badge>
      case "SHORTLISTED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Shortlisted</Badge>
        )
      case "REJECTED":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "text-gray-400"
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-teal-600"
    if (score >= 40) return "text-amber-600"
    return "text-rose-600"
  }

  const getScoreProgressColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "bg-gray-200"
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-teal-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-rose-500"
  }

  const countByStatus = (status: Application["status"]) => {
    return applications.filter((app) => app.status === status).length
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Talent Acquisition</h1>
            <p className="text-gray-500 mt-1">Review and manage candidate applications</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search candidates..."
                className="pl-9 border-gray-300 bg-white h-10 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as Application["status"] | "ALL")
                setActiveTab("all")
              }}
            >
              <SelectTrigger className="w-full md:w-40 border-gray-300 bg-white h-10 focus:ring-indigo-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900">{countByStatus("SHORTLISTED")}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{countByStatus("PENDING")}</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{countByStatus("REJECTED")}</p>
                </div>
                <div className="h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-rose-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for filtering */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            setStatusFilter("ALL")
          }}
          className="w-full"
        >
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 rounded-md"
            >
              All Applications
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 rounded-md"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="reviewed"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
            >
              Reviewed
            </TabsTrigger>
            <TabsTrigger
              value="shortlisted"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-md"
            >
              Shortlisted
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 rounded-md"
            >
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="flex justify-center items-center h-60">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-gray-600 font-medium">Loading applications...</p>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-rose-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredApplications.length === 0 ? (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
                    <p className="text-gray-500 max-w-md">
                      No applications match your current filters. Try adjusting your search criteria or check back
                      later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[200px] font-semibold">Candidate</TableHead>
                        <TableHead className="font-semibold">Resume</TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={toggleSort}>
                          <div className="flex items-center gap-1">
                            Match Score
                            {sortBy === "matchScore" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">AI Insights</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <React.Fragment key={app.id}>
                          <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                  {app.userId ? app.userId.charAt(0).toUpperCase() : "A"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{app.userId || "Anonymous Candidate"}</p>
                                  <p className="text-xs text-gray-500">Applied {new Date().toLocaleDateString()}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-medium"
                              >
                                <FileText className="h-4 w-4" />
                                View Resume
                              </a>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className={`font-semibold ${getScoreColor(app.matchScore)}`}>
                                          {app.matchScore !== null ? `${app.matchScore}%` : "N/A"}
                                        </span>
                                        <Info className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <Progress
                                        value={app.matchScore || 0}
                                        max={100}
                                        className="h-2 w-24 bg-gray-100"
                                        indicatorclassname={getScoreProgressColor(app.matchScore)}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-white border border-gray-200 shadow-lg p-3 rounded-lg">
                                    <p className="max-w-xs text-sm">
                                      {app.matchScore && app.matchScore > 80
                                        ? "Excellent match for the position"
                                        : app.matchScore && app.matchScore > 60
                                          ? "Strong match for the position"
                                          : app.matchScore && app.matchScore > 40
                                            ? "Moderate match for the position"
                                            : app.matchScore !== null
                                              ? "Low match for the position"
                                              : "No match score available"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRowExpansion(app.id)}
                                className={`text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 ${
                                  expandedRows[app.id] ? "bg-gray-50" : ""
                                }`}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {expandedRows[app.id] ? "Hide Details" : "View Details"}
                              </Button>
                            </TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                  >
                                    Update Status
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-white border border-gray-200 shadow-lg rounded-lg p-1"
                                >
                                  <DropdownMenuItem
                                    onClick={() => updateStatus(app.id, "REVIEWED")}
                                    className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-700"
                                    disabled={app.status === "REVIEWED"}
                                  >
                                    Mark as Reviewed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateStatus(app.id, "SHORTLISTED")}
                                    className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-700"
                                    disabled={app.status === "SHORTLISTED"}
                                  >
                                    Shortlist Candidate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateStatus(app.id, "REJECTED")}
                                    className="cursor-pointer hover:bg-rose-50 hover:text-rose-700"
                                    disabled={app.status === "REJECTED"}
                                  >
                                    Reject Application
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                          {expandedRows[app.id] && (
                            <TableRow className="bg-gray-50 border-b border-gray-200">
                              <TableCell colSpan={6} className="p-0">
                                <div className="p-6 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-white border-emerald-100 shadow-sm overflow-hidden">
                                      <CardHeader className="bg-emerald-50 py-3 px-4 border-b border-emerald-100">
                                        <div className="flex items-center gap-2">
                                          <Award className="h-5 w-5 text-emerald-600" />
                                          <CardTitle className="text-sm font-semibold text-emerald-800">
                                            Key Strengths
                                          </CardTitle>
                                        </div>
                                      </CardHeader>
                                      <CardContent className="p-4">
                                        {app.parsedResume?.strengths?.length ? (
                                          <ul className="space-y-2">
                                            {app.parsedResume.strengths.map((strength, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                  <span className="text-xs text-emerald-700 font-medium">✓</span>
                                                </div>
                                                <span className="text-sm text-gray-700">{strength}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-sm text-gray-500 italic">No strengths identified</p>
                                        )}
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-white border-amber-100 shadow-sm overflow-hidden">
                                      <CardHeader className="bg-amber-50 py-3 px-4 border-b border-amber-100">
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                                          <CardTitle className="text-sm font-semibold text-amber-800">
                                            Areas for Improvement
                                          </CardTitle>
                                        </div>
                                      </CardHeader>
                                      <CardContent className="p-4">
                                        {app.parsedResume?.weaknesses?.length ? (
                                          <ul className="space-y-2">
                                            {app.parsedResume.weaknesses.map((weakness, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                  <span className="text-xs text-amber-700 font-medium">!</span>
                                                </div>
                                                <span className="text-sm text-gray-700">{weakness}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-sm text-gray-500 italic">
                                            No areas for improvement identified
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                  <Card className="bg-white border-indigo-100 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-indigo-50 py-3 px-4 border-b border-indigo-100">
                                      <div className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                                        <CardTitle className="text-sm font-semibold text-indigo-800">
                                          AI Analysis
                                        </CardTitle>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                      <p className="text-sm text-gray-700 leading-relaxed">
                                        {app.matchReasoning || "No detailed analysis available for this candidate."}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

