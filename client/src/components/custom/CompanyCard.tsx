import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  logo: string;
  name: string;
  ctc: string;
  location: string;
  to: string;
  applicationDate: string | null;
}

export default function CompanyCard({
  logo,
  name,
  ctc,
  location,
  to,
  applicationDate,
}: Props) {
  return (
    <Card className="w-full max-w-md shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-16 w-16 flex-shrink-0">
          <AvatarImage src={logo} alt={`${name} logo`} className="object-contain" />
          <AvatarFallback className="text-xl bg-gray-200">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow space-y-1">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">
            CTC: <strong>₹{ctc} LPA</strong>
          </p>
          <p className="text-sm text-gray-500">
            Location: <strong>{location}</strong>
          </p>
          {applicationDate && (
            <p className="text-sm text-gray-500">
              Apply by: <strong>{applicationDate}</strong>
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button asChild size="icon" className="cursor-pointer rounded-full">
            <Link to={to}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
