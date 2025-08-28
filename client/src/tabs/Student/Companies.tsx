import CompanyCard from "@/components/custom/CompanyCard";

const Companie = [
  {
    logo: "https://example.com/logo.png",
    name: "Example Company",
    ctc: "10",
    location: "Remote",
    to: "/company/example",
    applicationDate: "Not Confirm"
  },
  {
    logo: "https://example.com/logo.png",
    name: "Example Company",
    ctc: "10",
    location: "Remote",
    to: "/company/example",
    applicationDate:  new Date().toISOString().split('T')[0]
  },
  {
    logo: "https://example.com/logo.png",
    name: "Example Company",
    ctc: "10",
    location: "Remote",
    to: "/company/example",
    applicationDate: new Date().toISOString().split('T')[0],
  },
];

export default function Companies() {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {Companie.map((items: any, key: number) => (
            <CompanyCard
              key={key}
              logo={items.logo}
              name={items.name}
              ctc={items.ctc}
              location={items.location}
              to={items.to}
              applicationDate={items.applicationDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
