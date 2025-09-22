import CompanyCard from "@/components/custom/CompanyCard";
import { useEffect, useState } from "react";

interface Company {
  logo: string;
  name: string;
  ctc: string;
  location: string;
  to: string;
  applicationDate: string;
}

const dummyCompanies: Company[] = [
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png",
    name: "Google",
    ctc: "25",
    location: "Mountain View, CA",
    to: "/student/dashboard/companies/google",
    applicationDate: "2024-10-15",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
    name: "Microsoft",
    ctc: "22",
    location: "Redmond, WA",
    to: "/student/dashboard/companies/microsoft",
    applicationDate: "2024-10-20",
  },
  {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png",
    name: "Amazon",
    ctc: "20",
    location: "Seattle, WA",
    to: "/student/dashboard/companies/amazon",
    applicationDate: "2024-09-30",
  },
];

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate an API call with a timeout
    const timer = setTimeout(() => {
      setCompanies(dummyCompanies);
      setLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      {loading && <p className="text-center text-gray-600">Loading companies...</p>}
      {error && !loading && (
        <p className="text-center text-gray-500 mt-4">{error}</p>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {companies.map((item, index) => (
            <CompanyCard
              key={index}
              logo={item.logo}
              name={item.name}
              ctc={item.ctc}
              location={item.location}
              to={item.to}
              applicationDate={item.applicationDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}