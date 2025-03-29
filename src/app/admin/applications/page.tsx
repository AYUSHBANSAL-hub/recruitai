"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  FileText,
  User,
  AlertTriangle,
  Download,
  ChevronDown,
  Award,
  MessageSquare,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CalendarIntegration from "@/components/CalendarIntegration";

interface Application {
  id: string;
  userId?: string | null;
  responses: { [key: string]: string };
  resumeUrl: string;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED";
  matchScore?: number | null;
  matchReasoning?: string | null;
  parsedResume?: {
    strengths?: string[];
    weaknesses?: string[];
  } | null;
  strengths: string[];
  weaknesses: string[];
  createdAt?: string;
  formId?: string;
}

interface Form {
  id: string;
  title: string;
}

// Component to handle search params inside Suspense
function ApplicationsList() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [jobFormFilter, setJobFormFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"matchScore" | "date">("matchScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentForm, setCurrentForm] = useState<Form | null>(null);

  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/forms");
        const data = await res.json();
        setForms(data);

        if (formId) {
          const form = data.find((f: Form) => f.id === formId);
          if (form) setCurrentForm(form);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [formId]);

  useEffect(() => {
    if (formId) {
      fetchApplications(formId);
    } else {
      fetchAllApplications();
    }
  }, [formId]);

  const fetchApplications = async (formId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications?formId=${formId}`);
      const data = await res.json();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error("Error fetching all applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    appId: string,
    newStatus: Application["status"]
  ) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update applications list
      const filteredApplications = applications.filter((app: Application) =>
        forms.some((form: Form) => form.id === app.formId)
      );   
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );

      // Update selected application if it's the one being updated
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }

      // Apply filters again
      applyFilters();
    } catch (err: any) {
      console.error("Error updating status:", err);
    }
  };

  // Apply filters, sorting, and search
  const applyFilters = () => {
    let result = [...applications];

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Apply job form filter
    if (jobFormFilter !== "ALL") {
      result = result.filter((app) => app.formId === jobFormFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.userId?.toLowerCase().includes(query) ||
          false ||
          Object.values(app.responses).some((response) =>
            response.toLowerCase().includes(query)
          )
      );
    }

    // Apply sorting
    if (sortBy === "matchScore") {
      result.sort((a, b) => {
        const scoreA = a.matchScore ?? -1;
        const scoreB = b.matchScore ?? -1;

        return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA;
      });
    } else if (sortBy === "date") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();

        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    setFilteredApplications(result);
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [
    applications,
    searchQuery,
    statusFilter,
    jobFormFilter,
    sortBy,
    sortDirection,
  ]);

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
            Pending
          </Badge>
        );
      case "REVIEWED":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200">
            Reviewed
          </Badge>
        );
      case "SHORTLISTED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">
            Shortlisted
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "text-gray-400";
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-teal-600";
    if (score >= 40) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreProgressColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "bg-gray-200";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-teal-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const toggleSort = (field: "matchScore" | "date") => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const getNameFromResponses = (app: Application) => {
    // Try to extract name from responses
    const nameFields = [
      "name",
      "fullName",
      "candidateName",
      "full_name",
      "fixed-name",
    ];
    for (const field of nameFields) {
      if (app.responses[field]) return app.responses[field];
    }
    return (
      (app.responses && app.responses["fixed-name"]) || "Anonymous Candidate"
    );
  };

  const getEmailFromResponses = (app: Application) => {
    // Try to extract email from responses
    const emailFields = [
      "email",
      "emailAddress",
      "candidate_email",
      "fixed-email",
    ];
    for (const field of emailFields) {
      if (app.responses[field]) return app.responses[field];
    }
    return (
      (app.responses && app.responses["fixed-email"]) || "No email provided"
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Applications List */}
      <div className="lg:col-span-1">
        <Card className="bg-white border-gray-200 shadow-sm h-full">
          <CardHeader className="pb-3 space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {currentForm
                  ? `${currentForm.title} - Candidates`
                  : "All Candidates"}
              </CardTitle>
              {currentForm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/applications")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to All
                </Button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search candidates..."
                className="pl-9 border-gray-300 bg-white h-10 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full border-gray-300 bg-white h-10 focus:ring-indigo-500">
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

              <Select
                value={jobFormFilter}
                onValueChange={(value) => setJobFormFilter(value)}
              >
                <SelectTrigger className="w-full border-gray-300 bg-white h-10 focus:ring-indigo-500">
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Jobs</SelectItem>
                  {forms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-300 h-10 w-10"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => toggleSort("matchScore")}
                    className="cursor-pointer"
                  >
                    Sort by Match Score{" "}
                    {sortBy === "matchScore" &&
                      (sortDirection === "desc"
                        ? "(Highest First)"
                        : "(Lowest First)")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleSort("date")}
                    className="cursor-pointer"
                  >
                    Sort by Date{" "}
                    {sortBy === "date" &&
                      (sortDirection === "desc"
                        ? "(Newest First)"
                        : "(Oldest First)")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setJobFormFilter("ALL");
                  setSortBy("matchScore");
                  setSortDirection("desc");
                }}
                className="border-gray-300 text-gray-700 h-10"
              >
                Clear Filters
              </Button>
            </div>
          </CardHeader>

          <div className="px-4 py-2 bg-gray-50 border-y border-gray-200 text-xs text-gray-500">
            {filteredApplications.length} candidate
            {filteredApplications.length !== 1 ? "s" : ""} found
          </div>

          <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No candidates found
                </h3>
                <p className="text-gray-500 max-w-md">
                  {applications.length === 0
                    ? "No applications have been submitted yet."
                    : "Try adjusting your filters to see more results."}
                </p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedApp?.id === app.id
                      ? "bg-indigo-50 border-l-4 border-indigo-500"
                      : ""
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0 mt-1">
                        {getNameFromResponses(app).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {getNameFromResponses(app)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getEmailFromResponses(app)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-gray-500">
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "Unknown date"}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {forms.find((f) => f.id === app.formId)?.title ||
                              "Unknown Position"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-lg font-semibold ${getScoreColor(
                                  app.matchScore
                                )}`}
                              >
                                {app.matchScore !== null
                                  ? `${app.matchScore}%`
                                  : "N/A"}
                              </span>
                              <Progress
                                value={app.matchScore || 0}
                                max={100}
                                className="h-1.5 w-16 bg-gray-100 mt-1"
                                // indicatorClassName={getScoreProgressColor(app.matchScore)}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Match Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Application Details */}
      <div className="lg:col-span-2">
        <Card className="bg-white border-gray-200 shadow-sm h-full">
          {selectedApp ? (
            <>
              <CardHeader className="pb-3 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {getNameFromResponses(selectedApp)}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Application submitted on{" "}
                      {selectedApp.createdAt
                        ? new Date(selectedApp.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "unknown date"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                        >
                          Update Status
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatus(selectedApp.id, "REVIEWED")
                          }
                          className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-700"
                          disabled={selectedApp.status === "REVIEWED"}
                        >
                          Mark as Reviewed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatus(selectedApp.id, "SHORTLISTED")
                          }
                          className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-700"
                          disabled={selectedApp.status === "SHORTLISTED"}
                        >
                          Shortlist Candidate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatus(selectedApp.id, "REJECTED")
                          }
                          className="cursor-pointer hover:bg-rose-50 hover:text-rose-700"
                          disabled={selectedApp.status === "REJECTED"}
                        >
                          Reject Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </a>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">
                          Candidate Info
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">
                            {getNameFromResponses(selectedApp)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium break-words">
                            {getEmailFromResponses(selectedApp)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <div className="mt-1">
                            {getStatusBadge(selectedApp.status)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">
                          Job Details
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Position</p>
                          <p className="font-medium">
                            {forms.find((f) => f.id === selectedApp.formId)
                              ?.title || "Unknown Position"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Applied On</p>
                          <p className="font-medium">
                            {selectedApp.createdAt
                              ? new Date(
                                  selectedApp.createdAt
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Award className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">
                          Match Score
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold text-gray-900">
                            {selectedApp.matchScore !== null
                              ? `${selectedApp.matchScore}%`
                              : "N/A"}
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              selectedApp.matchScore &&
                              selectedApp.matchScore >= 80
                                ? "bg-emerald-100 text-emerald-800"
                                : selectedApp.matchScore &&
                                  selectedApp.matchScore >= 60
                                ? "bg-teal-100 text-teal-800"
                                : selectedApp.matchScore &&
                                  selectedApp.matchScore >= 40
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {selectedApp.matchScore &&
                            selectedApp.matchScore >= 80
                              ? "Excellent"
                              : selectedApp.matchScore &&
                                selectedApp.matchScore >= 60
                              ? "Good"
                              : selectedApp.matchScore &&
                                selectedApp.matchScore >= 40
                              ? "Average"
                              : "Low"}
                          </div>
                        </div>
                        <Progress
                          value={selectedApp.matchScore || 0}
                          max={100}
                          className="h-2 bg-gray-100"
                          // indicatorClassName={getScoreProgressColor(selectedApp.matchScore)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      {selectedApp.strengths?.length ? (
                        <ul className="space-y-2">
                          {selectedApp.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-emerald-700 font-medium">
                                  ✓
                                </span>
                              </div>
                              <span className="text-sm text-gray-700">
                                {strength}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No strengths identified
                        </p>
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
                      {selectedApp.weaknesses?.length ? (
                        <ul className="space-y-2">
                          {selectedApp.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-amber-700 font-medium">
                                  !
                                </span>
                              </div>
                              <span className="text-sm text-gray-700">
                                {weakness}
                              </span>
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
                      {selectedApp.matchReasoning ||
                        "No detailed analysis available for this candidate."}
                    </p>
                  </CardContent>
                </Card>
                {selectedApp && selectedApp.status === "SHORTLISTED" && (
                  <div className="mt-6">
                    <CalendarIntegration
                      candidateName={getNameFromResponses(selectedApp)}
                      candidateEmail={getEmailFromResponses(selectedApp)}
                      jobTitle={
                        forms.find((f) => f.id === selectedApp.formId)?.title ||
                        "Job Position"
                      }
                      provider="cal"
                    />
                  </div>
                )}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Application Responses
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-4">
                      {Object.entries(selectedApp.responses).map(
                        ([key, value]) => (
                          <div key={key}>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {key.charAt(0).toUpperCase() +
                                key
                                  .slice(1)
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()}
                            </p>
                            <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                              {value || "No response"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 h-full">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No candidate selected
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                Select a candidate from the list to view their application
                details, resume, and AI-generated insights.
              </p>
              <Button
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={() =>
                  filteredApplications.length > 0 &&
                  setSelectedApp(filteredApplications[0])
                }
                disabled={filteredApplications.length === 0}
              >
                {filteredApplications.length > 0
                  ? "Select First Candidate"
                  : "No Candidates Available"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const exportToCSV = (applications: Application[]) => {
  // Create CSV content
  const headers = [
    "Candidate",
    "Email",
    "Match Score",
    "Status",
    "Applied Date",
  ];
  const rows = applications.map((app) => [
    app.userId || "Anonymous",
    app.responses.email || "N/A",
    app.matchScore !== null ? `${app.matchScore}%` : "N/A",
    app.status,
    app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `applications_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Page Component with Suspense
export default function ApplicationsPage() {
  const router = useRouter();
  const [allApplications, setAllApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setAllApplications(data);
      } catch (error) {
        console.error("Error fetching all applications:", error);
      }
    };

    fetchAllApplications();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1">
            Review and manage candidate applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            onClick={() => exportToCSV(allApplications)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Wrap ApplicationsList inside Suspense */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-gray-600 font-medium">
                Loading applications...
              </p>
            </div>
          </div>
        }
      >
        <ApplicationsList />
      </Suspense>
    </div>
  );
}
