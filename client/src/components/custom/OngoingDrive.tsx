import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, EyeIcon } from "lucide-react";

interface Round {
  title: string;
  status: string;
}

export interface Drive {
  _id: string;
  drive_title: string;
  description?: string;
  drive_date: string;
  company?: {
    name?: string;
    logo?: string;
  };
  job_profile?: {
    _id: string,
    title?: string;
  };
  hiring_process?: Round[];
  status: string;
}

interface OngoingDriveProps {
  drives: Drive[];
}

export default function OngoingDrive({ drives }: OngoingDriveProps) {
  if (!drives || drives.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No ongoing placement drives found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {drives.map((drive) => {
        const companyName = drive.company?.name || "Unknown Company";
        const companyLogo =
          drive.company?.logo ||
          "https://placehold.co/64x64/gray/white?text=?";

        const rounds = drive.hiring_process || [];
        const currentRoundIndex =
          rounds.findIndex((r) => r.status === "Ongoing") !== -1
            ? rounds.findIndex((r) => r.status === "Ongoing")
            : 0;

        return (
          <div key={drive._id} className="bg-gray-50">
            <Card className="w-full max-w-4xl mx-auto shadow-lg border-border">
              {/* --- Header --- */}
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-16 h-16 object-contain rounded-full border-2 border-border"
                />
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {companyName}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {drive.job_profile?.title || "Job Profile"}
                  </CardDescription>
                </div>
              </CardHeader>

              {/* --- Progress Stepper --- */}
              <CardContent className="p-6">
                {rounds.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                    <div
                      className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
                      style={{
                        height: `calc(${currentRoundIndex * 33.33}% + 1rem)`,
                      }}
                    />

                    <div className="space-y-8">
                      {rounds.map((round, idx) => {
                        const isCompleted = round.status === "Completed";
                        const isCurrent = round.status === "Ongoing";
                        return (
                          <div
                            key={round.title + idx}
                            className="relative flex items-center gap-4"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 border-4 transition-all duration-300
                                ${
                                  isCompleted
                                    ? "bg-primary border-background text-primary-foreground"
                                    : isCurrent
                                    ? "bg-background border-primary text-primary animate-spin"
                                    : "bg-muted border-background text-muted-foreground"
                                }
                              `}
                            >
                              {isCompleted ? (
                                <Check size={16} />
                              ) : isCurrent ? (
                                <Loader2 size={16} />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span
                              className={`text-base font-medium ${
                                isCurrent
                                  ? "text-primary"
                                  : "text-foreground"
                              }`}
                            >
                              {round.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No rounds scheduled yet.</p>
                )}
              </CardContent>

              {/* --- Footer --- */}
              <CardFooter className="flex justify-center flex-wrap gap-4 border-t border-border pt-6">
                <Button asChild variant="secondary" className="w-full sm:w-auto">
                  <a href={`/student/dashboard/drive/${drive.job_profile?._id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Placement Drive
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
}