import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function OngoingDrive() {
  const rounds = ["Aptitude Test", "Technical Interview", "HR Interview", "Offer"];
  const currentRound = 2; // 0-based

  return (
    <Card className="w-full shadow-lg border border-gray-200">
      <CardContent className="p-6 flex justify-center items-center flex-col md:flex-row gap-10">
        {/* Company Info */}
        <Link to="\new" className="flex justify-center items-center flex-col w-full max-w-[50%]">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google"
            className="w-20 h-20 object-contain rounded-full bg-gray-100 shadow-sm"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Google</h2>
        </Link>

        {/* Vertical Progress Bar */}
        <div className="relative flex-1 flex justify-center items-center">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-1 bg-gray-300 rounded-full"></div>

          <div className="flex flex-col gap-10 pl-10">
            {rounds.map((round, idx) => (
              <div key={round} className="relative flex items-center gap-4">
                {/* Step marker */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all
                    ${
                      idx < currentRound
                        ? 'bg-blue-600 text-white shadow'
                        : idx === currentRound
                        ? 'bg-white border-2 border-blue-600 text-blue-600 animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {idx + 1}
                </div>

                {/* Round name */}
                <span
                  className={`text-base ${
                    idx === currentRound ? 'font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {round}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="flex justify-center flex-wrap gap-4 border-t pt-4">
        <Button asChild variant="outline" className="w-full lg:w-auto">
          <Link to="/drive/selected">Selected Students</Link>
        </Button>
        <Button asChild variant="outline" className="w-full lg:w-auto">
          <Link to="/drive/applied">Applicants</Link>
        </Button>
        <Button asChild variant="outline" className="w-full lg:w-auto">
          <Link to="/drive/all">Applicants from Department</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}   