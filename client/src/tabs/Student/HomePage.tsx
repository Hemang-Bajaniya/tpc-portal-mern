"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "@/components/custom/CompanyCard";
import OngoingDrive from "@/components/custom/OngoingDrive";
import { API_ROUTES, API_BASE_URL_DOC } from "@/lib/apiRoutes";

// Define Job interface based on backend's CompanyJobProfile model
interface Job {
  _id: string;
  company_id: {
    name: string;
    logo: string;
  };
  title: string;
  ctc: number;
  location: string;
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobsByDepartment = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, fetch student's profile to get their department
        const profileResponse = await axios.get(API_ROUTES.STUDENT_PROFILE, {
          withCredentials: true,
        });

        const deptId = profileResponse.data?.data?.dept_id?._id;

        if (!deptId) {
          setError("Could not determine user's department.");
          setLoading(false);
          return;
        }

        const response = await axios.get(API_ROUTES.GET_JOBS, {
          params: { for_dept: deptId },
          withCredentials: true,
        });

        if (response.data?.success && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
        } else {
          throw new Error(
            response.data?.message || "Failed to fetch job data."
          );
        }
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(
          err?.response?.data?.message ||
            "An unexpected error occurred while fetching jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobsByDepartment();
  }, []);

  // UI: Loading
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">
          Loading job profiles...
        </p>
      </div>
    );
  }

  // UI: Error
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 text-red-800 p-6 rounded shadow-md text-center">
          <p className="font-semibold text-lg">Error: {error}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  // UI: Main content
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <OngoingDrive />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <CompanyCard
              key={job._id}
              logo={
                job.company_id.logo
                  ? `${API_BASE_URL_DOC}/${job.company_id.logo}`
                  : ""
              }
              name={job.company_id.name}
              ctc={String(job.ctc)}
              location={job.location}
              to={`/student/companies/${job._id}`}
              applicationDate={null} // This info is not on the CompanyJobProfile model
              drive_complition_date={null} // This info is not on the CompanyJobProfile model
            />
          ))}
        </div>
      </div>
    </div>
  );
}
