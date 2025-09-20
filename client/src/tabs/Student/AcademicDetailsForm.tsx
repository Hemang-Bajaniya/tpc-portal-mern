import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { API_ROUTES } from "@/lib/apiRoutes";

// Validation rules based on schema
const validationRules = {
  ssc_percentage: {
    required: true,
    regex: /^(\d{1,2}(\.\d{1,2})?)?$/,
    min: 0,
    max: 100,
    message: "SSC Percentage must be between 0 and 100",
  },
  hsc_percentage: {
    required: true,
    regex: /^(\d{1,2}(\.\d{1,2})?)?$/,
    min: 0,
    max: 100,
    message: "HSC Percentage must be between 0 and 100",
  },
  diploma_cgpa: {
    required: true,
    regex: /^(\d(\.\d{1,2})?)?$/,
    min: 0,
    max: 10,
    message: "Diploma CGPA must be between 0 and 10",
  },
  be_cgpa: {
    required: false,
    regex: /^(\d(\.\d{1,2})?)?$/,
    min: 0,
    max: 10,
    message: "B.E. CGPA must be between 0 and 10",
  },
  liveKT: {
    required: false,
    regex: /^\d*$/,
    min: 0,
    message: "Live KTs must be a non-negative integer",
  },
  deadKT: {
    required: false,
    regex: /^\d*$/,
    min: 0,
    message: "Dead KTs must be a non-negative integer",
  },
  sgpa: {
    regex: /^(\d(\.\d{1,2})?)?$/,
    min: 0,
    max: 10,
    message: "SGPA must be between 0 and 10",
  },
};

