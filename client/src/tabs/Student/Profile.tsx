import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, API_ROUTES } from "@/lib/apiRoutes";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Validation rules
const validationRules = {
  college_id: {
    regex: /^[A-Za-z0-9-]{3,20}$/,
    message: "College ID must be 3-20 characters, alphanumeric or hyphens only",
  },
  f_name: {
    regex: /^[A-Za-z]{1,50}$/,
    message: "First name must be 1-50 letters only",
  },
  m_name: {
    regex: /^[A-Za-z]{0,50}$/,
    message: "Middle name must be 0-50 letters only",
  },
  l_name: {
    regex: /^[A-Za-z]{1,50}$/,
    message: "Last name must be 1-50 letters only",
  },
  mobile: {
    regex: /^[0-9]{10}$/,
    message: "Mobile must be exactly 10 digits",
  },
  dob: {
    regex: /^\d{4}-\d{2}-\d{2}$/,
    message: "Please select a valid date of birth",
    isValid: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      return date <= today && date >= minAge;
    },
  },
  address: {
    regex: /^.{1,200}$/,
    message: "Address must be 1-200 characters",
  },
  skills: {
    regex: /^[\w\s,]{0,500}$/,
    message: "Skills must be comma-separated words (max 500 characters)",
  },
  resume: {
    maxSize: 5 * 1024 * 1024, // 5MB
    message: "Resume must be a PDF file under 5MB",
    isValid: (file: File | null) => {
      console.log(file);

      if (!file || file.toString().trim().length != 0) return true; // Allow empty file (not required)
      return file.type === "application/pdf" && file.size <= validationRules.resume.maxSize;
    },
  },
};

export default function StudentProfileForm() {
  const [form, setForm] = useState({
    college_id: "",
    f_name: "",
    m_name: "",
    l_name: "",
    mobile: "",
    dob: "",
    address: "",
    dept_id: "",
    skills: "",
    resume: null as File | null,
    departmentName: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile data
    axios
      .get(API_ROUTES.STUDENT_PROFILE, { withCredentials: true })
      .then((res) => {
        const data = res.data.data;
        setForm((f) => ({
          ...f,
          college_id: data.college_id || "",
          f_name: data.f_name || "",
          m_name: data.m_name || "",
          l_name: data.l_name || "",
          mobile: data.mobile || "",
          dob: data.dob ? data.dob.substring(0, 10) : "",
          address: data.address || "",
          dept_id: data.dept_id || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "",
          resume: data.resume || "",
          departmentName: data.dept_id?.dept_name || "",
        }));
      })
      .catch(() => {
        // Silently handle fetch error to avoid breaking the form
      });
  }, []);

  const validateField = (name: keyof typeof form, value: string | File | null) => {
    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return "";

    if (name === "resume") {
      return rule.isValid && rule.isValid(value as File | null) ? "" : rule.message;
    }

    if (name === "dob" && value) {
      return rule.regex.test(value as string) && rule.isValid && rule.isValid(value as string)
        ? ""
        : rule.message;
    }

    if (value === "" && !["m_name", "skills", "resume"].includes(name)) {
      return `${name.replace("_", " ")} is required`;
    }

    return rule.regex.test(value as string) ? "" : rule.message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files?.[0] || null : value;

    setForm((f) => ({ ...f, [name]: newValue }));
    setErrors((e) => ({ ...e, [name]: validateField(name as keyof typeof form, newValue) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof typeof form, string>> = {};
    let hasErrors = false;

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "dept_id" && key !== "departmentName") {
        const error = validateField(key as keyof typeof form, value);
        newErrors[key as keyof typeof form] = error;
        if (error) hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      alert("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "resume" && value) {
          formData.append("resume", value as File);
        } else if (key === "skills") {
          formData.append("skills", value || "");
        } else if (key !== "dept_id" && key !== "departmentName") {
          formData.append(key, value || "");
        }
      });

      await axios.put(API_ROUTES.STUDENT_PROFILE, formData, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Student Profile</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="college_id" className="pb-4">
              College ID
            </Label>
            <Input
              id="college_id"
              name="college_id"
              value={form.college_id}
              onChange={handleChange}
              className={errors.college_id ? "border-red-500" : ""}
            />
            {errors.college_id && (
              <p className="text-red-500 text-sm mt-1">{errors.college_id}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="f_name" className="pb-4">
                First Name
              </Label>
              <Input
                id="f_name"
                name="f_name"
                value={form.f_name}
                onChange={handleChange}
                required
                className={errors.f_name ? "border-red-500" : ""}
              />
              {errors.f_name && (
                <p className="text-red-500 text-sm mt-1">{errors.f_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="m_name" className="pb-4">
                Middle Name
              </Label>
              <Input
                id="m_name"
                name="m_name"
                value={form.m_name}
                onChange={handleChange}
                className={errors.m_name ? "border-red-500" : ""}
              />
              {errors.m_name && (
                <p className="text-red-500 text-sm mt-1">{errors.m_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="l_name" className="pb-4">
                Last Name
              </Label>
              <Input
                id="l_name"
                name="l_name"
                value={form.l_name}
                onChange={handleChange}
                required
                className={errors.l_name ? "border-red-500" : ""}
              />
              {errors.l_name && (
                <p className="text-red-500 text-sm mt-1">{errors.l_name}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="mobile" className="pb-4">
              Mobile
            </Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              required
              className={errors.mobile ? "border-red-500" : ""}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dob" className="pb-4">
              Date of Birth
            </Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              className={errors.dob ? "border-red-500" : ""}
            />
            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
          </div>
          <div>
            <Label htmlFor="address" className="pb-4">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dept_id" className="pb-4">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              value={form.departmentName}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="skills" className="pb-4">
              Skills (comma separated)
            </Label>
            <Input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, Python"
              className={errors.skills ? "border-red-500" : ""}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
            )}
          </div>
          <div>
            <Label htmlFor="resume" className="pb-4">
              Resume (PDF)
            </Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className={errors.resume ? "border-red-500" : ""}
            />
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
            )}
            {typeof form.resume === "string" && form.resume && (
              <a
                href={`http://localhost:3000/${form.resume.replace(/^uploads\//, "uploads/")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
              >
                View Uploaded Resume
              </a>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button type="submit" disabled={loading || Object.keys(errors).some((key) => errors[key as keyof typeof errors])}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}