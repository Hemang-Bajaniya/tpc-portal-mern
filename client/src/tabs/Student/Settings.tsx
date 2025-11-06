import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API_ROUTES } from "@/lib/apiRoutes";

export default function Settings() {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { current_password, new_password, confirm_password } = formData;

    // 🔐 Basic validation
    if (!current_password || !new_password || !confirm_password) {
      return setError("All fields are required.");
    }
    if (new_password !== confirm_password) {
      return setError("New passwords do not match.");
    }
    if (new_password.length < 6) {
      return setError("New password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${API_ROUTES.UPDATE_STUDENT_PASSWORD}`,
        {
          currentPassword: current_password,
          newPassword: new_password,
        },
        { withCredentials: true }
      );

      setSuccess("Password updated successfully.");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Change Password</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="current_password" className="pb-2">Current Password</Label>
            <Input
              id="current_password"
              name="current_password"
              type="password"
              value={formData.current_password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="new_password" className="pb-2">New Password</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              value={formData.new_password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm_password" className="pb-2">Confirm New Password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}