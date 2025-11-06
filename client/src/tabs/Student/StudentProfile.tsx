import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { API_ROUTES, API_BASE_URL_DOC } from "@/lib/apiRoutes";

// Define an interface for the error state for better type checking
interface FormErrors {
  [key: string]: string;
}

interface Student {
  college_id: string;
  f_name: string;
  m_name: string;
  l_name: string;
  mobile: string;
  dob: string; // ISO date string, e.g., "2004-05-17"
  address: string;
  skills: string[];
  resume: File | null;
  created_at: string; // ISO date string, e.g., "2024-09-01"
}

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

const StudentProfileView = ({ allowUpdate }: { allowUpdate: boolean }) => {
  // Dummy student data
  const [formData, setFormData] = useState<Student>({
    college_id: "",
    f_name: "",
    m_name: "",
    l_name: "",
    mobile: "",
    dob: "",
    address: "",
    skills: [],
    resume: null, // File or null
    created_at: "",
  });

  // State to hold validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_ROUTES.STUDENT_PROFILE, {
          withCredentials: true, // if using cookies for auth
        });

        const data = response.data?.data;

        if (data.dob) {
          data.dob = new Date(data.dob).toISOString().split("T")[0];
        }

        setFormData((prev) => ({
          ...prev,
          ...data,
          resume: null, // Keep the file input separate
        }));

        if (data.resume) {
          setResumeUrl(`${API_BASE_URL_DOC}/${data.resume}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Validation logic for the form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.f_name.trim()) newErrors.f_name = "First name is required.";
    if (!formData.l_name.trim()) newErrors.l_name = "Last name is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

    // Mobile number validation (must be 10 digits)
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
    } else if (new Date(formData.dob) >= new Date()) {
      newErrors.dob = "Date of birth must be in the past.";
    }

    // Skills validation (at least one skill)
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill must be added.";
    }

    // Resume validation (must be uploaded if not already present)
    if (!formData.resume && !resumeUrl) {
      newErrors.resume = "Resume is required.";
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes and clear errors on edit
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle resume upload with validation for type and size
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Please upload a PDF file." }));
      return;
    }

    // Check file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size cannot exceed 5MB.",
      }));
      return;
    }

    // If valid, update state and clear any existing resume error
    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.resume;
      return newErrors;
    });
  };

  // Add skill from input
  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      // Clear skills error when a skill is added
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: "" }));
      }
    }
    setSkillInput("");
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSaveChanges = async () => {
    if (!validate()) return;

    try {
      const payload = new FormData();

      payload.append("f_name", formData.f_name);
      payload.append("m_name", formData.m_name);
      payload.append("l_name", formData.l_name);
      payload.append("mobile", formData.mobile);
      payload.append("dob", formData.dob);
      payload.append("address", formData.address);
      payload.append("skills", formData.skills.join(","));

      if (formData.resume) {
        payload.append("resume", formData.resume);
      }

      const response = await axios.put(API_ROUTES.STUDENT_PROFILE, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Profile updated successfully");
        const { data } = response.data;
        if (data.resume) {
          setResumeUrl(`${API_BASE_URL_DOC}/${data.resume}`);
          setFormData((prev) => ({ ...prev, resume: null }));
        }
      } else {
        alert(`Profile update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      let message = "Something went wrong while saving the profile.";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message || message;
      }
      alert(message);
    }
  };

  // Filter skills for autocomplete
  const filteredSkills = availableSkills.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !formData.skills.includes(s)
  );

  return (
    <Card className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center space-x-4">
            <img
              src="https://placehold.co/64x64/7c3aed/ffffff?text=S"
              alt="Student Avatar"
              className="w-16 h-16 rounded-full border-2 border-black-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formData.f_name} {formData.l_name}
              </h1>
              <p className="text-gray-500">Student Profile</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Profile Details
          </h2>

          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College ID */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College ID
                </label>
                <input
                  type="text"
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  disabled
                  className="border w-full rounded-md h-10 px-3 text-gray-900 bg-gray-100"
                />
              </div>

              {/* Name Row */}
              <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
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
                    className={`border w-full rounded-md h-10 px-3 text-gray-900 ${
                      errors.f_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.f_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.f_name}</p>
                  )}
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
                    className={`border w-full rounded-md h-10 px-3 text-gray-900 ${
                      errors.l_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.l_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.l_name}</p>
                  )}
                </div>
              </div>

              {/* Mobile */}
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
                  className={`border w-full rounded-md h-10 px-3 text-gray-900 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* DOB */}
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
                  className={`border w-full rounded-md h-10 px-3 text-gray-900 ${
                    errors.dob ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!allowUpdate}
                  className={`border w-full rounded-md px-3 py-2 text-gray-900 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* Skills */}
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
                        <XMarkIcon
                          className="w-4 h-4 ml-1 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {errors.skills && (
                  <p className="text-red-500 text-xs mt-1 mb-2">
                    {errors.skills}
                  </p>
                )}

                {allowUpdate && (
                  <div className="relative">
                    <input
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
                      className="border w-full rounded-md h-10 px-3 text-gray-900"
                    />
                    {/* Autocomplete suggestions */}
                    {skillInput && filteredSkills.length > 0 && (
                      <div className="absolute z-10 bg-purple-50 border border-purple-200 w-full mt-1 rounded-md max-h-40 overflow-y-auto shadow-sm">
                        {filteredSkills.map((s) => (
                          <div
                            key={s}
                            onClick={() => addSkill(s)}
                            className="px-3 py-2 hover:bg-purple-100 cursor-pointer text-purple-900"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Created At */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Created
                </label>
                <input
                  type="text"
                  value={
                    formData.created_at
                      ? new Date(formData.created_at).toLocaleDateString()
                      : "N/A"
                  }
                  disabled
                  className="border w-full rounded-md h-10 px-3 bg-gray-100 text-gray-900"
                />
              </div>
            </div>

            {/* Resume */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF)
              </label>

              {allowUpdate ? (
                <>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className={`border w-full rounded-md h-10 px-3 text-gray-900 ${
                      errors.resume ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formData.resume && (
                    <p className="text-gray-600 text-sm mt-1">
                      Selected file: {formData.resume.name}
                    </p>
                  )}
                  {resumeUrl && !formData.resume && (
                    <div className="mt-2">
                      <a
                        href={resumeUrl}
                        className="text-purple-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View uploaded resume
                      </a>
                    </div>
                  )}
                  {errors.resume && (
                    <p className="text-red-500 text-xs mt-1">{errors.resume}</p>
                  )}
                </>
              ) : resumeUrl ? (
                <a
                  href={resumeUrl}
                  className="text-purple-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View uploaded resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </div>

            {/* Save Button */}
            {allowUpdate && (
              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-500 text-white hover:bg-black duration-300 cursor-pointer"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Card>
  );
};

export default StudentProfileView;
