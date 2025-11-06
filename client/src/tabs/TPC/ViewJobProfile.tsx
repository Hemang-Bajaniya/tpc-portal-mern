import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { API_ROUTES } from "@/lib/apiRoutes";
import axios from "axios";
import { log } from "node:console";
import { Company } from "./CompanyManagement";

interface JobProfileData {
  company_id: Company;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  location: string;
  type: string;
  ctc?: number;
  vacancies?: number;
  bond_details?: string;
  skills_required: string[];
  last_date_for_application?: string;
  for_dept: string[];
}

const dummyJobProfile: JobProfileData = {
  company_id: {
    _id: "COMP001",
    name: "Stellar Solutions Inc.",
    logo: "",
    company_location: "",
    contact_email: "",
  },
  title: "Software Engineer",
  description: "We are hiring a software engineer to work with our team.",
  responsibilities: ["Develop features", "Write unit tests"],
  requirements: ["Good communication", "Problem-solving skills"],
  location: "Bangalore",
  type: "Full-Time",
  skills_required: ["React", "Node.js"],
  for_dept: ["cse", "it"],
  ctc: 10,
  vacancies: 3,
  last_date_for_application: "2025-12-31",
};

const dummyCompanies = [
  { id: "COMP001", name: "Stellar Solutions Inc." },
  { id: "COMP002", name: "Quantum Innovations" },
  { id: "COMP003", name: "Nexus Technologies" },
];

const DepartmentList = [
  { dept_id: "cse", dept_name: "Computer Science" },
  { dept_id: "ece", dept_name: "Electronics" },
  { dept_id: "me", dept_name: "Mechanical" },
  { dept_id: "ce", dept_name: "Civil" },
  { dept_id: "it", dept_name: "Information Technology" },
];

