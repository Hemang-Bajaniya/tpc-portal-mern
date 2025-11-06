import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export type Student = {
  _id: string;
  college_id: string;
  name: string;
  email: string;
  approved: string;
  createdAt: string;
};

export default function ManageAcademicDetails() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📥 Fetch pending academic approval list
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_ROUTES.PENDING_ACADMIC_APPROVALS, {
          withCredentials: true,
        });
        setStudents(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // 🧾 Approve / Reject action
  const handleAction = async (studentEmail: string, approve: boolean) => {
    try {
      if (approve) {
        // ✅ Approve academic details
        await axios.post(
          API_ROUTES.PENDING_ACADMIC_APPROVALS,
          { studentEmail, approve: true },
          { withCredentials: true }
        );

        setStudents((prev) =>
          prev.map((s) =>
            s.email === studentEmail ? { ...s, approved: "approved" } : s
          )
        );

        toast.success(`${studentEmail} academic details approved ✅`);
      } else {
        // ❌ Reject academic details
        // await axios.post(
        //   API_ROUTES.REJECT_ACADMIC_DETAILS,
        //   { studentEmail, approve: false },
        //   { withCredentials: true }
        // );

        setStudents((prev) =>
          prev.map((s) =>
            s.email === studentEmail ? { ...s, approved: "rejected" } : s
          )
        );

        toast.success(`${studentEmail} academic details rejected ❌`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update academic details status.");
    }
  };

  // 🧭 Columns
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "college_id",
      header: "College ID",
      cell: ({ row }) => row.original.college_id,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "approved",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            row.getValue("approved") === "approved"
              ? "bg-green-100 text-green-700"
              : row.getValue("approved") === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.original.approved}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Link to={`/tpc/student-management/student-profile-update/STU001`}>
            <Button size="sm">View Details</Button>
          </Link>
        );
      },
    },
  ];

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          An Error Occurred
        </h1>
        <p className="text-lg">{error}</p>
        <p className="mt-4 text-gray-600">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  // 🧾 Main UI
  return (
    <div className="container mx-auto py-10 h-full bg-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        Pending Academic Details Approvals
      </h1>
      {students.length === 0 ? (
        <div className="text-center">No pending academic details.</div>
      ) : (
        <DataTable columns={columns} data={students} />
      )}
    </div>
  );
}