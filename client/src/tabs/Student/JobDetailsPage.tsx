import React, { useState, useEffect } from 'react';

// In a real application, you would import react-router-dom for navigation
// import { useNavigate } from 'react-router-dom';

// --- ShadCN UI Component Imports ---
// Assumes you have these components set up in your project
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Icon Imports (using lucide-react, the default for ShadCN) ---
import { ExternalLink, X as CloseIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '@/lib/apiRoutes';

// --- TypeScript Interfaces for Data Structures ---
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
    for_dept: string[]; // Assuming department names are strings for display
}

interface HiringProcessRoundProps {
    title: string;
    mode: 'Online' | 'Offline';
    round_number: number;
}

interface JobDataProps {
    company: CompanyProps;
    job: JobProps;
    hiring_process: HiringProcessRoundProps[];
}


// Main Job Details Component
export default function JobDetailsPage() {
    // In a real application with react-router-dom:
    // const navigate = useNavigate();
    // const handleClose = () => navigate(-1);
    const handleClose = () => {
        alert("Redirecting to the previous page...");
    };

    const [jobData, setJobData] = useState<JobDataProps | null>(null);
    const jobId = useParams().id;
    const params = useParams()

    // Simulate fetching data from an API
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`${API_ROUTES.OFFER_INFO}/?jobId=${params.id}`, { withCredentials: true });
                setJobData(res.data.data);
                console.log(res.data.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        }

        fetchJobDetails();
    }, [jobId]);

    if (!jobData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                Loading Job Details...
            </div>
        );
    }

    const { company, job, hiring_process } = jobData;
    // const applicationDeadline = job?.last_date_for_application?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const applicationDeadline = job?.last_date_for_application ? new Date(job.last_date_for_application).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* -- Header -- */}
                <header className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                        <img src={company.logo} alt={`${company.name} Logo`} className="h-16 w-16 rounded-full border-2 border-border" />
                        <div>
                            <h1 className="text-3xl font-bold text-black">{job.title}</h1>
                            <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-400 hover:underline inline-flex items-center gap-1">
                                {company.name}
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </header>

                {/* -- Key Details Bar -- */}
                <Card className="mb-6">
                    <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm pt-6">
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">Location:</span> <Badge variant="secondary">{job.location}</Badge></div>
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">Job Type:</span> <Badge variant="secondary">{job.type}</Badge></div>
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">CTC:</span> <Badge variant="secondary">{job.ctc} LPA</Badge></div>
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">Apply by:</span> <Badge variant="destructive">{applicationDeadline}</Badge></div>
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">Vacancies:</span> <Badge variant="secondary">{job.vacancies}</Badge></div>
                    </CardContent>
                </Card>

                {/* -- Main Content Grid -- */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader><CardTitle>About {company.name}</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{company.company_description}</p>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-semibold text-card-foreground">Website:</span> <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{company.company_website}</a></div>
                                    <div><span className="font-semibold text-card-foreground">Location:</span> {company.company_location}</div>
                                    <div><span className="font-semibold text-card-foreground">Industry:</span> {company.company_type}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Job Description</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4 leading-relaxed">{job.description}</p>
                                <h3 className="font-semibold text-card-foreground mb-2">Responsibilities:</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                                    {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                                <h3 className="font-semibold text-card-foreground mt-4 mb-2">Requirements:</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                                    {job.requirements.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="flex flex-col gap-6">
                        <Card>
                            <CardHeader><CardTitle>Eligibility Criteria</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Min. CGPA:</span> <span className="font-medium text-foreground">{job.criteria.min_cgpa}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Min. Percentage:</span> <span className="font-medium text-foreground">{job.criteria.min_percentage}%</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">10th / SSC:</span> <span className="font-medium text-foreground">{job.criteria.ssc}%</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">12th / HSC:</span> <span className="font-medium text-foreground">{job.criteria.hsc}%</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Live Backlogs:</span> <span className="font-medium text-foreground">{job.criteria.liveKT}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Dead Backlogs:</span> <span className="font-medium text-foreground">{job.criteria.deadKT}</span></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Skills Required</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {job.skills_required.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Hiring Process</CardTitle></CardHeader>
                            <CardContent className="relative">
                                {hiring_process.map((round) => (
                                    <div key={round.round_number} className="relative pl-8 mb-4">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                                        <p className="font-semibold text-foreground">Round {round.round_number}: {round.title}</p>
                                        <p className="text-xs text-muted-foreground">{round.mode}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Bond Details</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{job.bond_details || "No bond information available."}</p>
                            </CardContent>
                        </Card>
                        <Button className="w-full text-lg" size="lg">Apply Now</Button>
                    </aside>
                </main>
            </div>
        </div>
    );
}