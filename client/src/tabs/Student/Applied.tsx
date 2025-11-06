import CompanyCard from "@/components/custom/CompanyCard";
import { useEffect, useState } from "react";

interface AppliedCompany {
  company_logo: string;
  name: string;
  last_date_for_application: string;
  ctc: string;
  location: string;
  to: string;
}

// Updated dummy data with all required fields
const dummyAppliedCompanies: AppliedCompany[] = [
  {
    company_logo: "https://placehold.co/64x64/31306d/ffffff?text=G",
    name: "Google",
    last_date_for_application: "2024-10-15",
    ctc: "12",
    location: "Bangalore, India",
    to: "jobs/google",
  },
  {
    company_logo: "https://placehold.co/64x64/000000/ffffff?text=MS",
    name: "Microsoft",
    last_date_for_application: "2024-10-20",
    ctc: "14",
    location: "Hyderabad, India",
    to: "jobs/microsoft",
  },
  {
    company_logo: "https://placehold.co/64x64/f5a623/ffffff?text=A",
    name: "Amazon",
    last_date_for_application: "2024-09-30",
    ctc: "13",
    location: "Chennai, India",
    to: "jobs/amazon",
  },
];

export default function Applied() {
  const [appliedCompanies, setAppliedCompanies] = useState<AppliedCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedCompanies(dummyAppliedCompanies);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Applied Companies</h1>

      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {!loading && appliedCompanies.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          You have not applied to any companies yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          appliedCompanies.map((company, index) => (
            <CompanyCard
              key={index}
              logo={company.company_logo}
              name={company.name}
              ctc={company.ctc}
              location={company.location}
              to={company.to}
              applicationDate={company.last_date_for_application}
              drive_complition_date={null}
            />
          ))}
      </div>
    </div>
  );
}