import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useParams, useSearchParams } from "react-router-dom";
import { API_BASE_URL_DOC, API_ROUTES } from "@/lib/apiRoutes";
import axios from "axios";
import { toast } from "sonner";

// --- TypeScript Interfaces ---
interface FormErrors {
  [key: string]: string | { [key: number]: { sgpa?: string } };
}

// Combined interface for all student data
interface CombinedFormData {
  // Personal Details
  college_id: string;
  f_name: string;
  m_name: string;
  l_name: string;
  mobile: string;
  dob: string;
  address: string;
  skills: string[];
  resume: File | null;
  created_at: string;

  // Academic Details (using strings for form inputs)
  qualificationType: "HSC" | "Diploma";
  ssc_percentage: string;
  hsc_percentage: string;
  diploma_cgpa: string;
  be_cgpa: string;
  be_percentage: string;
  liveKT: string;
  deadKT: string;
  semesters: { sem: number; sgpa: string; percentage: string }[];
  results: File | null; // Renamed from resultFile to be consistent
  approved: "approved" | "rejected" | "pending" | null;
}

// --- Validation Rules (from AcademicDetailsForm) ---
const validationRules = {
  f_name: { required: true, message: "First name is required." },
  l_name: { required: true, message: "Last name is required." },
  address: { required: true, message: "Address is required." },
  mobile: {
    required: true,
    regex: /^\d{10}$/,
    message: "Mobile number must be 10 digits.",
  },
  dob: { required: true, message: "Date of birth is required." },
  skills: { required: true, message: "At least one skill must be added." },
  resume: { required: true, message: "Resume is required." },
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

// --- Main Component ---
const StudentProfileManage = ({ allowUpdate }: { allowUpdate: boolean }) => {
  const [searchParams] = useSearchParams();
  const {userId, studentId} = useParams() // For identifying the student

  // --- State Management ---
  const [formData, setFormData] = useState<CombinedFormData>({
    // Personal
    college_id: "",
    f_name: "",
    m_name: "",
    l_name: "",
    mobile: "",
    dob: "",
    address: "",
    skills: [],
    resume: null,
    created_at: "",
    // Academic
    qualificationType: "HSC",
    ssc_percentage: "",
    hsc_percentage: "",
    diploma_cgpa: "",
    be_cgpa: "",
    be_percentage: "",
    liveKT: "",
    deadKT: "",
    semesters: Array.from({ length: 8 }, (_, i) => ({
      sem: i + 1,
      sgpa: "",
      percentage: "",
    })),
    results: null,
    approved: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resultsUrl, setResultsUrl] = useState<string | null>(null);
  const [approved, setApproved] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllProfileData = async () => {
      setLoading(true);
      try {
        const [personalRes, academicRes] = await Promise.all([
          axios.get(API_ROUTES.STUDENT_PROFILE+`/${userId}` ,{ withCredentials: true }),
          axios.get(API_ROUTES.STUDENT_ACAD_PROFILE+`/${userId}`, {
            withCredentials: true,
          }),
        ]);

        const personalData = personalRes.data?.data || {};
        const academicData = academicRes.data?.data || {};

        // Format dates and URLs
        if (personalData.dob) {
          personalData.dob = new Date(personalData.dob)
            .toISOString()
            .split("T")[0];
        }
        if (personalData.resume) {
          setResumeUrl(`${API_BASE_URL_DOC}/${personalData.resume}`);
        }
        if (academicData.results) {
          setResultsUrl(`${API_BASE_URL_DOC}/${academicData.results}`);
        }
        if (academicData.approved) {
          setApproved(academicData.approved);
        }

        // Merge data into a single state object
        setFormData((prev) => ({
          ...prev,
          ...personalData,
          ...academicData,
          // Convert numbers to strings for form inputs
          ssc_percentage: academicData.ssc_percentage?.toString() || "",
          hsc_percentage: academicData.hsc_percentage?.toString() || "",
          diploma_cgpa: academicData.diploma_cgpa?.toString() || "",
          be_cgpa: academicData.be_cgpa?.toString() || "",
          liveKT: academicData.liveKT?.toString() || "",
          deadKT: academicData.deadKT?.toString() || "",
          semesters:
            academicData.semesters?.map((sem: any) => ({
              ...sem,
              sgpa: sem.sgpa?.toString() || "",
              percentage: sem.percentage?.toString() || "", // Assuming percentage comes from API
            })) || prev.semesters,
          resume: null, // Always reset file inputs
          results: null,
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProfileData();
  }, []);

  // --- Event Handlers ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "resume" | "results"
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        [fileType]: "Please upload a PDF file.",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fileType]: "File size cannot exceed 5MB.",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [fileType]: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fileType];
      return newErrors;
    });
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSemesterChange = (
    index: number,
    field: "sgpa" | "percentage",
    value: string
  ) => {
    const updatedSemesters = [...formData.semesters];
    updatedSemesters[index] = { ...updatedSemesters[index], [field]: value };
    setFormData((prev) => ({ ...prev, semesters: updatedSemesters }));
  };

  // --- Form Submission ---
  const handleSaveChanges = async () => {
    // Note: A full validation implementation would be extensive here.
    // This is a simplified version. A production app might use a library like Zod or Yup.
    console.log("Saving data...", formData);

    try {
      setLoading(true);

      // --- Personal Details Payload ---
      const personalPayload = new FormData();
      personalPayload.append("f_name", formData.f_name);
      personalPayload.append("m_name", formData.m_name);
      personalPayload.append("l_name", formData.l_name);
      personalPayload.append("mobile", formData.mobile);
      personalPayload.append("dob", formData.dob);
      personalPayload.append("address", formData.address);
      personalPayload.append("skills", formData.skills.join(","));
      if (formData.resume) {
        personalPayload.append("resume", formData.resume);
      }

      // --- Academic Details Payload ---
      const academicPayload = new FormData();
      academicPayload.append("qualificationType", formData.qualificationType);
      academicPayload.append("ssc_percentage", formData.ssc_percentage || "0");
      academicPayload.append(
        "hsc_percentage",
        formData.qualificationType === "HSC"
          ? formData.hsc_percentage || "0"
          : "0"
      );
      academicPayload.append(
        "diploma_cgpa",
        formData.qualificationType === "Diploma"
          ? formData.diploma_cgpa || "0"
          : "0"
      );
      academicPayload.append("be_cgpa", formData.be_cgpa || "0");
      academicPayload.append("liveKT", formData.liveKT || "0");
      academicPayload.append("deadKT", formData.deadKT || "0");
      academicPayload.append(
        "semesters",
        JSON.stringify(
          formData.semesters.map((sem) => ({
            sem: sem.sem,
            sgpa: sem.sgpa ? Number(sem.sgpa) : 0,
            percentage: sem.percentage ? Number(sem.percentage) : 0,
          }))
        )
      );
      if (formData.results) {
        academicPayload.append("results", formData.results);
      }

      // --- API Calls ---
      const [personalUpdateRes, academicUpdateRes] = await Promise.all([
        axios.put(API_ROUTES.STUDENT_PROFILE+`/${userId}`, personalPayload, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }),
        axios.put(
          API_ROUTES.UPDATE_STUDENT_ACADMIC_DETAILS+`/${userId}`,
          academicPayload,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        ),
      ]);

      if (
        personalUpdateRes.data.success &&
        academicUpdateRes.data.success
      ) {
        toast.success("Profile and academic details updated successfully!");
        // Update URLs if new files were uploaded
        if (personalUpdateRes.data.data?.resume) {
          setResumeUrl(
            `${API_BASE_URL_DOC}/${personalUpdateRes.data.data.resume}`
          );
        }
        if (academicUpdateRes.data.data?.results) {
          setResultsUrl(
            `${API_BASE_URL_DOC}/${academicUpdateRes.data.data.results}`
          );
        }
      } else {
        toast.error("One or more updates failed. Please check the data.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Approval Action Handler ---
  const handleApprovalAction = async (
    status: "approved" | "rejected" | "pending"
  ) => {
    // Assuming you have the student's ID for the API call
    const currentStudentId = studentId || formData.college_id;
    if (!currentStudentId) {
      toast.error("Student ID is missing. Cannot perform action.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        API_ROUTES.UPDATE_ACADMIC_APPROVAL, 
        { studentId: currentStudentId, approved: status },
        { withCredentials: true }
      );

      console.log(status)

      if (response.data.success) {
        setApproved(status);
        toast.success(`Student profile status set to ${status}.`);
      } else {
        toast.error(`Failed to update status: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("An error occurred while updating the status.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = availableSkills.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !formData.skills.includes(s)
  );
  
  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">Loading Profile Details...</div>
    );
  }

  return (
    <Card className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 flex items-center space-x-4">
          <img
            src="https://placehold.co/64x64/7c3aed/ffffff?text=S"
            alt="Student Avatar"
            className="w-16 h-16 rounded-full border-2 border-black-500"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {formData.f_name} {formData.l_name}
            </h1>
            <p className="text-gray-500">Student Profile & Academic Record</p>
          </div>
        </header>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* --- Personal Details Section (UI unchanged) --- */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College ID
                  </label>
                  <input
                    type="text"
                    name="college_id"
                    value={formData.college_id}
                    onChange={handleChange}
                    disabled // College ID is usually not updatable
                    className="border w-full rounded-md h-10 px-3 bg-gray-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border w-full rounded-md h-10 px-3 text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="m_name"
                    value={formData.m_name}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border w-full rounded-md h-10 px-3 text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="l_name"
                    value={formData.l_name}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border w-full rounded-md h-10 px-3 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md px-3 py-2 text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      {allowUpdate && (
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {allowUpdate && (
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      className="border w-full rounded-md h-10 px-3"
                    />
                    {skillInput && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                        {filteredSkills.map((s) => (
                          <div
                            key={s}
                            onClick={() => addSkill(s)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF)
                </label>
                {allowUpdate && (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "resume")}
                    className="border w-full rounded-md h-10 px-3"
                  />
                )}
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline mt-2 inline-block"
                  >
                    View Uploaded Resume
                  </a>
                )}
                {!resumeUrl && !allowUpdate && (
                  <p className="text-gray-500">No resume uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* --- Academic Details Section (UI unchanged) --- */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Academic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification Type
                </label>
                <select
                  name="qualificationType"
                  value={formData.qualificationType}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 bg-white text-gray-900"
                >
                  <option value="HSC">HSC</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSC Percentage
                </label>
                <input
                  type="number"
                  name="ssc_percentage"
                  value={formData.ssc_percentage}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              {formData.qualificationType === "HSC" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Percentage
                  </label>
                  <input
                    type="number"
                    name="hsc_percentage"
                    value={formData.hsc_percentage ?? ""}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border w-full rounded-md h-10 px-3 text-gray-900"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diploma CGPA
                  </label>
                  <input
                    type="number"
                    name="diploma_cgpa"
                    value={formData.diploma_cgpa ?? ""}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border w-full rounded-md h-10 px-3 text-gray-900"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BE Percentage
                </label>
                <input
                  type="number"
                  name="be_percentage"
                  value={formData.be_percentage}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BE CGPA
                </label>
                <input
                  type="number"
                  name="be_cgpa"
                  value={formData.be_cgpa}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live KTs
                </label>
                <input
                  type="number"
                  name="liveKT"
                  value={formData.liveKT}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dead KTs
                </label>
                <input
                  type="number"
                  name="deadKT"
                  value={formData.deadKT}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className="border w-full rounded-md h-10 px-3 text-gray-900"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Results (PDF)
                </label>
                {allowUpdate && (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "results")}
                    className="border w-full rounded-md h-10 px-3 text-gray-900 bg-white"
                  />
                )}
                {resultsUrl && (
                  <a
                    href={resultsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline mt-2 inline-block"
                  >
                    View Uploaded Results
                  </a>
                )}
                {!resultsUrl && !allowUpdate && (
                  <p className="text-gray-500">No results uploaded</p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Semester-wise Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Semester
                    </th>
                    <th scope="col" className="px-6 py-3">
                      SGPA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.semesters.map((sem, index) => (
                    <tr key={sem.sem} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        Semester {sem.sem}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={sem.sgpa}
                          onChange={(e) =>
                            handleSemesterChange(index, "sgpa", e.target.value)
                          }
                          disabled={!allowUpdate}
                          className="border rounded-md h-8 px-2 w-24 text-gray-900"
                        />
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Action Buttons --- */}
          <div className="mt-8 flex justify-between items-center">
            {/* Approval Status and Buttons */}
            <div className="flex gap-2 items-center">
              <span className="font-semibold">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  approved === "approved"
                    ? "bg-green-100 text-green-800"
                    : approved === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {approved ? approved.charAt(0).toUpperCase() + approved.slice(1) : "Pending"}
              </span>
              {
                allowUpdate && (
                  <>
                  <Button
                type="button"
                onClick={() => handleApprovalAction("approved")}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                type="button"
                onClick={() => handleApprovalAction("rejected")}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={loading}
              >
                Reject
              </Button>
              <Button
                type="button"
                onClick={() => handleApprovalAction("pending")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                disabled={loading}
              >
                Set to Pending
              </Button>
                  </>
                )
              }
            </div>

            {/* Save Changes Button */}
            {allowUpdate && (
              <Button
                type="button"
                onClick={handleSaveChanges}
                className="bg-gray-500 text-white hover:bg-black duration-300 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
};

export default StudentProfileManage;