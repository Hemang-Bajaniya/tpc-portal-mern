import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { API_ROUTES } from "@/lib/apiRoutes"; // ADD_ROUND, UPDATE_DELETE_ROUND, GET_DRIVE_ROUNDS, etc.

interface Round {
  _id?: string;
  title: string;
  mode: string;
  round_number: string;
  date_time: string;
  location: string;
  instructions: string;
  status: string;
}

export function RoundInfoForm({ allowUpdate = true }: { allowUpdate?: boolean }) {
  const { drive_id } = useParams<{ drive_id: string }>();

  const [loading, setLoading] = useState(true);
  const [driveExists, setDriveExists] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);

  // Fetch drive rounds
  useEffect(() => {
    const fetchDriveAndRounds = async () => {
      if (!drive_id) return;
      setLoading(true);

      try {
        const roundsRes = await axios.get(
          `${API_ROUTES.GET_DRIVE_ROUNDS}/${drive_id}`,
          { withCredentials: true }
        );

        if (roundsRes.data?.data?.length > 0) {
          setRounds(
            roundsRes.data.data.map((r: any) => ({
              _id: r._id,
              title: r.title || "",
              mode: r.mode || "Online",
              round_number: r.round_number?.toString() || "",
              date_time: r.date_time
                ? new Date(r.date_time).toISOString().slice(0, 16)
                : "",
              location: r.location || "",
              instructions: r.instructions || "",
              status: r.status || "Pending",
            }))
          );
          setDriveExists(true);
        } else {
          setRounds([
            {
              title: "",
              mode: "Online",
              round_number: "",
              date_time: "",
              location: "",
              instructions: "",
              status: "Pending",
            },
          ]);
          setDriveExists(true);
        }
      } catch (err) {
        console.error("Error fetching rounds:", err);
        toast.error("Failed to fetch rounds.");
        setDriveExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveAndRounds();
  }, [drive_id]);

  const handleChange = (index: number, key: string, value: string) => {
    setRounds((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleAddRound = () => {
    setRounds((prev) => [
      ...prev,
      {
        title: "",
        mode: "Online",
        round_number: "",
        date_time: "",
        location: "",
        instructions: "",
        status: "Pending",
      },
    ]);
  };

  const handleSave = async (index: number) => {
    if (!allowUpdate || !drive_id) return;
    const round = rounds[index];

    try {
      if (round._id) {
        // ✅ Update existing round
        await axios.put(
          `${API_ROUTES.UPDATE_DELETE_ROUND}/${drive_id}/round/${round._id}`,
          round,
          { withCredentials: true }
        );
        toast.success("Round updated successfully!");
      } else {
        // ✅ Add new round
        const res = await axios.post(
          `${API_ROUTES.ADD_ROUND}/${drive_id}/round`,
          round,
          { withCredentials: true }
        );

        // Add the returned round (with _id) to state
        const newRound = res.data?.data;
        setRounds((prev) => {
          const updated = [...prev];
          updated[index] = newRound;
          return updated;
        });

        toast.success("Round added successfully!");
      }
    } catch (err) {
      console.error("Error saving round:", err);
      toast.error("Failed to save round.");
    }
  };

  const handleDelete = async (index: number) => {
    const round = rounds[index];
    if (!round._id) {
      setRounds((prev) => prev.filter((_, i) => i !== index));
      toast.info("Round removed locally.");
      return;
    }

    try {
      await axios.delete(
        `${API_ROUTES.UPDATE_DELETE_ROUND}/${drive_id}/round/${round._id}`,
        { withCredentials: true }
      );
      setRounds((prev) => prev.filter((_, i) => i !== index));
      toast.success("Round deleted successfully!");
    } catch (err) {
      console.error("Error deleting round:", err);
      toast.error("Failed to delete round.");
    }
  };

  if (loading) {
    return <p className="text-center py-6">Loading rounds...</p>;
  }

  if (!driveExists) {
    return (
      <p className="text-center py-6 text-red-600">
        No placement drive found for this ID.
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {rounds.map((round, index) => (
        <Card key={index} className="bg-white p-4 shadow-md">
          <CardHeader>
            <CardTitle>Round Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="pb-2">Round Title</Label>
              <Input
                placeholder="e.g., Technical Interview"
                value={round.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                disabled={!allowUpdate}
              />
            </div>

            <div>
              <Label className="pb-2">Mode</Label>
              <Select
                value={round.mode}
                onValueChange={(v) => handleChange(index, "mode", v)}
                disabled={!allowUpdate}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="pb-2">Round Number</Label>
              <Input
                type="number"
                min="1"
                value={round.round_number}
                onChange={(e) =>
                  handleChange(index, "round_number", e.target.value)
                }
                disabled={!allowUpdate}
              />
            </div>

            <div>
              <Label className="pb-2">Date & Time</Label>
              <Input
                type="datetime-local"
                value={round.date_time}
                onChange={(e) =>
                  handleChange(index, "date_time", e.target.value)
                }
                disabled={!allowUpdate}
              />
            </div>

            <div>
              <Label className="pb-2">Location</Label>
              <Input
                placeholder="Enter location (if offline)"
                value={round.location}
                onChange={(e) =>
                  handleChange(index, "location", e.target.value)
                }
                disabled={!allowUpdate}
              />
            </div>

            <div>
              <Label className="pb-2">Instructions</Label>
              <Textarea
                placeholder="Enter any special instructions"
                value={round.instructions}
                onChange={(e) =>
                  handleChange(index, "instructions", e.target.value)
                }
                disabled={!allowUpdate}
              />
            </div>

            <div>
              <Label className="pb-2">Status</Label>
              <Select
                value={round.status}
                onValueChange={(v) => handleChange(index, "status", v)}
                disabled={!allowUpdate}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleSave(index)} disabled={!allowUpdate}>
                {round._id ? "Update Round" : "Add Round"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(index)}
                disabled={!allowUpdate}
              >
                Delete Round
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleAddRound} disabled={!allowUpdate} className="mt-4">
        Add Another Round
      </Button>
    </div>
  );
}