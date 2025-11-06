import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";
import Pagination from "@/components/ui/pagination";

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNo?: string;
  dept_id?: any;
  updatedAt?: string;
  [key: string]: any;
}

export default function TPCDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPendingStudents(page);
  }, [page]);

  const fetchPendingStudents = async (pageNum: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_ROUTES.PENDING}?page=${pageNum}&pageSize=${pageSize}`,
        { withCredentials: true }
      );

      setStudents(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId: string, approve: boolean) => {
    try {
      await axios.post(
        API_ROUTES.APPROVE,
        { studentId, approve },
        { withCredentials: true }
      );
      fetchPendingStudents(page);
    } catch {
      setError("Failed to update student status.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-10 transition-colors">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
        Pending Student Approvals
      </h1>

      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="px-6 py-3 font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Dept
              </th>
              <th className="px-6 py-3 font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-neutral-500">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-neutral-500">
                  No pending students.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                >
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.dept_id?.dept_name}</td>
                  <td className="px-6 py-4">
                    {student.updatedAt
                      ? new Date(student.updatedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(student._id, true)}
                      className="rounded-lg shadow-sm"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleApprove(student._id, false)}
                      className="rounded-lg shadow-sm"
                    >
                      Decline
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
