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
import { UploadCloud, Building2, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { API_ROUTES } from "@/lib/apiRoutes";
import axios from "axios";

interface JobProfileData {
  company_id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  // criteria
  min_cgpa?: number;
  min_percentage?: number;
  liveKT?: number;
  deadKT?: number;
  diploma?: boolean;
  ssc?: number;
  hsc?: number;
  diploma_percentage?: number;
  location: string;
  type: string;
  ctc?: number;
  vacancies?: number;
  bond_details?: string;
  skills_required: string[];
  last_date_for_application?: string; // ISO string
  for_dept: string[];
}

// Dummy companies for dropdown
const dummyCompanies = [
  { _id: "COMP001", name: "Stellar Solutions Inc." },
  { _id: "COMP002", name: "Quantum Innovations" },
  { _id: "COMP003", name: "Nexus Technologies" },
];

// Dummy Skill & Department Lists (normally you'd fetch these from the backend)
const availableSkills = [
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "Python",
  "Django",
  "HTML",
  "CSS",
  "C++",
  "Java",
];

const DepartmentList = [
  { dept_id: "cse", dept_name: "Computer Science" },
  { dept_id: "ece", dept_name: "Electronics" },
  { dept_id: "me", dept_name: "Mechanical" },
  { dept_id: "ce", dept_name: "Civil" },
  { dept_id: "it", dept_name: "Information Technology" },
];

export default function AddJobProfileForm({ allowUpdate = true }) {
  const [formData, setFormData] = useState<JobProfileData>({
    company_id: "",
    title: "",
    description: "",
    responsibilities: [""],
    requirements: [""],
    location: "",
    type: "",
    skills_required: [],
    for_dept: [],
    last_date_for_application: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [departments, setDepartments] = useState(DepartmentList);
  const [companies, setCompanies] = useState(dummyCompanies);

  useEffect(() => {
    // Fetch departments and companies from backend if needed

    const fetchData = async () => {
      try {
        const companiesRes = await axios.get(API_ROUTES.COMPANIES, {
          withCredentials: true,
        });
        const departmentsRes = await axios.get(API_ROUTES.DEPARTMENTS, {
          withCredentials: true,
        });

        if (companiesRes.status === 200) {
          setCompanies(companiesRes.data.data);
        }
        if (departmentsRes.status === 200) {
          setDepartments(departmentsRes.data.data);
        }

        // console.log();
      } catch (error) {
        console.error("Error fetching companies or departments:", error);
      }
    };
    fetchData();
  }, []);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills_required.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills_required: [...prev.skills_required, trimmed],
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((s) => s !== skill),
    }));
  };

  const addDepartment = (dept_id: string) => {
    if (dept_id && !formData.for_dept.includes(dept_id)) {
      setFormData((prev) => ({
        ...prev,
        departments: [...prev.for_dept, dept_id],
      }));
    }
    setDepartmentInput("");
  };

  const removeDepartment = (dept_id: string) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.for_dept.filter((d) => d !== dept_id),
    }));
  };

  const updateField = (name: keyof JobProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    updateField(name as any, value);
  };

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const handleResponsibilityChange = (idx: number, value: string) => {
    const arr = [...formData.responsibilities];
    arr[idx] = value;
    updateField("responsibilities", arr);
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const handleRequirementChange = (idx: number, value: string) => {
    const arr = [...formData.requirements];
    arr[idx] = value;
    updateField("requirements", arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_ROUTES.JOBS, formData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        alert("Job Profile added successfully!");
        // Reset form or redirect as needed
        setFormData({
          company_id: "",
          title: "",
          description: "",
          responsibilities: [""],
          requirements: [""],
          location: "",
          type: "",
          skills_required: [],
          for_dept: [],
          last_date_for_application: "",
        });
      } else {
        alert("Failed to add job profile. Please try again.");
      }
    } catch (error) {
      console.error("Error adding job profile:", error);
      alert("An error occurred while adding the job profile.");
    }
    alert("Check console for submitted data");
  };

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold">
                Add Job Profile
              </CardTitle>
              <CardDescription>Enter job profile details</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* 1. Company Dropdown */}
          <div>
            <Label htmlFor="company_id" className="pb-2">
              Select Company
            </Label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              disabled={!allowUpdate}
              className="border rounded w-full h-10 px-3"
            >
              <option value="">-- Select Company --</option>
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

          {/* Responsibilities with dynamic add */}
          <div>
            <div className="flex w-full items-center justify-between">
              <Label className="flex items-center">Responsibilities</Label>
              {allowUpdate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    addResponsibility();
                  }}
                  className="flex justify-end ml-auto"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2 mt-2">
              {formData.responsibilities.map((resp, idx) => (
                <Input
                  key={idx}
                  value={resp}
                  onChange={(e) =>
                    handleResponsibilityChange(idx, e.target.value)
                  }
                  disabled={!allowUpdate}
                  placeholder={`Responsibility #${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Requirements dynamic */}
          <div>
            <div className="flex w-full items-center justify-between">
              <Label className="flex items-center">Requirements</Label>
              {allowUpdate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    addRequirement();
                  }}
                  className="ml-auto"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2 mt-2">
              {formData.requirements.map((req, idx) => (
                <Input
                  key={idx}
                  value={req}
                  onChange={(e) => handleRequirementChange(idx, e.target.value)}
                  disabled={!allowUpdate}
                  placeholder={`Requirement #${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Academic Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_cgpa" className="pb-2">
                Minimum CGPA
              </Label>
              <Input
                id="min_cgpa"
                name="min_cgpa"
                value={formData.min_cgpa ?? ""}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                max="10"
              />
            </div>

            <div>
              <Label htmlFor="min_percentage" className="pb-2">
                Minimum Percentage
              </Label>
              <Input
                id="min_percentage"
                name="min_percentage"
                value={formData.min_percentage ?? ""}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="liveKT" className="pb-2">
                Live Backlogs
              </Label>
              <Input
                id="liveKT"
                name="liveKT"
                value={formData.liveKT ?? ""}
                onChange={handleChange}
                type="number"
                step="1"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="deadKT" className="pb-2">
                Dead Backlogs
              </Label>
              <Input
                id="deadKT"
                name="deadKT"
                value={formData.deadKT ?? ""}
                onChange={handleChange}
                type="number"
                step="1"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hsc" className="pb-2">
                HSC Percentage
              </Label>
              <Input
                id="hsc"
                name="hsc"
                value={formData.hsc ?? ""}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="ssc" className="pb-2">
                SSC Percentage
              </Label>
              <Input
                id="ssc"
                name="ssc"
                value={formData.ssc ?? ""}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 mt-6">
              <Checkbox
                id="diploma"
                checked={formData.diploma || false}
                onCheckedChange={(checked) => updateField("diploma", !!checked)}
              />
              <Label htmlFor="diploma" className="text-sm font-medium">
                Diploma Student
              </Label>
            </div>

            <div>
              <Label htmlFor="diploma_percentage" className="pb-2">
                Diploma Percentage
              </Label>
              <Input
                id="diploma_percentage"
                name="diploma_percentage"
                value={formData.diploma_percentage ?? ""}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_cgpa" className="pb-2">
                Minimum Cgpa
              </Label>
              <Input
                id="min_cgpa"
                name="min_cgpa"
                value={formData.min_cgpa || 5.0}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="min_per" className="pb-2">
                Minimum Percentage
              </Label>
              <Input
                id="min_per"
                name="min_per"
                value={formData.min_percentage || 50}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="live_kt" className="pb-2">
                Live Backlog
              </Label>
              <Input
                id="live_kt"
                name="live_kt"
                value={formData.liveKT || 0}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="dead_kt" className="pb-2">
                Dead Backlog
              </Label>
              <Input
                id="dead_kt"
                name="dead_kt"
                value={formData.deadKT || 0}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hsc_per" className="pb-2">
                HSC Percentage
              </Label>
              <Input
                id="hsc_per"
                name="hsc_per"
                value={formData.hsc || 5.0}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="ssc_per" className="pb-2">
                SSC Percentage
              </Label>
              <Input
                id="ssc_per"
                name="ssc_per"
                value={formData.ssc || 50}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Checkbox id="diploma-student" className="mr-4 size-5" />
              <label
                htmlFor="diploma-student"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Diploma Student
              </label>
            </div>
            <div>
              <Label htmlFor="dip_per" className="pb-2">
                Diploma Percentage
              </Label>
              <Input
                id="dip_per"
                name="dip_per"
                value={formData.diploma_percentage || 5.0}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          {/* Skills Input */}
          <div>
            <Label className="block mb-2">Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills_required.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
            <div className="relative">
              <Input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                placeholder="Type and press enter to add skill"
                className="w-full"
              />
              {skillInput && (
                <div className="absolute z-10 bg-white border mt-1 rounded-md shadow-md w-full max-h-48 overflow-y-auto">
                  {availableSkills
                    .filter(
                      (s) =>
                        s.toLowerCase().includes(skillInput.toLowerCase()) &&
                        !formData.skills_required.includes(s)
                    )
                    .map((s) => (
                      <div
                        key={s}
                        onClick={() => addSkill(s)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                      >
                        {s}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Departments Input */}
          <div className="mt-6">
            <Label className="block mb-2">Departments</Label>

            {/* Selected Departments */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.for_dept.map((deptId) => {
                const dept = departments.find((d) => d.dept_id === deptId);
                return (
                  <div
                    key={deptId}
                    className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {dept?.dept_name || deptId}
                    <span
                      className="ml-1 cursor-pointer"
                      onClick={() => removeDepartment(deptId)}
                    >
                      ×
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Autocomplete Input */}
            <div className="relative">
              <Input
                type="text"
                value={departmentInput}
                onChange={(e) => setDepartmentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const match = departments.find(
                      (d) =>
                        d.dept_name.toLowerCase() ===
                          departmentInput?.toLowerCase() ||
                        d.dept_id.toLowerCase() ===
                          departmentInput?.toLowerCase()
                    );
                    if (match) addDepartment(match.dept_id);
                  }
                }}
                placeholder="Type and press enter to add department"
              />

              {/* Suggestions */}
              {departmentInput && (
                <div className="absolute z-10 bg-white border mt-1 rounded-md shadow-md w-full max-h-48 overflow-y-auto">
                  {departments
                    .filter(
                      (d) =>
                        (d.dept_name
                          .toLowerCase()
                          .includes(departmentInput.toLowerCase()) ||
                          d.dept_id
                            .toLowerCase()
                            .includes(departmentInput.toLowerCase())) &&
                        !formData.for_dept.includes(d.dept_id)
                    )
                    .map((d) => (
                      <div
                        key={d.dept_id}
                        onClick={() => addDepartment(d.dept_id)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                      >
                        {d.dept_name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional fields (type, vacancies, ctc, etc.) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="pb-2">
                Job Type
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
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
              <Label htmlFor="last_date_for_application" className="pb-2">
                Last Date
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
          </div>
        </CardContent>

        <CardFooter className="border-t border-border pt-6 px-6 flex justify-end">
          <Button type="submit" disabled={!allowUpdate}>
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
