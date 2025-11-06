import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const departmentMap: Record<string, string> = {
  DEP001: "Computer Engineering",
  DEP002: "Information Technology",
  DEP003: "Electronics",
};

const TPCProfileForm = ({ allowUpdate }: { allowUpdate: boolean }) => {
  const userData = {
    userId: "USER0001",
    name: "Virendra",
    gender: "M",
    dept_id: "DEP001",
    mobile: "9876543210",
    email: "virendra@college.edu",
    created_at: "2024-09-01",
  };

  const [formData, setFormData] = useState(userData);
  const [passwords, setPasswords] = useState({
    current_password: "",
    change_password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <div className="">
      {/* Profile Info */}
      <Card className="bg-white text-gray-800 font-sans w-full rounded-md mb-3">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-10">
            <div className="flex items-center space-x-4">
              <img
                src={`https://placehold.co/64x64/7c3aed/ffffff?text=${userData.name[0]}`}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-black-500"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {formData?.name}
                </h1>
                <p className="text-gray-500">TPC User Profile</p>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-md border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Profile Details
            </h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                    value={formData?.name || ""}
                    disabled={!allowUpdate}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="dept_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department
                  </label>
                  <select
                    id="dept_id"
                    name="dept_id"
                    value={formData.dept_id}
                    onChange={handleChange}
                    disabled={!allowUpdate}
                    className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  >
                    {Object.entries(departmentMap).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Name (readonly derived field) */}
                <div>
                  <label
                    htmlFor="dept_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department Name
                  </label>
                  <input
                    id="dept_name"
                    type="text"
                    value={departmentMap[formData.dept_id]}
                    className="block w-full bg-gray-100 border border-gray-300 rounded-md text-gray-900 sm:text-sm h-10 px-3"
                    disabled
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                    value={formData?.email || ""}
                    disabled={!allowUpdate}
                    onChange={handleChange}
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                    value={formData?.mobile || ""}
                    disabled={!allowUpdate}
                    onChange={handleChange}
                  />
                </div>

                {/* Created At */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="created_at"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Created At
                  </label>
                  <input
                    type="text"
                    id="created_at"
                    className="block w-full bg-gray-100 border-gray-300 rounded-md border text-gray-900 sm:text-sm h-10 px-3"
                    value={new Date(formData?.created_at).toLocaleDateString()}
                    disabled
                  />
                </div>
              </div>

              {/* Save Button */}
              {allowUpdate && (
                <div className="mt-8 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-500 text-white hover:bg-black hover:text-white duration-300 cursor-pointer"
                    onClick={() => alert("Changes Saved! (Test Only)")}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </Card>

      {/* Password Update Section */}
      {allowUpdate && (
        <Card className="bg-white text-gray-800 font-sans w-full rounded-md">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="current_password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  id="current_password"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 sm:text-sm h-10 px-3"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="change_password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="change_password"
                  id="change_password"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 sm:text-sm h-10 px-3"
                  value={passwords.change_password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-700 text-white hover:bg-black hover:text-white duration-300 cursor-pointer"
                onClick={() =>
                  alert(
                    `Password change submitted: \nCurrent: ${passwords.current_password}\nNew: ${passwords.change_password}`
                  )
                }
              >
                Update Password
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TPCProfileForm;