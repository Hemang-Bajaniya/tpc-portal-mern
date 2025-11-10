import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { API_ROUTES } from "@/lib/apiRoutes";

interface Application {
  _id: string;
  student_name: string;
  college_id: string;
  status: string;
}

interface Round {
  _id: string;
  round_number: number;
  selected: string[];
  title?: string;
  status?: string;
}

export function RoundApplicationsManager() {
  const { driveId, roundId } = useParams<{ driveId: string; roundId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!driveId || !roundId) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_ROUTES.UPDATE_DELETE_ROUND}/${driveId}/round/${roundId}/applications`,
          { withCredentials: true }
        );

        const apps = res.data?.data || [];
        const roundData = res.data?.round;
        setApplications(apps);
        setRound(roundData);
        setSelectedIds(roundData?.selected || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load applications for this round.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [driveId, roundId]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = applications.map((app) => app._id);
    setSelectedIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSave = async () => {
    if (!driveId || !roundId) return;
    setSaving(true);
    try {
      await axios.put(
        `${API_ROUTES.UPDATE_DELETE_ROUND}/${driveId}/round/${roundId}/applications`,
        { selected: selectedIds },
        { withCredentials: true }
      );
      toast.success("Round selection updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update selection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-6">Loading applications...</p>;

  return (
    <Card className="p-4 shadow-md bg-white">
      <CardHeader>
        <CardTitle>
          Manage Round {round?.round_number}
          {round?.title ? `: ${round.title}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p>No applications found for this round.</p>
        ) : (
          <>
            {/* Select All / Deselect All buttons */}
            <div className="flex gap-2 mb-4">
              <Button onClick={handleSelectAll} size="sm">
                Select All
              </Button>
              <Button onClick={handleDeselectAll} size="sm" variant="outline">
                Deselect All
              </Button>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">{app.student_name}</p>
                    <p className="text-sm text-gray-500">{app.college_id}</p>
                  </div>
                  <Checkbox
                    checked={selectedIds.includes(app._id)}
                    onCheckedChange={() => handleToggle(app._id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <Button
          onClick={handleSave}
          className="mt-4"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Selections"}
        </Button>
      </CardContent>
    </Card>
  );
}