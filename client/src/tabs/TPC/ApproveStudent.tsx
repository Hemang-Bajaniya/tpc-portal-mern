import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";
import { toast } from "sonner"; // ✅ for success/error messages

export type Student = {
  _id: string;
  college_id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function TPCApproveStudent() {
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // 📌 Fetch pending students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_ROUTES.PENDING}`, {
          withCredentials: true,
        });
        const data = response.data;
        setPendingStudents(data.data || []);
      } catch (err) {
        setError("Failed to fetch pending student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleAction = async (studentEmail: string, approve: boolean) => {
    if (approve) {
      try {
        await axios.post(
          `${API_ROUTES.APPROVE}`,
          { studentEmail, approve: true },
          { withCredentials: true }
        );

        setPendingStudents((prev) =>
          prev.filter((s) => s.email !== studentEmail)
        );

        toast.success(`${studentEmail} approved successfully ✅`);
      } catch (error) {
        console.error("Error approving student:", error);
        toast.error("Failed to approve student. Please try again.");
      }
    } else {
      try {
        await axios.delete(`${API_ROUTES.DELETE_USER}/${studentEmail}`, {
          withCredentials: true,
        });

        setPendingStudents((prev) =>
          prev.filter((s) => s.email !== studentEmail)
        );

        toast.success(`${studentEmail} rejected and deleted successfully ❌`);
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student. Please try again.");
      }
    }
    window.location.reload(); 
  };

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
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="space-x-2">
            <Button
              onClick={() => handleAction(student.email, true)}
              variant="default"
              size="sm"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleAction(student.email, false)}
              variant="destructive"
              size="sm"
            >
              Reject
            </Button>
          </div>
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
      <h1 className="text-3xl font-bold mb-6">Pending Student Approvals</h1>
      {pendingStudents.length === 0 ? (
        <div className="text-center">No pending students.</div>
      ) : (
        <DataTable columns={columns} data={pendingStudents} />
      )}
    </div>
  );
}