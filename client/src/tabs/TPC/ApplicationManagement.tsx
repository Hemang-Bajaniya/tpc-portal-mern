import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { activeJobProfileColumns } from "@/components/custom/column"; // you define columns
import { DataTable } from "@/components/custom/data-table";
import { API_ROUTES } from "@/lib/apiRoutes";
import axios from "axios";

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
  bond_details: string;
}

export function ApplicationManagement() {
  const [data, setData] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // Regex to detect nested routes under applications
  const nestedRouteRegex =
    /\/tpc\/application-management\/(add-application|view-application|update-application)/;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: any = await axios.get(`${API_ROUTES.ACTIVE_JOBS}`, {
          withCredentials: true,
        });

        // Axios wraps API payload under .data
        const apiData = response.data;

        if (apiData.success) {
          setData(apiData.data); // <- the actual job array
        } else {
          throw new Error(apiData.message || "Unexpected API response");
        }
      } catch (err) {
        setError("Failed to fetch application data.");
        console.error("Error fetching applications:", err);
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
      <div className="flex items-center justify-center h-full">
        <p>Loading applications...</p>
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
        <h1 className="text-3xl font-bold">Application Management</h1>
      </div>
      <DataTable columns={activeJobProfileColumns} data={data} />
    </div>
  );
}