export default function AcademicDetailsForm() {
  const [form, setForm] = useState({
    qualificationType: "HSC",
    ssc_percentage: "",
    hsc_percentage: "",
    diploma_cgpa: "",
    be_cgpa: "",
    liveKT: "",
    deadKT: "",
    semesters: Array.from({ length: 8 }, (_, i) => ({
      sem: i + 1,
      sgpa: "",
    })),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string | { [key: number]: { sgpa?: string } }>>>({});
  const [loading, setLoading] = useState(false);

  // Fetch existing academic details
  useEffect(() => {
    const fetchAcademicDetails = async () => {
      try {
        const res = await axios.get(API_ROUTES.STUDENT_ACAD_PROFILE, { withCredentials: true });
        const data = res.data.data;
        if (data) {
          setForm({
            qualificationType: data.qualificationType || "HSC",
            ssc_percentage: data.ssc_percentage?.toString() || "",
            hsc_percentage: data.hsc_percentage?.toString() || "",
            diploma_cgpa: data.diploma_cgpa?.toString() || "",
            be_cgpa: data.be_cgpa?.toString() || "",
            liveKT: data.liveKT?.toString() || "",
            deadKT: data.deadKT?.toString() || "",
            semesters: data.semesters?.map((sem: any) => ({
              sem: sem.sem,
              sgpa: sem.sgpa?.toString() || "",
            })) || form.semesters,
          });
        }
      } catch (err) {
        console.error("Error fetching academic details:", err);
      }
    };
    fetchAcademicDetails();
  }, []);

  // Validate individual field
  const validateField = (name: string, value: string | File | null, index?: number) => {
    if (name === "semesters") {
      const semErrors: { [key: number]: { sgpa?: string } } = {};
      form.semesters.forEach((sem, i) => {
        const sgpaError = validationRules.sgpa.regex.test(sem.sgpa) &&
          (!sem.sgpa || (Number(sem.sgpa) >= validationRules.sgpa.min && Number(sem.sgpa) <= validationRules.sgpa.max))
          ? ""
          : validationRules.sgpa.message;
        if (sgpaError) {
          semErrors[i] = { sgpa: sgpaError };
        }
      });
      return semErrors;
    }

    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return "";

    if (rule.required && !value) return `${name.replace("_", " ")} is required`;
    if (value && (!rule.regex.test(value as string) || Number(value) < rule.min || Number(value) > rule.max)) {
      return rule.message;
    }
    return "";
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, [name]: files?.[0] || null }));
      setErrors((e) => ({ ...e, [name]: validateField(name, files?.[0] || null) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
    }
  };

  // Handle semester SGPA changes
  const handleSemChange = (index: number, value: string) => {
    const updatedSemesters = [...form.semesters];
    updatedSemesters[index].sgpa = value;
    setForm((f) => ({ ...f, semesters: updatedSemesters }));
    setErrors((e) => ({ ...e, semesters: validateField("semesters", null) }));
  };

  // Handle qualification type change
  const handleQualificationChange = (value: string) => {
    setForm((f) => ({
      ...f,
      qualificationType: value,
      hsc_percentage: value === "HSC" ? f.hsc_percentage : "",
      diploma_cgpa: value === "Diploma" ? f.diploma_cgpa : "",
    }));
    setErrors((e) => ({
      ...e,
      hsc_percentage: value === "HSC" ? validateField("hsc_percentage", form.hsc_percentage) : "",
      diploma_cgpa: value === "Diploma" ? validateField("diploma_cgpa", form.diploma_cgpa) : "",
    }));
  };

  // In AcademicDetailsForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields (as in your code)...

    if (hasErrors) {
      alert("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("qualificationType", form.qualificationType);
      formData.append("ssc_percentage", form.ssc_percentage || "0");
      formData.append("hsc_percentage", form.qualificationType === "HSC" ? form.hsc_percentage || "0" : "0");
      formData.append("diploma_cgpa", form.qualificationType === "Diploma" ? form.diploma_cgpa || "0" : "0");
      formData.append("be_cgpa", form.be_cgpa || "0");
      formData.append("liveKT", form.liveKT || "0");
      formData.append("deadKT", form.deadKT || "0");
      formData.append("semesters", JSON.stringify(form.semesters.map((sem) => ({
        sem: sem.sem,
        sgpa: sem.sgpa ? Number(sem.sgpa) : 0,
      }))));

      const res = await axios.post(API_ROUTES.STUDENT_ACAD_PROFILE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Academic changes submitted for TPC approval!");
      console.log("✅ Saved:", res.data);
    } catch (err) {
      console.error("❌ Error saving academic details:", err);
      alert("Failed to submit academic changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Academic Details</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {/* SSC */}
          <div>
            <Label htmlFor="ssc_percentage" className="pb-4">SSC Percentage</Label>
            <Input
              id="ssc_percentage"
              name="ssc_percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.ssc_percentage}
              onChange={handleChange}
              className={errors.ssc_percentage ? "border-red-500" : ""}
              required
            />
            {errors.ssc_percentage && <p className="text-red-500 text-sm mt-1">{errors.ssc_percentage}</p>}
          </div>

          {/* HSC / Diploma Tabs */}
          <Tabs value={form.qualificationType} onValueChange={handleQualificationChange}>
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="HSC">HSC</TabsTrigger>
              <TabsTrigger value="Diploma">Diploma</TabsTrigger>
            </TabsList>
            <TabsContent value="HSC">
              <div>
                <Label htmlFor="hsc_percentage" className="pb-4">HSC Percentage</Label>
                <Input
                  id="hsc_percentage"
                  name="hsc_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.hsc_percentage}
                  onChange={handleChange}
                  className={errors.hsc_percentage ? "border-red-500" : ""}
                  required
                />
                {errors.hsc_percentage && <p className="text-red-500 text-sm mt-1">{errors.hsc_percentage}</p>}
              </div>
            </TabsContent>
            <TabsContent value="Diploma">
              <div>
                <Label htmlFor="diploma_cgpa" className="pb-4">Diploma CGPA</Label>
                <Input
                  id="diploma_cgpa"
                  name="diploma_cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={form.diploma_cgpa}
                  onChange={handleChange}
                  className={errors.diploma_cgpa ? "border-red-500" : ""}
                  required
                />
                {errors.diploma_cgpa && <p className="text-red-500 text-sm mt-1">{errors.diploma_cgpa}</p>}
              </div>
            </TabsContent>
          </Tabs>

          {/* B.E. CGPA */}
          <div>
            <Label htmlFor="be_cgpa" className="pb-4">B.E. CGPA</Label>
            <Input
              id="be_cgpa"
              name="be_cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.be_cgpa}
              onChange={handleChange}
              className={errors.be_cgpa ? "border-red-500" : ""}
            />
            {errors.be_cgpa && <p className="text-red-500 text-sm mt-1">{errors.be_cgpa}</p>}
          </div>

          {/* Backlogs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="liveKT" className="pb-4">Live KTs</Label>
              <Input
                id="liveKT"
                name="liveKT"
                type="number"
                min="0"
                value={form.liveKT}
                onChange={handleChange}
                className={errors.liveKT ? "border-red-500" : ""}
              />
              {errors.liveKT && <p className="text-red-500 text-sm mt-1">{errors.liveKT}</p>}
            </div>
            <div>
              <Label htmlFor="deadKT" className="pb-4">Dead KTs</Label>
              <Input
                id="deadKT"
                name="deadKT"
                type="number"
                min="0"
                value={form.deadKT}
                onChange={handleChange}
                className={errors.deadKT ? "border-red-500" : ""}
              />
              {errors.deadKT && <p className="text-red-500 text-sm mt-1">{errors.deadKT}</p>}
            </div>
          </div>

          {/* Semester-wise SGPA */}
          <div>
            <h3 className="font-semibold mt-4">Semester-wise SGPA</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {form.semesters.map((sem, index) => (
                <div key={sem.sem} className="space-y-2">
                  <Label className="pb-4">Sem {sem.sem} SGPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={sem.sgpa}
                    onChange={(e) => handleSemChange(index, e.target.value)}
                    className={errors.semesters && errors.semesters[index]?.sgpa ? "border-red-500" : ""}
                  />
                  {errors.semesters && errors.semesters[index]?.sgpa && (
                    <p className="text-red-500 text-sm mt-1">{errors.semesters[index].sgpa}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button
            type="submit"
            disabled={loading || Object.values(errors).some((error) => (typeof error === "string" ? error : Object.values(error).some((e) => e)))}
          >
            {loading ? "Saving..." : "Save Academic Details"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}