"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "@/components/custom/CompanyCard";
import { API_ROUTES } from "@/lib/apiRoutes";
import OngoingDrive, { Drive } from "@/components/custom/OngoingDrive";

// --- Interfaces ---
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
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch student's department ID
        const profileResponse = await axios.get(API_ROUTES.STUDENT_PROFILE, {
          withCredentials: true,
        });
        const deptId = profileResponse.data?.data?.dept_id?._id;

        if (!deptId) {
          setError("Could not determine user's department.");
          setLoading(false);
          return;
        }

        // Fetch jobs for department
        const jobResponse = await axios.get(API_ROUTES.GET_JOBS, {
          params: { for_dept: deptId },
          withCredentials: true,
        });

        if (jobResponse.data?.success && Array.isArray(jobResponse.data.data)) {
          setJobs(jobResponse.data.data);
        }

        // Fetch ongoing drives
        const drivesResponse = await axios.get(API_ROUTES.GET_ONGOING_DRIVE, {
          withCredentials: true,
        });

        if (drivesResponse.data?.success && Array.isArray(drivesResponse.data.data)) {
          setDrives(drivesResponse.data.data);
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err?.response?.data?.message ||
            "An unexpected error occurred while loading data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- UI: Loading ---
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // --- UI: Error ---
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

  // --- UI: Main Content ---
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col gap-6">
        {/* Ongoing Drives Section */}
        <OngoingDrive drives={drives} />

        {/* Job Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <CompanyCard
                key={job._id}
                logo={job.company_id.logo}
                name={job.company_id.name}
                ctc={job.ctc}
                location={job.location}
                to={`/student/dashboard/jobs/${job._id}`}
                applicationDate={null}
                drive_complition_date={null}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No job openings available for your department.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}