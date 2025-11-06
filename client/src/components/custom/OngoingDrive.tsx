import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// The Link component from react-router-dom has been removed as it requires a Router context to function.
// Using standard <a> tags instead to prevent the application from crashing.
import { Check, Loader2, Users, Building2, BookUser } from 'lucide-react';

// --- TypeScript Interface for Round Data ---
interface Round {
  name: string;
}

// Main Component
export default function OngoingDrive() {
  const rounds: Round[] = [
    { name: "Aptitude Test" },
    { name: "Technical Interview" },
    { name: "HR Interview" },
    { name: "Offer" },
  ];
  const currentRoundIndex = 2; // The current step is "HR Interview" (0-based index)

  return (
    <div className="bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-border">
        {/* --- Card Header --- */}
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <img
            src="https://placehold.co/64x64/1e3a8a/ffffff?text=G"
            alt="Google Logo"
            className="w-16 h-16 object-contain rounded-full border-2 border-border"
          />
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Google</CardTitle>
            <CardDescription className="text-muted-foreground">Hiring Process Status</CardDescription>
          </div>
        </CardHeader>

        {/* --- Card Content with Progress Stepper --- */}
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="w-full">
              <div className="relative">
                {/* --- Progress Track (Gray Line) --- */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                {/* --- Progress Fill (Blue Line) --- */}
                <div
                  className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
                  style={{ height: `calc(${currentRoundIndex * 33.33}% + 1rem)` }}
                />

                <div className="space-y-8">
                  {rounds.map((round, idx) => {
                    const isCompleted = idx < currentRoundIndex;
                    const isCurrent = idx === currentRoundIndex;
                    
                    return (
                      <div key={round.name} className="relative flex items-center gap-4">
                        {/* --- Step Marker --- */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-300 border-4
                            ${isCompleted
                              ? 'bg-primary border-background text-primary-foreground'
                              : isCurrent
                              ? 'bg-background border-primary text-primary animate-spin'
                              : 'bg-muted border-background text-muted-foreground'
                            }
                          `}
                        >
                          {isCompleted ? <Check size={16} /> : isCurrent ? <Loader2 size={16}/> : idx + 1}
                        </div>

                        {/* --- Round Name --- */}
                        <span
                          className={`text-base font-medium
                            ${isCurrent ? 'text-primary' : 'text-foreground'}
                          `}
                        >
                          {round.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* --- Footer Buttons --- */}
        <CardFooter className="flex justify-center flex-wrap gap-4 border-t border-border pt-6">
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <a href="dashboard/home/selected">
              <Users className="mr-2 h-4 w-4" />
              Selected Students
            </a>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <a href="dashboard/home/applicants">
              <BookUser className="mr-2 h-4 w-4" />
              All Applicants
            </a>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <a href="dashboard/home/applicants-from-department">
              <Building2 className="mr-2 h-4 w-4" />
              Department Applicants
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

