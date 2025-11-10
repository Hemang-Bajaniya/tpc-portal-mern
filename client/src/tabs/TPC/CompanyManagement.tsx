import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PlusCircle } from "lucide-react";

// --- ShadCN UI Component Imports ---
import { Button } from "@/components/ui/button";
import { companyColumns } from "@/components/custom/column";
import { DataTable } from "@/components/custom/data-table";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

// --- TypeScript Interface for Company Data ---
export interface Company {
  _id: string;
  name: string;
  logo: string;
  company_location: string;
  contact_email: string;
}

export function CompanyManagement() {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // Detect if route is for Add or Edit Company
  const addOrEditCompanyRegex =
    /\/(tpc|tpo)\/company-management\/(add-company|view-company|update-company)/;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = await axios.get(API_ROUTES.COMPANIES, {
          withCredentials: true,
        });
        const companies: Company[] = data.data.data;
        console.log(companies);
        setData(companies);
        // setData(dummyCompanies);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch company data.");
      } finally {
        setLoading(false);
      }
    };

    if (!addOrEditCompanyRegex.test(location.pathname)) {
      fetchData();
    }
  }, [location.pathname]);

  if (addOrEditCompanyRegex.test(location.pathname)) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading company data...</p>
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
        <h1 className="text-3xl font-bold">Company Management</h1>
        <Button asChild>
          <Link to={'/'+window.location.pathname.split('/')[1]+"/company-management/add-company"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Link>
        </Button>
      </div>
      <DataTable columns={companyColumns} data={data} />
    </div>
  );
}
