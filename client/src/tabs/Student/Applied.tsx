import AppliedCompanyCard from "@/components/custom/AppliedCompanyCard";
import { useEffect, useState } from "react";

interface AppliedCompany {
  logo: string;
  name: string;
  applicationDate: string;
}

// Dummy data for applied companies
const dummyAppliedCompanies: AppliedCompany[] = [
  {
    logo: "https://placehold.co/64x64/31306d/ffffff?text=G",
    name: "Google",
    applicationDate: "2024-10-15",
  },
  {
    logo: "https://placehold.co/64x64/000000/ffffff?text=MS",
    name: "Microsoft",
    applicationDate: "2024-10-20",
  },
  {
    logo: "https://placehold.co/64x64/f5a623/ffffff?text=A",
    name: "Amazon",
    applicationDate: "2024-09-30",
  },
];

export default function Applied() {
  const [appliedCompanies, setAppliedCompanies] = useState<AppliedCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true

  useEffect(() => {
    // Simulate an API call with a timeout
    const timer = setTimeout(() => {
      setAppliedCompanies(dummyAppliedCompanies);
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Applied Companies</h1>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {!loading && appliedCompanies.length === 0 && (
        <p className="text-center text-gray-500 mt-4">You have not applied to any companies yet.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && appliedCompanies.map((company, index) => (
          <AppliedCompanyCard key={index} {...company} />
        ))}
      </div>
    </div>
  );
}