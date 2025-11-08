import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { API_ROUTES } from "@/lib/apiRoutes";

export function AddPlacementDrive({ allowUpdate = true }: { allowUpdate?: boolean }) {
  const { job_id } = useParams<{ job_id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    drive_title: "",
    description: "",
    drive_date: "",
    status: "Upcoming",
  });

  const [driveId, setDriveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch placement drive if it exists
  useEffect(() => {
    const fetchDrive = async () => {
      if (!job_id) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_ROUTES.GET_DRIVE}/${job_id}`, {
          withCredentials: true,
        });

        if (res.data?.data) {
          const drive = res.data.data;
          setFormData({
            drive_title: drive.drive_title || "",
            description: drive.description || "",
            drive_date: drive.drive_date
              ? new Date(drive.drive_date).toISOString().slice(0, 16)
              : "",
            status: drive.status || "Upcoming",
          });
          setDriveId(drive._id);
        } else {
          setDriveId(null);
        }
      } catch (err) {
        console.error("Error fetching placement drive:", err);
        setDriveId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDrive();
  }, [job_id]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!allowUpdate || !job_id) return;
    setSaving(true);

    try {
      if (driveId) {
        // Update existing drive
        await axios.put(`${API_ROUTES.UPDATE_DRIVE}/${driveId}`, { ...formData, job_profile: job_id }, { withCredentials: true });
        alert("Placement drive updated successfully!");
      } else {
        // Add new drive
        const res = await axios.post(API_ROUTES.ADD_DRIVE, { ...formData, job_profile: job_id }, { withCredentials: true });
        setDriveId(res.data.data._id);
        alert("Placement drive added successfully!");
      }
    } catch (err) {
      console.error("Error saving placement drive:", err);
      alert("Failed to save placement drive.");
    } finally {
      setSaving(false);
    }
  };

  const handleRoundsRedirect = () => {
    if (!driveId) return;
    navigate(`/tpc/placement-drives-management/round-manage/${driveId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Loading placement drive...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white p-4 sm:p-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          {driveId ? "Update Placement Drive" : "Add Placement Drive"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="drive_title" className="pb-2">Drive Title</Label>
            <Input
              id="drive_title"
              placeholder="Enter drive title"
              value={formData.drive_title}
              onChange={(e) => handleChange("drive_title", e.target.value)}
              disabled={!allowUpdate}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor="drive_date" className="pb-2">Drive Date</Label>
            <div className="relative">
              <Input
                id="drive_date"
                type="datetime-local"
                value={formData.drive_date}
                onChange={(e) => handleChange("drive_date", e.target.value)}
                disabled={!allowUpdate}
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="pb-2">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter drive description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={!allowUpdate}
            className="resize-none"
          />
        </div>

        <div>
          <Label className="pb-2">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(v) => handleChange("status", v)}
            disabled={!allowUpdate}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <Button
            onClick={handleSubmit}
            disabled={!allowUpdate || saving}
            className="w-full sm:w-auto"
          >
            {saving
              ? "Saving..."
              : driveId
              ? "Update Placement Drive"
              : "Add Placement Drive"}
          </Button>

          {driveId && (
            <Button
              onClick={handleRoundsRedirect}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Manage Rounds
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}