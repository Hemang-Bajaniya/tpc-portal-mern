import CompanyCard from "@/components/custom/CompanyCard";
import OngoingDrive from "@/components/custom/OngoingDrive";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <OngoingDrive />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <CompanyCard
            logo="https://example.com/logo.png"
            name="Example Company"
            ctc="10"
            location="Remote"
            to="/company/example"
          />
          <CompanyCard
            logo="https://example.com/logo.png"
            name="Example Company"
            ctc="10"
            location="Remote"
            to="/company/example"
          />
          <CompanyCard
            logo="https://example.com/logo.png"
            name="Example Company"
            ctc="10"
            location="Remote"
            to="/company/example"
          />
        </div>
      </div>
    </div>
  );
}
