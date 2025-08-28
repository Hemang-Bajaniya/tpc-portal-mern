import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    <Card className="w-full max-w-md shadow-md rounded-xl hover:shadow-lg">
      <CardContent className="flex flex-col items-left">
        <div className="flex flex-row align-center items-center mx-4">
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-16 h-16 object-contain mb-4 rounded-full bg-gray-100"
          />
          <h2 className="text-lg font-semibold mb-1 text-center px-5">
            {name}
          </h2>
        </div>
        <div className="w-full flex flex-row h-full">
          <div className="px-6 w-full">
            <div className="text-sm text-gray-500 mb-1">
              CTC: <strong>₹{ctc} LPA</strong>
            </div>
            <div className="text-sm text-gray-500 mb-1">
              Job location: <strong>{location}</strong>
            </div>
            {applicationDate && (
              <div className="text-sm text-gray-500 mb-1">
                Placement Drive Date: <strong>{applicationDate}</strong>
              </div>
            )}
          </div>
          <div className="flex justify-end align-bottom w-50">
            <Button className="cursor-pointer">
              <Link to={to}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path
                    d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"
                    fill="white"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
