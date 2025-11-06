import CompanyCard from "@/components/custom/CompanyCard";
import { useEffect, useState } from "react";

interface AppliedCompany {
  company_logo: string;
  name: string;
  drive_complition_date: string;
  ctc: string;
  location: string;
  to: string;
}

// Updated dummy data with all required fields
const dummyAppliedCompanies: AppliedCompany[] = [
  {
    company_logo: "https://placehold.co/64x64/31306d/ffffff?text=G",
    name: "Google",
    drive_complition_date: "2024-10-15",
    ctc: "12",
    location: "Bangalore, India",
    to: "jobs/google",
  },
  {
    company_logo: "https://placehold.co/64x64/000000/ffffff?text=MS",
    name: "Microsoft",
    drive_complition_date: "2024-10-20",
    ctc: "14",
    location: "Hyderabad, India",
    to: "jobs/microsoft",
  },
  {
    company_logo: "https://placehold.co/64x64/f5a623/ffffff?text=A",
    name: "Amazon",
    drive_complition_date: "2024-09-30",
    ctc: "13",
    location: "Chennai, India",
    to: "jobs/amazon",
  },
];

export default function CompletedDrive() {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Completed Drives</h1>

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
              applicationDate={null}
              drive_complition_date={company.drive_complition_date}
            />
          ))}
      </div>
    </div>
  );
}