export default function ViewJobProfileForm({
  allowUpdate = false,
}: {
  allowUpdate: boolean;
}) {
  const [formData, setFormData] = useState<JobProfileData>(dummyJobProfile);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [companiesRes, departmentsRes, jobRes] = await Promise.all([
          axios.get(API_ROUTES.COMPANIES, { withCredentials: true }),
          axios.get(API_ROUTES.DEPARTMENTS, { withCredentials: true }),
          axios.get(`${API_ROUTES.JOBS}/${id}`, { withCredentials: true }),
        ]);

        setCompanies(companiesRes.data.data);
        setDepartments(departmentsRes.data.data);

        console.log(companiesRes);

        const jobProfiles = jobRes.data.data as JobProfileData;
        setFormData(jobProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     try {
  //       const res = await axios.get(API_ROUTES.COMPANIES, { withCredentials: true });
  //       if (res.status === 200) {
  //         // Assuming res.data.data is an array of companies
  //         setCompanies(res.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching companies:", error);
  //     }
  //   };

  //   const fetchDepartments = async () => {
  //     try {
  //       console.log("dept fetch");

  //       const res = await axios.get(API_ROUTES.DEPARTMENTS, { withCredentials: true });
  //       console.log(res);
  //       setDepartments(res.data)
  //       setDepartments(res.data);
  //       console.log("dept", departments);
  //     } catch (error) {
  //       console.error("Error fetching departments:", error);
  //     }
  //   };

  //   // Fetch job profile data based on jobProfileId
  //   const fetchJobProfile = async () => {
  //     try {
  //       const response = await axios.get(`${API_ROUTES.JOBS}/${id}`, { withCredentials: true });
  //       if (response.status === 200) {
  //         const jobProfiles = response.data.data as JobProfileData;
  //         console.log(response);
  //         console.log("->", departments);

  //         setFormData(jobProfiles);
  //       } else {
  //         console.error("Failed to fetch job profile data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching job profile data:", error);
  //     }
  //   };
  //   // setFormData(fetchedData);
  //   if (id) {
  //     fetchCompanies();
  //     fetchDepartments();
  //     fetchJobProfile();
  //   }
  // }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ctc" || name === "vacancies" ? Number(value) : value,
    }));
  };

  const handleListChange = (
    listName: "responsibilities" | "requirements",
    idx: number,
    value: string
  ) => {
    const updatedList = [...formData[listName]];
    updatedList[idx] = value;
    setFormData((prev) => ({
      ...prev,
      [listName]: updatedList,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Job Profile Data:", formData);
  };

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold">
                {allowUpdate ? "Update Job Profile" : "Job Profile Overview"}
              </CardTitle>
              <CardDescription>
                {allowUpdate
                  ? "Modify the details below"
                  : "Details of the job profile"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Company */}
          <div>
            <Label htmlFor="company_id" className="pb-2">
              Company
            </Label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id?._id || ""}
              onChange={(e) => {
                const selectedCompany = companies.find(
                  (c) => c._id === e.target.value
                );
                if (selectedCompany) {
                  setFormData((prev) => ({
                    ...prev,
                    company_id: selectedCompany,
                  }));
                }
              }}
              disabled={!allowUpdate}
              className="border rounded w-full h-10 px-3"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="pb-2">
                Job Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={!allowUpdate}
              />
            </div>
            <div>
              <Label htmlFor="location" className="pb-2">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!allowUpdate}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="pb-2">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!allowUpdate}
            />
          </div>

          {/* Responsibilities */}
          <div>
            <Label className="flex items-center justify-between pb-2">
              Responsibilities
              {allowUpdate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData((prev) => ({
                      ...prev,
                      responsibilities: [...prev.responsibilities, ""],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </Label>
            <div className="space-y-2">
              {Array.isArray(formData.responsibilities) ? (
                formData.responsibilities.map((resp, idx) => (
                  <Input
                    key={idx}
                    value={resp}
                    onChange={(e) =>
                      handleListChange("responsibilities", idx, e.target.value)
                    }
                    disabled={!allowUpdate}
                    placeholder={`Responsibility #${idx + 1}`}
                  />
                ))
              ) : (
                <Input
                  key={"res"}
                  value={formData.responsibilities}
                  onChange={(e) =>
                    handleListChange("responsibilities", 1, e.target.value)
                  }
                  disabled={!allowUpdate}
                  placeholder={`Responsibility #${1}`}
                />
              )}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <Label className="flex items-center justify-between pb-2">
              Requirements
              {allowUpdate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData((prev) => ({
                      ...prev,
                      requirements: [...prev.requirements, ""],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </Label>
            <div className="space-y-2">
              {formData.requirements.map((req, idx) => (
                <Input
                  key={idx}
                  value={req}
                  onChange={(e) =>
                    handleListChange("requirements", idx, e.target.value)
                  }
                  disabled={!allowUpdate}
                  placeholder={`Requirement #${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Skills (Display Only) */}
          <div>
            <Label>Skills Required</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills_required.map((skill) => (
                <span
                  key={skill}
                  className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Departments (Display Only) */}
          <div>
            <Label>Departments</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.for_dept.map((deptId) => {
                const dept = departments.find(
                  (d) => d.dept_id === deptId || d._id === deptId
                );

                return (
                  <span
                    key={deptId}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {dept?.dept_name || deptId}
                  </span>
                );
              })}
            </div>
          </div>

          {/* CTC, Vacancies, Last Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ctc" className="pb-2">
                CTC
              </Label>
              <Input
                id="ctc"
                name="ctc"
                type="number"
                value={formData.ctc ?? ""}
                onChange={handleChange}
                disabled={!allowUpdate}
              />
            </div>
            <div>
              <Label htmlFor="vacancies" className="pb-2">
                Vacancies
              </Label>
              <Input
                id="vacancies"
                name="vacancies"
                type="number"
                value={formData.vacancies ?? ""}
                onChange={handleChange}
                disabled={!allowUpdate}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="last_date_for_application" className="pb-2">
              Last Date for Application
            </Label>
            <Input
              id="last_date_for_application"
              name="last_date_for_application"
              type="date"
              value={formData.last_date_for_application ?? ""}
              onChange={handleChange}
              disabled={!allowUpdate}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t border-border pt-6 px-6 flex justify-end">
          {allowUpdate && <Button type="submit">Update Job</Button>}
        </CardFooter>
      </form>
    </Card>
  );
}
