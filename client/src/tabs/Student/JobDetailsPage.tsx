import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

// --- TypeScript Interfaces ---
interface CompanyProps {
  name: string;
  logo: string;
  company_description: string;
  company_website: string;
  company_location: string;
  company_type: string;
}

interface CriteriaProps {
  min_cgpa: number;
  min_percentage: number;
  liveKT: number;
  deadKT: number;
  diploma: boolean;
  ssc: number;
  hsc: number;
  diploma_percentage: number | null;
}

interface JobProps {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  criteria: CriteriaProps;
  location: string;
  type: string;
  ctc: number;
  vacancies: number;
  bond_details: string;
  skills_required: string[];
  last_date_for_application: Date;
  for_dept: string[];
}

interface HiringProcessRoundProps {
  title: string;
  mode: "Online" | "Offline";
  round_number: number;
}

interface JobDataProps {
  company: CompanyProps;
  job: JobProps;
  hiring_process: HiringProcessRoundProps[];
}

// --- Academic Details Interface ---
interface AcademicDetails {
  approved: "approved" | "rejected" | "pending";
  qualificationType: "Diploma" | "BE" | "HSC";
  be_cgpa: number;
  be_percentage: number;
  diploma_cgpa: number;
  hsc_percentage: number;
  ssc_percentage: number;
  liveKT: number;
  deadKT: number;
  diploma_percentage?: number;
}

