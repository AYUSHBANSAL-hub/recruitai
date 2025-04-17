"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Users,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
  Calendar,
  Briefcase,
  Search,
  Clipboard,
  ArrowUpRight,
  Copy,
  CopyCheck,
  MoreHorizontal,
  Power,
  PenLine,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import EditJobDescriptionModal from "@/components/EditJobDescriptionModal";

interface Form {
  id: string;
  title: string;
  createdAt: string;
  active: boolean;
  applicationsCount?: number;
  jobDescription?: string;
}

interface Application {
  id: string;
  status: string;
  formId?: string;
  userId?: string;
  createdAt?: string;
}

interface DashboardStats {
  totalForms: number;
  activeForms: number;
  totalApplications: number;
  pendingReviews: number;
  shortlisted: number;
  rejected: number;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    activeForms: 0,
    totalApplications: 0,
    pendingReviews: 0,
    shortlisted: 0,
    rejected: 0,
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formsRes, applicationsRes] = await Promise.all([
          fetch("/api/forms"),
          fetch("/api/applications"),
        ]);

        if (!formsRes.ok || !applicationsRes.ok) {
          throw new Error(
            `Failed to fetch data: Forms ${formsRes.status}, Applications ${applicationsRes.status}`
          );
        }

        const formsData = await formsRes.json();
        const applicationsData = await applicationsRes.json();
        console.log(applicationsData);

        // Enhance forms with application counts
        const filteredApplications = applicationsData.filter((app: Application) =>
          formsData.some((form: Form) => form.id === app.formId)
        );        
        const enhancedForms = formsData.map((form: Form) => ({
          ...form,
          applicationsCount: applicationsData.filter(
            (app: Application) => app.formId === form.id
          ).length,
        }));

        setForms(enhancedForms);
        setApplications(applicationsData);

        // Get 5 most recent applications
        const sortedApplications = [...filteredApplications]
          .sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          )
          .slice(0, 5);

        setRecentApplications(sortedApplications);

        // Calculate stats
        setStats({
          totalForms: formsData.length,
          activeForms: formsData.filter((form: Form) => form.active).length,
          totalApplications: filteredApplications.length,
          pendingReviews: filteredApplications.filter(
            (app: Application) => app.status === "PENDING"
          ).length,
          shortlisted: filteredApplications.filter(
            (app: Application) => app.status === "SHORTLISTED"
          ).length,
          rejected: filteredApplications.filter(
            (app: Application) => app.status === "REJECTED"
          ).length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = async (formId: string, currentStatus: boolean) => {
    try { 
      setLoadingId(formId)
      const response = await fetch(`/api/forms/${formId}/activeForm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle form status');
      }

      // Update the forms state to reflect the change
      setForms(forms.map(form => 
        form.id === formId 
          ? { ...form, active: !currentStatus }
          : form
      ));

      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        activeForms: currentStatus 
          ? prevStats.activeForms - 1 
          : prevStats.activeForms + 1
      }));

      toast.success(`Form ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error toggling form status:', error);
      toast.error('Failed to toggle form status');
    } finally {
      setLoadingId(null)
    }
  };

  // Filter forms based on search query
  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
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
  const updateJobDesc = async (value: string, formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}/updateJobDescription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job description');
      }

      toast.success('Job description updated successfully');
    } catch (error) {
      console.error('Error updating job description:', error);
      toast.error('Failed to update job description');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Talent Acquisition Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's an overview of your recruitment activities
            </p>
          </div>

          {/* <Button
            onClick={() => router.push("/admin/forms/create")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Job Form
          </Button> */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Job Forms
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.activeForms}
                  </p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-teal-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.totalApplications}
                  </p>
                </div>
                <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.pendingReviews}
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Shortlisted
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.shortlisted}
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Forms List */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Job Forms
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Manage your active and inactive job postings
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search job forms..."
                  className="pl-9 border-gray-300 bg-white h-10 focus-visible:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No job forms found
                </h3>
                <p className="text-gray-500 max-w-md">
                  {forms.length === 0
                    ? "Create your first job form to start receiving applications."
                    : "No job forms match your search criteria."}
                </p>
                {forms.length === 0 && (
                  <Button
                    onClick={() => router.push("/admin/forms/create")}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Job Form
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="text-center">
                      <TableHead className="font-semibold text-left">
                        Job Title
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Date Created
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Applications
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Actions
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Form Links
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Edit
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form) => (
                      <TableRow
                        key={form.id}
                        className="hover:bg-gray-50 border-b border-gray-200 text-center"
                      >
                        <TableCell className="font-medium text-left">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-gray-900">{form.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{form.applicationsCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            onClick={() =>
                              router.push(`/admin/forms/${form.id}`)
                            }
                          >
                            View Applications
                          </Button>
                        </TableCell>
                        <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {/* Copy Icon Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`transition-colors duration-300 ${
                        copiedId === form.id
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "text-indigo-600 hover:bg-indigo-50"
                      }`}
                      disabled={!form.active}
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/jobs/${form.id}/apply`)
                        setCopiedId(form.id) // Set copied state for this specific form

                        // Show toast notification
                        toast("Link Copied to Clipboard")

                        setTimeout(() => setCopiedId(null), 2000)
                      }}
                    >
                      {copiedId === form.id ? (
                        <CopyCheck className="h-5 w-5" /> // Show check icon if copied
                      ) : (
                        <Copy className="h-5 w-5" /> // Show copy icon if not copied
                      )}
                    </Button>

                    {/* Go to Link Icon Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-600 hover:bg-indigo-50"
                      disabled={!form.active}
                      onClick={() => window.open(`/jobs/${form.id}/apply`, "_blank")}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                <EditJobDescriptionModal
                  initialContent={form.jobDescription || ""}
                  onSave={(value) => updateJobDesc(value, form.id)}
                  open={editModalOpen && selectedFormId === form.id}
                  onOpenChange={(open) => {
                    setEditModalOpen(open);
                    if (open) {
                      setSelectedFormId(form.id);
                    } else {
                      setSelectedFormId(null);
                    }
                  }}
                  trigger={
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-indigo-600 hover:bg-indigo-50"
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setEditModalOpen(true);
                      }}
                    >
                      <PenLine className="h-5 w-5" />
                    </Button>
                  }
                />
                </TableCell>
                <TableCell>
                    <div className="flex items-center justify-center gap-2">
                    <Badge
                            className={`${
                              form.active
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {form.active ? "Active" : "Inactive"}
                          </Badge>
                      {loadingId === form.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600"></div>
                      ) : (
                        <Switch
                          checked={form.active}
                          onCheckedChange={() => handleToggle(form.id, form.active)}
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-200"
                        />
                      )}
                    </div>
                  </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

 
          {/* Recent Applications */}
          <Card className="bg-white border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Applications
              </CardTitle>
              <CardDescription className="text-gray-500">
                Latest candidates who applied
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No applications yet
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    When candidates apply to your job postings, they'll appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">
                          Candidate
                        </TableHead>
                        <TableHead className="font-semibold">
                          Job Form
                        </TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentApplications.map((app) => (
                        <TableRow
                          key={app.id}
                          className="hover:bg-gray-50 border-b border-gray-200"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                {app.responses && app.responses["fixed-name"]
                                  ? app.responses["fixed-name"].charAt(0).toUpperCase()
                                  : "A"}
                              </div>
                              <span>{app.responses && app.responses["fixed-name"] || "Anonymous Candidate"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {forms.find((form) => form.id === app.formId)
                              ?.title || "Unknown Job"}
                          </TableCell>
                          <TableCell>
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={() => router.push("/admin/applications")}
              >
                View All Applications
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        
      </div>
    </div>
  );
}
