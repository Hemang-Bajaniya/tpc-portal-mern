"use client";

import CompanyCard from "@/components/custom/CompanyCard";
import { API_ROUTES } from "@/lib/apiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Job {
  logo: string;
  company_name: string;
  ctc: Number;
  location: string;
  to: string;
  last_date_for_application: string;
  skills_required: string[];
  matchCount?: number;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("skills"); // Default sort by skills

  function countMatchingSkills(userSkills: string[], jobSkills: string[]) {
    return jobSkills.filter((skill) => userSkills.includes(skill.toLowerCase())).length;
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch jobs
        const jobsRes = await axios.get(`${API_ROUTES.OFFER_INFO}?all=true`, {
          withCredentials: true,
        });
        const fetchedJobs = jobsRes.data.data || [];

        // Fetch user skills
        const userSkillsRes = await axios.get(API_ROUTES.USER_SKILLS, {
          withCredentials: true,
        });
        const studentSkills = userSkillsRes.data.data.skills || [];

        // Add matchCount to jobs
        const jobsWithMatchCount = fetchedJobs.map((job: any) => ({
          ...job,
          matchCount: countMatchingSkills(studentSkills, job.skills_required),
        }));

        setJobs(jobsWithMatchCount);
        setFilteredJobs(jobsWithMatchCount);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch job listings.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle filtering and sorting whenever locationSearch or sortBy changes
  useEffect(() => {
    let updatedJobs = [...jobs];

    // Filter by location
    if (locationSearch.trim()) {
      updatedJobs = updatedJobs.filter((job) =>
        job.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Sort jobs based on sortBy value
    updatedJobs = updatedJobs.sort((a, b) => {
      if (sortBy === "skills") {
        return (b.matchCount || 0) - (a.matchCount || 0);
      } else if (sortBy === "ctc") {
        const ctcA = Number(a.ctc) || 0;
        const ctcB = Number(b.ctc) || 0;
        return ctcB - ctcA; // Descending order
      } else if (sortBy === "date") {
        const dateA = new Date(a.last_date_for_application).getTime();
        const dateB = new Date(b.last_date_for_application).getTime();
        return dateA - dateB; // Ascending order (earliest first)
      }
      return 0;
    });

    setFilteredJobs(updatedJobs);
  }, [locationSearch, sortBy, jobs]);

  return (
    <div className="h-full bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Jobs</h1>

      {/* Filter and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by location..."
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="skills">Sort by Skills Match</SelectItem>
            <SelectItem value="ctc">Sort by CTC (High to Low)</SelectItem>
            <SelectItem value="date">Sort by Application Date (Earliest)</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setLocationSearch("");
            setSortBy("skills");
          }}
        >
          Reset
        </Button>
      </div>

      {loading && (
        <p className="text-center text-gray-600">Loading jobs...</p>
      )}
      {error && !loading && (
        <p className="text-center text-red-500 mt-4">Error: {error}</p>
      )}
      {!loading && !error && filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No open positions found.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((item, index) => (
          <CompanyCard
            key={index}
            logo={item.logo}
            name={item.company_name}
            ctc={parseInt(item.ctc.toString())}
            location={item.location}
            to={`/student/dashboard${item.to}`}
            applicationDate={item.last_date_for_application}
            matchedCount={item.matchCount || 0}
            drive_complition_date={null}
          />
        ))}
      </div>
    </div>
  );
}