export default function JobDetailsPage() {
  const [jobData, setJobData] = useState<JobDataProps | null>(null);
  const [academicDetails, setAcademicDetails] =
    useState<AcademicDetails | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [loadingEligibility, setLoadingEligibility] = useState<boolean>(true);
  const [applying, setApplying] = useState<boolean>(false);
  const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);

  const { id } = useParams();

  // --- Fetch Job Details ---
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`${API_ROUTES.OFFER_INFO}/?jobId=${id}`, {
          withCredentials: true,
        });
        setJobData(res.data.data);
      } catch (error) {
        // silently fail
      }
    };
    fetchJobDetails();
  }, [id]);

  // --- Fetch Academic Details ---
  useEffect(() => {
    const fetchAcademicDetails = async () => {
      try {
        const res = await axios.get(API_ROUTES.STUDENT_ACAD_PROFILE, {
          withCredentials: true,
        });
        setAcademicDetails(res.data.data);
      } catch (error) {
        // silently fail
      }
    };
    fetchAcademicDetails();
  }, []);

  // --- Check if Already Applied ---
  useEffect(() => {
    if (!id) return;

    const checkApplication = async () => {
      try {
        const res = await axios.post(
          `${API_ROUTES.CHECK_APPLICATION}/${id}`,
          {},
          { withCredentials: true }
        );

        // Extract the applied flag from response
        const hasApplied = res.data?.data?.applied ?? false;
        setAlreadyApplied(hasApplied);
      } catch (error) {
        setAlreadyApplied(false);
        console.error("Error checking application:", error);
      }
    };

    checkApplication();
  }, [id]);

  // --- Check Eligibility ---
  useEffect(() => {
    if (jobData && academicDetails) {
      const { criteria } = jobData.job;
      const student = academicDetails;
      let meetsCriteria = true;

      // KT checks
      if (criteria.liveKT !== undefined && student.liveKT > criteria.liveKT) {
        meetsCriteria = false;
      }
      if (criteria.deadKT !== undefined && student.deadKT > criteria.deadKT) {
        meetsCriteria = false;
      }

      if (student.qualificationType === "HSC") {
        if (criteria.min_cgpa && student.be_cgpa < criteria.min_cgpa) {
          meetsCriteria = false;
        }
        if (
          criteria.min_percentage &&
          student.be_percentage < criteria.min_percentage
        ) {
          meetsCriteria = false;
        }
        if (criteria.ssc && student.ssc_percentage < criteria.ssc) {
          meetsCriteria = false;
        }
        if (criteria.hsc && student.hsc_percentage < criteria.hsc) {
          meetsCriteria = false;
        }
      } else if (student.qualificationType === "Diploma") {
        if (!criteria.diploma) {
          meetsCriteria = false;
        }
        if (criteria.min_cgpa && student.diploma_cgpa < criteria.min_cgpa) {
          meetsCriteria = false;
        }
        if (
          criteria.min_percentage &&
          (student.diploma_percentage ?? 0) < criteria.min_percentage
        ) {
          meetsCriteria = false;
        }
      } else {
        meetsCriteria = false;
      }

      setIsEligible(meetsCriteria);
      setLoadingEligibility(false);
    }
  }, [jobData, academicDetails]);

  // --- Handle Apply ---
  const handleApply = async () => {
    if (!id) return;
    setApplying(true);
    try {
      const response = await axios.post(
        `${API_ROUTES.ADD_APPLICATION}/${id}`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message || "Application submitted successfully!");
      setAlreadyApplied(true);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to submit application. Please try again later."
      );
    } finally {
      setApplying(false);
    }
  };

  // --- Render ---
  if (!jobData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Loading Job Details...
      </div>
    );
  }

  const { company, job, hiring_process } = jobData;
  const applicationDeadline = job?.last_date_for_application
    ? new Date(job.last_date_for_application).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <img
              src={company.logo}
              alt={`${company.name} Logo`}
              className="h-16 w-16 rounded-full border-2 border-border"
            />
            <div>
              <h1 className="text-3xl font-bold text-black">{job.title}</h1>
              <a
                href={company.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                {company.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Job Info */}
        <Card className="mb-6">
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm pt-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Location:</span>
              <Badge variant="secondary">{job.location}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Job Type:</span>
              <Badge variant="secondary">{job.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">CTC:</span>
              <Badge variant="secondary">{job.ctc / 100000} LPA</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Apply by:</span>
              <Badge variant="destructive">{applicationDeadline}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Vacancies:</span>
              <Badge variant="secondary">{job.vacancies}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Layout Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* About Company */}
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {company.company_description}
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-card-foreground">
                      Website:
                    </span>{" "}
                    <a
                      href={company.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {company.company_website}
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold text-card-foreground">
                      Location:
                    </span>{" "}
                    {company.company_location}
                  </div>
                  <div>
                    <span className="font-semibold text-card-foreground">
                      Industry:
                    </span>{" "}
                    {company.company_type}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {job.description}
                </p>
                <h3 className="font-semibold mb-2">Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mt-4 mb-2">Requirements:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  {job.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min. CGPA:</span>
                  <span className="font-medium">{job.criteria.min_cgpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Min. Percentage:
                  </span>
                  <span className="font-medium">
                    {job.criteria.min_percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">10th / SSC:</span>
                  <span className="font-medium">{job.criteria.ssc}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">12th / HSC:</span>
                  <span className="font-medium">{job.criteria.hsc}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Live Backlogs:</span>
                  <span className="font-medium">{job.criteria.liveKT}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dead Backlogs:</span>
                  <span className="font-medium">{job.criteria.deadKT}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {job.skills_required.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Hiring Process */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Process</CardTitle>
              </CardHeader>
              <CardContent>
                {hiring_process.length > 0 ? (
                  hiring_process.map((round) => (
                    <div
                      key={round.round_number}
                      className="relative pl-8 mb-4"
                    >
                      <div className="absolute left-0 top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                      <p className="font-semibold text-foreground">
                        Round {round.round_number}: {round.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {round.mode}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hiring process defined.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Bond */}
            <Card>
              <CardHeader>
                <CardTitle>Bond Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {job.bond_details || "No bond information available."}
                </p>
              </CardContent>
            </Card>

            {/* Apply Button */}
            {academicDetails ? (
              academicDetails.approved === "approved" ? (
                <div>
                  {loadingEligibility ? (
                    <Button className="w-full text-lg" size="lg" disabled>
                      Checking Eligibility...
                    </Button>
                  ) : alreadyApplied ? (
                    <Button className="w-full text-lg" size="lg" disabled>
                      Already Applied
                    </Button>
                  ) : isEligible ? (
                    <Button
                      className="w-full text-lg"
                      size="lg"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? "Applying..." : "Apply Now"}
                    </Button>
                  ) : (
                    <Button className="w-full text-lg" size="lg" disabled>
                      Not Eligible
                    </Button>
                  )}
                </div>
              ) : (
                <Button className="w-full text-lg" size="lg" disabled>
                  Academic Profile Not Approved
                </Button>
              )
            ) : (
              <Button className="w-full text-lg" size="lg" disabled>
                Loading Academic Info...
              </Button>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
