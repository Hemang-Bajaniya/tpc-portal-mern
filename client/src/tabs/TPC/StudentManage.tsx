import { useEffect, useState } from "react";
import { studentColumns } from "@/components/custom/column";
import { DataTable } from "@/components/custom/data-table";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

export type Student = {
  _id: string;
  userId: object;
  name: string;
  college_id: string;
  email: string;
  dept_name: string;
  isPlaced: boolean;
};

export function StudentManage() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const studentProfileRegex =
    /\/(tpc|tpo)\/student-management\/student-profile\/.+/;
  const studentProfileUpdateRegex =
    /\/(tpc|tpo)\/student-management\/student-profile-update\/.+/;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_ROUTES.GET_ALL_STUDENTS, {
          withCredentials: true,
        });

        const studentsData = response.data?.data || [];

        // Ensure isPlaced is boolean (in case API returns string)
        const formatted = studentsData.map((s: any) => ({
          ...s,
          isPlaced: s.isPlaced === true || s.isPlaced === "Placed",
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    if (!studentProfileRegex.test(location.pathname)) {
      fetchData();
    }
  }, [location.pathname]);

  if (
    studentProfileRegex.test(location.pathname) ||
    studentProfileUpdateRegex.test(location.pathname)
  ) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
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
        <p className="mt-4 text-gray-600">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 h-full bg-white p-10">
      <h1 className="text-3xl font-bold mb-6">Student Management Dashboard</h1>
      <DataTable columns={studentColumns} data={data} />
    </div>
  );
}
