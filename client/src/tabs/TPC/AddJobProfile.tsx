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
import { availableSkills } from "@/components/custom/AvailableSkills";

interface Department {
  _id: string;
  dept_id: string;
  dept_name: string;
}

interface Company {
  _id: string;
  name: string;
  logo?: string;
}

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
  last_date_for_application?: string;
  for_dept: string[];
}

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
  const [departmentInput, setDepartmentInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, departmentsRes] = await Promise.all([
          axios.get(API_ROUTES.COMPANIES, { withCredentials: true }),
          axios.get(API_ROUTES.DEPARTMENTS, { withCredentials: true }),
        ]);

        if (companiesRes.status === 200)
          setCompanies(companiesRes.data.data || []);
        if (departmentsRes.status === 200)
          setDepartments(departmentsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching companies or departments:", error);
      }
    };
    fetchData();
  }, []);

  const updateField = (name: keyof JobProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateField(name as any, value);
  };

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
        for_dept: [...prev.for_dept, dept_id],
      }));
    }
    setDepartmentInput("");
  };

  const removeDepartment = (dept_id: string) => {
    setFormData((prev) => ({
      ...prev,
      for_dept: prev.for_dept.filter((d) => d !== dept_id),
    }));
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
      const payload = {
        ...formData,
        criteria: {
          min_cgpa: formData.min_cgpa,
          min_percentage: formData.min_percentage,
          liveKT: formData.liveKT,
          deadKT: formData.deadKT,
          diploma: formData.diploma,
          ssc: formData.ssc,
          hsc: formData.hsc,
          diploma_percentage: formData.diploma_percentage,
        },
      };

      const res = await axios.post(API_ROUTES.JOBS, payload, {
        withCredentials: true,
      });
      if (res.status === 201) {
        alert("Job Profile added successfully!");
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
          {/* Company Dropdown */}
          <div>
            <Label htmlFor="company_id" className="pb-2">
              Select Company
            </Label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id || ""}
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
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                disabled={!allowUpdate}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                disabled={!allowUpdate}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              disabled={!allowUpdate}
            />
          </div>

          {/* Responsibilities */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Responsibilities</Label>
              {allowUpdate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    addResponsibility();
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2 mt-2">
              {formData.responsibilities.map((resp, idx) => (
                <Input
                  key={idx}
                  value={resp || ""}
                  onChange={(e) =>
                    handleResponsibilityChange(idx, e.target.value)
                  }
                  placeholder={`Responsibility #${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Requirements</Label>
              {allowUpdate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    addRequirement();
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2 mt-2">
              {formData.requirements.map((req, idx) => (
                <Input
                  key={idx}
                  value={req || ""}
                  onChange={(e) => handleRequirementChange(idx, e.target.value)}
                  placeholder={`Requirement #${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Academic Criteria Section (kept as in your schema) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Minimum CGPA</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.min_cgpa ?? ""}
                onChange={handleChange}
                name="min_cgpa"
              />
            </div>
            <div>
              <Label>Minimum Percentage</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.min_percentage ?? ""}
                onChange={handleChange}
                name="min_percentage"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Live KT</Label>
              <Input
                type="number"
                value={formData.liveKT ?? ""}
                onChange={handleChange}
                name="liveKT"
              />
            </div>
            <div>
              <Label>Dead KT</Label>
              <Input
                type="number"
                value={formData.deadKT ?? ""}
                onChange={handleChange}
                name="deadKT"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>SSC %</Label>
              <Input
                type="number"
                value={formData.ssc ?? ""}
                onChange={handleChange}
                name="ssc"
              />
            </div>
            <div>
              <Label>HSC %</Label>
              <Input
                type="number"
                value={formData.hsc ?? ""}
                onChange={handleChange}
                name="hsc"
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
              <Label htmlFor="diploma">Diploma Student</Label>
            </div>
            <div>
              <Label>Diploma Percentage</Label>
              <Input
                type="number"
                value={formData.diploma_percentage ?? ""}
                onChange={handleChange}
                name="diploma_percentage"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
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

          {/* Departments */}
          <div className="mt-6">
            <Label>Departments</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.for_dept.map((deptId) => {
                const dept = departments.find((d) => d._id === deptId);
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
                        d.dept_name
                          .toLowerCase()
                          .includes(departmentInput.toLowerCase()) ||
                        d.dept_id
                          .toLowerCase()
                          .includes(departmentInput.toLowerCase())
                    );
                    if (match) addDepartment(match._id);
                  }
                }}
                placeholder="Type and press enter to add department"
              />

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
                        !formData.for_dept.includes(d._id)
                    )
                    .map((d) => (
                      <div
                        key={d._id}
                        onClick={() => addDepartment(d._id)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                      >
                        {d.dept_name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Job Type</Label>
              <Input
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Vacancies</Label>
              <Input
                type="number"
                name="vacancies"
                value={formData.vacancies ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>CTC (LPA)</Label>
              <Input
                type="number"
                name="ctc"
                value={formData.ctc ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Last Date</Label>
              <Input
                type="date"
                name="last_date_for_application"
                value={formData.last_date_for_application || ""}
                onChange={handleChange}
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
