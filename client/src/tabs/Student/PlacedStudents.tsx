"use client";

import { useEffect, useState } from "react";
import { Student } from "@/components/custom/Student";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

interface PlacedStudent {
  college_id: string;
  name: string;
  dept_name: string;
  company: string;
  logo?: string;
  job_title: string;
  ctc: string;
  location: string;
}

export function PlacedStudents({
  backgroundColor,
}: {
  backgroundColor: string;
}) {
  const [students, setStudents] = useState<PlacedStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlacedStudents = async () => {
      try {
        const response = await axios.get(`${API_ROUTES.GET_PLACED_STUDENTS}`, {
          withCredentials: true,
        });
        const data = response.data;
        setStudents(data.data || []);
        console.log(data.data);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlacedStudents();
  }, []);

  return (
    <div className={`h-full ${backgroundColor} p-2`}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Placed Students</h1>

      {loading && (
        <p className="text-center text-gray-600">Loading students...</p>
      )}

      {error && !loading && (
        <p className="text-center text-red-500 mt-4">Error: {error}</p>
      )}

      {!loading && !error && students.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No placed students found.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {!loading &&
            !error &&
            students.map((student, index) => (
              <Student
                key={index}
                studentId={student.college_id}
                name={student.name}
                department={student.dept_name}
                companie={student.company}
                logo={student.logo}
                jobTitle={student.job_title}
                ctc={student.ctc}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
