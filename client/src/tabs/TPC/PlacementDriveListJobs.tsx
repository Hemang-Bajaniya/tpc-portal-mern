import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PlusCircle } from "lucide-react";

// --- ShadCN UI Component Imports ---
import { Button } from "@/components/ui/button";
import { jobDriveStatusColumns } from "@/components/custom/column";
import { DataTable } from "@/components/custom/data-table";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

// --- TypeScript Interface ---
export interface JobProfile {
  _id: string;
  company_id: {
    name: string;
    logo: string;
  };
  title: string;
  location: string;
  vacancies: number;
  ctc: number;
  placement_drive_status: string;
  bond_details: string;
}

// --- Main Job Profile Listing Component ---
export function PlacementDriveListJobs() {
  const [data, setData] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // Detect if route is for Add or Edit company_id
const nestedRouteRegex = /^\/(tpc|tpo)\/placement-drives-management\/(manage|round-manage|round-application-manager)(?:\/[^\/]+)*\/?$/;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await axios.get(`${API_ROUTES.JOBS}`, {
          withCredentials: true,
        });
        const jobProfiles = data.data.data as JobProfile[];

        setData(jobProfiles);
        // setData(dummyJobProfiles);
      } catch (err) {
        setError("Failed to fetch company data.");
      } finally {
        setLoading(false);
      }
    };

    if (!nestedRouteRegex.test(location.pathname)) {
      fetchData();
    }
  }, [location.pathname]);

  if (nestedRouteRegex.test(location.pathname)) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        Loading job profiles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          An Error Occurred
        </h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 h-full p-10 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Profile Management</h1>
      </div>
      <DataTable columns={jobDriveStatusColumns} data={data} />
    </div>
  );
}
