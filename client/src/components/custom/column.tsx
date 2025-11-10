// components/ui/column.tsx

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/tabs/TPC/StudentManage";
import { Company } from "@/tabs/TPC/CompanyManagement";
import { JobProfile } from "@/tabs/TPC/JobProfileManage";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useState } from "react";

// (Your existing column definitions like userListColumns, etc., would remain here)
// ...

const handleDeleteStudent = async (studentId: string) => {
  try {
    const res = await axios.delete(
      `${API_ROUTES.DELETE_STUDENT}/${studentId}`,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      toast.success("Student deleted successfully!");
      window.location.reload(); // or use mutation invalidate
    } else {
      toast.error(res.data.data.message || "Failed to delete student.");
    }
  } catch (err: any) {
    console.error("Error deleting student:", err);
    if (err.response?.data) {
      console.error("Server response:", err.response.data);
    }
    toast.error(err.response?.data?.message || "Something went wrong.");
  }
};

// --- NEW: Column definitions for the student management table ---
export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "student_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Name {}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("student_name")}</div>
    ),
  },

  {
    accessorKey: "college_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        College ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue("college_id")}</div>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase truncate max-w-[200px]">
        {row.getValue("email")}
      </div>
    ),
  },

  // {
  //   accessorKey: "isPlaced",
  //   header: "Placement Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("isPlaced");
  //     const isPlaced = status ? "Placed" : "Not Placed";
  //     return (
  //       <Badge variant={status ? "default" : "secondary"}>{isPlaced}</Badge>
  //     );
  //   },
  // },

  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`student-profile/${student.userId}/${student._id}`}>
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to={`student-profile-update/${student.userId}/${student._id}`}
              >
                Edit Details
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${student.college_id}?`
                  )
                ) {
                  // Call your delete API or handler here
                  handleDeleteStudent(student.userId.toString());
                }
              }}
            >
              Delete Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];

const handleDeleteCompany = async (companyId: string) => {
  try {
    console.log(companyId);

    const res = await axios.delete(`${API_ROUTES.COMPANIES}/${companyId}`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      toast.success("Company deleted successfully!");
      // Optionally trigger table refresh or mutation invalidate here
      window.location.reload(); // Simple way to refresh the data
    } else {
      toast.error(res.data.data.message || "Failed to delete company.");
    }
  } catch (err: any) {
    // Add type annotation for error
    console.error(err);
    // Log the response data for more details from the server
    if (err.response && err.response.data) {
      console.error("Server response data:", err.response.data);
    }
    toast.error(err.response.data.message || "Something went wrong.");
  }
};

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => (
      <img
        src={row.getValue("logo")}
        alt="Company Logo"
        className="h-10 w-10 rounded-full object-contain border"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "contact_email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase font-mono">{row.getValue("contact_email")}</div>
    ),
  },
  {
    accessorKey: "company_location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("company_location")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const company = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(company.contact_email)
              }
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`view-company/${company._id}`}>View Company</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`update-company/${company._id}`}>Edit Company</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${company.name}?`
                  )
                ) {
                  // Call your delete API or handler here
                  handleDeleteCompany(company._id);
                }
              }}
            >
              Delete Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// --- Column Definitions ---
export const jobProfileColumns: ColumnDef<JobProfile>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company_id;
      return (
        <div className="flex items-center gap-2">
          <img
            src={company.logo}
            alt={company.name}
            className="h-9 w-9 rounded-full object-contain border border-border"
          />
          <span className="font-medium">{company.name}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("location")}</Badge>
    ),
  },
  {
    accessorKey: "ctc",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        CTC (LPA) <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("ctc")}</div>,
  },
  {
    accessorKey: "vacancies",
    header: "Vacancies",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("vacancies")}</div>
    ),
  },
  {
    accessorKey: "bond_details",
    header: "Bond",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("bond_details")}
      </div>
    ),
  },

  // ✅ New Status Column
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const job = row.original;
      const [loading, setLoading] = useState(false);
      const [status, setStatus] = useState(job.status);

      const toggleStatus = async () => {
        const newStatus = status === "Active" ? "Inactive" : "Active";
        setLoading(true);
        try {
          const res = await axios.post(
            `${API_ROUTES.UPDATE_JOB_PROFILE_STATUS}/${job._id}`,
            { status: newStatus },
            { withCredentials: true }
          );
          if (res.data.success) {
            setStatus(newStatus);
            toast.success(`Status updated to ${newStatus}`);
          } else {
            toast.error("Failed to update status");
          }
        } catch (err) {
          console.error("Status update error:", err);
          toast.error("Error updating status");
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="flex justify-center items-center gap-2">
          <Badge
            variant={status === "Active" ? null : "destructive"}
            className="capitalize"
          >
            {status}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleStatus}
            disabled={loading}
          >
            {loading ? "Updating..." : status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const jobProfile = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link
                  to={`view-job-profile/${jobProfile._id}`}
                  className="w-full"
                >
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();

                  const confirmed = window.confirm(
                    "Are you sure you want to delete this job profile?"
                  );
                  if (!confirmed) return;

                  try {
                    const res = await axios.delete(
                      `${API_ROUTES.JOBS}/${jobProfile._id}`,
                      { withCredentials: true }
                    );

                    if (res.status === 200) {
                      toast.success("Job profile deleted successfully!");
                      window.location.reload();
                    } else {
                      toast.error("Failed to delete job profile.");
                    }
                  } catch (err) {
                    console.error("Delete job profile error:", err);
                    toast.error("Error deleting job profile. Please try again.");
                  }
                }}
              >
                Delete Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];


// --- Column Definitions ---
export const jobDriveStatusColumns: ColumnDef<JobProfile>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company_id;
      return (
        <div className="flex items-center gap-2">
          <img
            src={company.logo}
            alt={company.name}
            className="h-9 w-9 rounded-full object-contain border border-border"
          />
          <span className="font-medium">{company.name}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "ctc",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        CTC (LPA) <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("ctc")}</div>,
  },
  {
    accessorKey: "vacancies",
    header: "Vacancies",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("vacancies")}</div>
    ),
  },
  {
    accessorKey: "placement_drive_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
       Drive Status<ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("placement_drive_status")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const jobProfile = row.original;
      return (
        <div className="flex items-center justify-center"><Link to={`manage/${jobProfile._id}`} className="border p-2 rounded-md px-4 bg-black hover:bg-gray-700 text-white">Manage Drive</Link></div>
      );
    },
  },
];

export const activeJobProfileColumns: ColumnDef<JobProfile>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company_id;
      return (
        <div className="flex items-center gap-2">
          <img
            src={company.logo}
            alt={company.name}
            className="h-9 w-9 rounded-full object-contain border border-border"
          />
          <span className="font-medium">{company.name}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("location")}</Badge>
    ),
  },
  {
    accessorKey: "ctc",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        CTC (LPA) <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("ctc")}</div>,
  },
  {
    accessorKey: "vacancies",
    header: "Vacancies",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("vacancies")}</div>
    ),
  },
  {
    accessorKey: "bond_details",
    header: "Bond",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("bond_details")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">View Applications</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const jobProfile = row.original;
      return (
        <div className="flex items-center justify-center"><Link to={`pending-applications/${jobProfile._id}`} className="border p-2 rounded-md px-4 bg-black hover:bg-gray-700 text-white">View</Link></div>
      );
    },
  },
];
