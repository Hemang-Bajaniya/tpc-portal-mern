import { Card, CardContent } from "@/components/ui/card";

interface Props {
  logo: string;
  name: string;
  applicationDate: string;
}

export default function AppliedCompanyCard({
  logo,
  name,
  applicationDate,
}: Props) {
  return (
    <Card className="w-full max-w-md shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 flex items-center gap-4">
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-16 h-16 object-contain rounded-full bg-gray-100"
        />
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">
            Application Deadline: <strong>{applicationDate}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}