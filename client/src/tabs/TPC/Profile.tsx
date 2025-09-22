import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TPCProfileForm = ({ allowUpdate }: { allowUpdate: boolean }) => {
  // Dummy user data (match with model fields)
  const userData = {
    userId: "USER0001",
    name: "Virendra",
    gender: "M",
    dept_id: "DEP001",
    mobile: "9876543210",
    created_at: "2024-09-01",
  };

  const [formData, setFormData] = useState(userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="bg-white text-gray-800 font-sans h-full w-full rounded-none">
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
            <div className="grid grid-c
            ols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="dept_id" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <option value="DEP001">Computer Engineering</option>
                  <option value="DEP002">Information Technology</option>
                  <option value="DEP003">Electronics</option>
                </select>
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-2">
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
  );
};

export default TPCProfileForm;