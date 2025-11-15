import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { API_ROUTES } from "@/lib/apiRoutes";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    cpassword: "",
    role: "",
    deptId: "",
    f_name: "",
    college_id: "",
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await axios.get(API_ROUTES.DEPARTMENTS);
        setDepartments(res.data.data); // ✅ Correct structure
      } catch (err) {
        setDepartments([]);
      }
    };
    fetchDept();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: any) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { email, password, cpassword, role, deptId } = form;

    if (!email || !password || !cpassword || !role || !deptId) {
      setError("All fields are required.");
      return;
    }
    if (password !== cpassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_ROUTES.REGISTER, {
        email: form.email,
        password: form.password,
        role: form.role,
        deptId: form.deptId,
        f_name: form.f_name,
        college_id: form.college_id,
      });

      setSuccess(res.data.message || "Registration successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

          {error && (
            <div className="mb-4 text-red-600 text-center text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-center text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <Label htmlFor="f_name" className="mb-2 block">
                Name
              </Label>
              <Input
                id="f_name"
                name="f_name"
                type="text"
                placeholder="John"
                value={form.f_name}
                onChange={handleChange}
              />
            </div>

            {/* College ID */}
            <div>
              <Label htmlFor="college_id" className="mb-2 block">
                College ID
              </Label>
              <Input
                id="college_id"
                name="college_id"
                type="text"
                placeholder="23CP001"
                value={form.college_id}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="cpassword" className="mb-2 block">
                Confirm Password
              </Label>
              <Input
                id="cpassword"
                name="cpassword"
                type="password"
                placeholder="********"
                value={form.cpassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <Label htmlFor="role" className="mb-2 block">
                Role
              </Label>
              <Select value={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="TPC">TPC</SelectItem>
                  <SelectItem value="TPF">TPF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Dropdown */}
            <div>
              <Label htmlFor="deptId" className="mb-2 block">
                Department
              </Label>
              <Select
                value={form.deptId}
                onValueChange={(value) => setForm({ ...form, deptId: value })}
              >
                <SelectTrigger id="deptId" className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.length > 0 ? (
                    departments
                      .filter((dept) => dept && dept._id)
                      .map((dept: any) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.dept_name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading departments...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Sign Up Button */}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          {/* Link to Sign In */}
          <div className="text-sm text-center mt-4">
            <p>
              Already have an account?
              <Link to="/" className="text-blue-600 hover:underline ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
