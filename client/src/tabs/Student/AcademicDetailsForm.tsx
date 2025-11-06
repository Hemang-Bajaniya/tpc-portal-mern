import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { API_BASE_URL_DOC, API_ROUTES } from "@/lib/apiRoutes";
import { FileBadge } from "lucide-react";
import { toast } from "sonner";

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

type FormErrors = {
  ssc_percentage?: string;
  hsc_percentage?: string;
  diploma_cgpa?: string;
  be_cgpa?: string;
  liveKT?: string;
  deadKT?: string;
  semesters?: { [index: number]: { sgpa?: string } };
  results?: string;
};

export interface AcademicDetailsFormData {
  qualificationType: string;
  ssc_percentage: string;
  hsc_percentage: string;
  diploma_cgpa: string;
  be_cgpa: string;
  liveKT: string;
  deadKT: string;
  semesters: {
    sem: number;
    sgpa: string;
  }[];
  results: File | null;
}

export default function AcademicDetailsForm() {
  const [form, setForm] = useState<AcademicDetailsFormData>({
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
    results: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [resultsUrl, setResultsUrl] = useState<string | null>(null);

  // Fetch existing academic details
  useEffect(() => {
    const fetchAcademicDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_ROUTES.STUDENT_ACAD_PROFILE, {
          withCredentials: true,
        });
        const data = res.data.data;
        if (data) {
          // If your API returns academic details inside a nested object, adjust accordingly.
          setForm((old) => ({
            qualificationType: data.qualificationType || old.qualificationType,
            ssc_percentage:
              data.ssc_percentage != null ? data.ssc_percentage.toString() : "",
            hsc_percentage:
              data.hsc_percentage != null ? data.hsc_percentage.toString() : "",
            diploma_cgpa:
              data.diploma_cgpa != null ? data.diploma_cgpa.toString() : "",
            be_cgpa: data.be_cgpa != null ? data.be_cgpa.toString() : "",
            liveKT: data.liveKT != null ? data.liveKT.toString() : "",
            deadKT: data.deadKT != null ? data.deadKT.toString() : "",
            semesters:
              data.semesters && Array.isArray(data.semesters)
                ? data.semesters.map((sem: any, idx: number) => ({
                    sem: sem.sem,
                    sgpa: sem.sgpa != null ? sem.sgpa.toString() : "",
                  }))
                : old.semesters,
            results: data.results != null ? data.results.toString() : "",
          }));
          if (data.results!="")
            setResultsUrl(`${API_BASE_URL_DOC}/${data.results}`);
          if(data.approved === "pending")
            toast.error("Your academic details update is pending approval from TPC.");
          else if(data.approved === "rejected")
            toast.error("Your academic details update was rejected by TPC. Please review and resubmit.");
          else if(data.approved === "approved")
            toast.success("Your academic details update was approved by TPC.");
        }
      } catch (err) {
        console.error("Error fetching academic details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicDetails();
  }, []);

  // Validate a single field or semesters
  const validateField = (
    name: string,
    value: string | null,
    semIndex?: number
  ) => {
    if (name === "semesters") {
      // semIndex indicates which semester; if provided we validate only that one
      const semErrors: { [key: number]: { sgpa?: string } } = {};
      form.semesters.forEach((sem, i) => {
        const sgpaVal = sem.sgpa;
        const { regex, min, max, message } = validationRules.sgpa;
        if (
          !regex.test(sgpaVal) ||
          Number(sgpaVal) < min ||
          Number(sgpaVal) > max
        ) {
          semErrors[i] = { sgpa: message };
        }
      });
      return semErrors;
    }

    const rule = (validationRules as any)[name];
    if (!rule) {
      return "";
    }

    if (rule.required && (value === null || value === "")) {
      return `${name.replace(/_/g, " ")} is required`;
    }
    if (value !== null && value !== "") {
      const num = Number(value);
      if (
        !rule.regex.test(value) ||
        (rule.min != null && num < rule.min) ||
        (rule.max != null && num > rule.max)
      ) {
        return rule.message;
      }
    }
    return "";
  };

  // Handle regular input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    const errMsg = validateField(name, value);
    setErrors((e) => ({ ...e, [name]: errMsg }));
  };

  // Handle results upload with validation for type and size
  const handleResultUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, results: "Please upload a PDF file." }));
      return;
    }

    // Check file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        results: "File size cannot exceed 5MB.",
      }));
      return;
    }

    // If valid, update state and clear any existing results error
    setForm((prev) => ({ ...prev, results: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.results;
      return newErrors;
    });
  };

  // Handle semester SGPA change
  const handleSemChange = (index: number, value: string) => {
    const updatedSemesters = [...form.semesters];
    updatedSemesters[index].sgpa = value;
    setForm((f) => ({ ...f, semesters: updatedSemesters }));

    const semErrors = validateField("semesters", null) as {
      [key: number]: { sgpa?: string };
    };
    setErrors((e) => ({ ...e, semesters: semErrors }));
  };

  // Handle switching between HSC / Diploma
  const handleQualificationChange = (value: string) => {
    setForm((f) => ({
      ...f,
      qualificationType: value,
      // reset the field that is not relevant
      hsc_percentage: value === "HSC" ? f.hsc_percentage : "",
      diploma_cgpa: value === "Diploma" ? f.diploma_cgpa : "",
    }));
    setErrors({});
  };

  const handleResultsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, results: "Please upload a PDF file." }));
      return;
    }

    // Check file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        results: "File size cannot exceed 5MB.",
      }));
      return;
    }

    // If valid, update state and clear any existing results error
    setForm((prev) => ({ ...prev, results: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.results;
      return newErrors;
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: FormErrors = {};
    let hasErrors = false;

    // Validate core fields
    const toValidate = [
      "ssc_percentage",
      "be_cgpa",
      "liveKT",
      "deadKT",
    ] as const;

    for (let field of toValidate) {
      const errMsg = validateField(field, (form as any)[field]);
      if (errMsg) {
        (newErrors as any)[field] = errMsg;
        hasErrors = true;
      }
    }

    // Depending on qualificationType, validate the relevant field
    if (form.qualificationType === "HSC") {
      const errMsg = validateField("hsc_percentage", form.hsc_percentage);
      if (errMsg) {
        newErrors.hsc_percentage = errMsg;
        hasErrors = true;
      }
    } else if (form.qualificationType === "Diploma") {
      const errMsg = validateField("diploma_cgpa", form.diploma_cgpa);
      if (errMsg) {
        newErrors.diploma_cgpa = errMsg;
        hasErrors = true;
      }
    }

    // Validate semesters
    const semErrors = validateField("semesters", null) as {
      [key: number]: { sgpa?: string };
    };

    if (Object.keys(semErrors).length > 0) {
      newErrors.semesters = semErrors;
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      alert("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("qualificationType", form.qualificationType);
      formData.append("ssc_percentage", form.ssc_percentage || "0");
      formData.append(
        "hsc_percentage",
        form.qualificationType === "HSC" ? form.hsc_percentage || "0" : "0"
      );
      formData.append(
        "diploma_cgpa",
        form.qualificationType === "Diploma" ? form.diploma_cgpa || "0" : "0"
      );
      formData.append("be_cgpa", form.be_cgpa || "0");
      formData.append("liveKT", form.liveKT || "0");
      formData.append("deadKT", form.deadKT || "0");

      formData.append(
        "semesters",
        JSON.stringify(
          form.semesters.map((sem) => ({
            sem: sem.sem,
            sgpa: sem.sgpa ? Number(sem.sgpa) : 0,
          }))
        )
      );

      if (form.results) {
        formData.append("results", form.results);
      }
      console.log(form.results);

      console.log(API_ROUTES.UPDATE_STUDENT_ACADMIC_DETAILS);

      const res = await axios.put(
        API_ROUTES.UPDATE_STUDENT_ACADMIC_DETAILS,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("Academic changes submitted for TPC approval!");
        const { data } = res.data;

        if (data.results) {
          setResultsUrl(`${API_BASE_URL_DOC}/${data.results}`);
          setForm((prev) => ({ ...prev, results: null }));
        }
      } else {
        alert(`Profile update failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error("Error saving academic details:", err);
      alert("Failed to submit academic changes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading Acadmic data...
      </div>
    );
  }

  // ... All imports and logic remain unchanged

  return (
    <Card className="max-w-3xl mx-auto mt-6 p-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Academic Details</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          {/* SSC */}
          <div className="w-full">
            <Label htmlFor="ssc_percentage" className="pb-2">
              SSC Percentage
            </Label>
            <Input
              id="ssc_percentage"
              name="ssc_percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.ssc_percentage}
              onChange={handleChange}
              className={`w-full ${
                errors.ssc_percentage ? "border-red-500" : ""
              }`}
              required
            />
            {errors.ssc_percentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ssc_percentage}
              </p>
            )}
          </div>

          {/* HSC / Diploma Tabs */}
          <div>
            <Label className="pb-2">Qualification</Label>
            <Tabs
              value={form.qualificationType}
              onValueChange={handleQualificationChange}
            >
              <TabsList className="grid grid-cols-2 w-1/2 my-2">
                <TabsTrigger value="HSC">HSC</TabsTrigger>
                <TabsTrigger value="Diploma">Diploma</TabsTrigger>
              </TabsList>

              <TabsContent value="HSC">
                <div>
                  <Label htmlFor="hsc_percentage" className="pb-2">
                    HSC Percentage
                  </Label>
                  <Input
                    id="hsc_percentage"
                    name="hsc_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={form.hsc_percentage}
                    onChange={handleChange}
                    className={`${
                      errors.hsc_percentage ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.hsc_percentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hsc_percentage}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="Diploma">
                <div>
                  <Label htmlFor="diploma_cgpa" className="pb-2">
                    Diploma CGPA
                  </Label>
                  <Input
                    id="diploma_cgpa"
                    name="diploma_cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={form.diploma_cgpa}
                    onChange={handleChange}
                    className={`${errors.diploma_cgpa ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.diploma_cgpa && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.diploma_cgpa}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* B.E. CGPA */}
          <div>
            <Label htmlFor="be_cgpa" className="pb-2">
              B.E. CGPA
            </Label>
            <Input
              id="be_cgpa"
              name="be_cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.be_cgpa}
              onChange={handleChange}
              className={`${errors.be_cgpa ? "border-red-500" : ""}`}
            />
            {errors.be_cgpa && (
              <p className="text-red-500 text-sm mt-1">{errors.be_cgpa}</p>
            )}
          </div>

          {/* KTs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="liveKT" className="pb-2">
                Live KTs
              </Label>
              <Input
                id="liveKT"
                name="liveKT"
                type="number"
                min="0"
                value={form.liveKT}
                onChange={handleChange}
                className={`${errors.liveKT ? "border-red-500" : ""}`}
              />
              {errors.liveKT && (
                <p className="text-red-500 text-sm mt-1">{errors.liveKT}</p>
              )}
            </div>
            <div>
              <Label htmlFor="deadKT" className="pb-2">
                Dead KTs
              </Label>
              <Input
                id="deadKT"
                name="deadKT"
                type="number"
                min="0"
                value={form.deadKT}
                onChange={handleChange}
                className={`${errors.deadKT ? "border-red-500" : ""}`}
              />
              {errors.deadKT && (
                <p className="text-red-500 text-sm mt-1">{errors.deadKT}</p>
              )}
            </div>
          </div>

          {/* Semester-wise SGPA */}
          <div>
            <h3 className="font-semibold text-lg">Semester-wise SGPA</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {form.semesters.map((sem, index) => (
                <div key={sem.sem}>
                  <Label className="pb-2">Sem {sem.sem}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={sem.sgpa}
                    onChange={(e) => handleSemChange(index, e.target.value)}
                    className={`w-full ${
                      errors.semesters?.[index]?.sgpa ? "border-red-500" : ""
                    }`}
                  />
                  {errors.semesters?.[index]?.sgpa && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.semesters[index].sgpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Results PDF Upload */}
          <div>
            <Label className="pb-2">Results (PDF)</Label>
            <Input
              type="file"
              name="results"
              accept="application/pdf"
              onChange={handleResultUpload}
              className={`border w-full rounded-md h-10 px-3 text-gray-900 ${
                errors.results ? "border-red-500" : "border-gray-300"
              }`}
              required={!resultsUrl==null}
            />
            {form.results && (
              <p className="text-gray-600 text-sm mt-1">
                Selected file: {form.results.name}
              </p>
            )}

            {resultsUrl && (
              <div className="mt-1">
                <a
                  href={resultsUrl}
                  className="text-purple-600 underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View uploaded results
                </a>
              </div>
            )}
            {errors.results && (
              <p className="text-red-500 text-xs mt-1">{errors.results}</p>
            )}
            {!resultsUrl && !form.results && (
              <p className="text-gray-500 text-sm mt-1">No results uploaded</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={
              loading ||
              Object.values(errors).some(
                (err) => typeof err === "string" && err.length > 0
              )
            }
          >
            {loading ? "Saving..." : "Save Academic Details"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
