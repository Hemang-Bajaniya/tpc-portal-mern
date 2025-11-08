import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "@/components/custom/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Save } from "lucide-react";
import axios from "axios";
import { API_BASE_URL_DOC, API_ROUTES } from "@/lib/apiRoutes";

export type PendingApplication = {
  applicationId: string;
  studentId: string;
  collegeId: string;
  studentName: string;
  studentEmail: string;
  studentResume: string;
  status: string; // "Pending" | "Shortlisted" | "Rejected" | "Selected"
};

const STATUS_OPTIONS = ["Pending", "Shortlisted", "Rejected", "Selected"];

export function JobApplications() {
  const { job_id } = useParams<{ job_id: string }>();
  const [data, setData] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null); // Track saving state

  useEffect(() => {
    const fetchPendingApplications = async () => {
      if (!job_id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_ROUTES.GET_PENDING_APPLICATIONS}/${job_id}`,
          { withCredentials: true }
        );
        setData(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching pending applications:", err);
        setError("Failed to fetch pending applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApplications();
  }, [job_id]);

  // ✅ Handle status dropdown change (local only)
  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.applicationId === applicationId
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  // ✅ Save status change to backend
  const handleSaveStatus = async (app: PendingApplication) => {
    setSavingId(app.applicationId);
    try {
      await axios.patch(
        `${API_ROUTES.UPDATE_APPLICATION_STATUS}`,
        {
          student_id: app.studentId,
          job_profile_id: job_id,
          status: app.status,
        },
        { withCredentials: true }
      );

      console.log(
        `✅ Application ${app.applicationId} updated to ${app.status}`
      );
    } catch (error) {
      console.error("❌ Failed to update application status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  // ✅ Table Columns
  const STATUS_OPTIONS = ["Pending", "Shortlisted", "Rejected", "Selected"];

  const columns: ColumnDef<PendingApplication>[] = [
    {
      accessorKey: "collegeId",
      header: "College ID",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "studentEmail",
      header: "Email",
    },
    {
      accessorKey: "studentResume",
      header: "Resume",
      cell: ({ row }) => (
        <Button variant="outline" asChild>
          <a
            href={API_BASE_URL_DOC+"/"+row.original.studentResume}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </Button>
      ),
    },

    // ✅ NEW: Current Status Column
    {
      id: "currentStatus",
      header: "Current Status",
      cell: ({ row }) => {
        const currentStatus = row.original.status;
        const colorClass =
          currentStatus === "Selected"
            ? "bg-green-100 text-green-800"
            : currentStatus === "Shortlisted"
            ? "bg-blue-100 text-blue-800"
            : currentStatus === "Rejected"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800";

        return (
          <span
            className={`px-3 py-1 rounded text-sm font-medium text-center ${colorClass}`}
          >
            {currentStatus}
          </span>
        );
      },
    },

    // ✅ Status Change Dropdown Column
    {
      accessorKey: "status",
      header: "Change Status",
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(value) =>
            handleStatusChange(row.original.applicationId, value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },

    // ✅ Save Button Column
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          disabled={savingId === row.original.applicationId}
          onClick={() => handleSaveStatus(row.original)}
        >
          <Save className="w-4 h-4 mr-1" />
          {savingId === row.original.applicationId ? "Saving..." : "Save"}
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading job applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          An Error Occurred
        </h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 bg-white p-10">
      <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
