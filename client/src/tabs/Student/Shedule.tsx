import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES } from "@/lib/apiRoutes";

interface SelectedStudent {
  application_id: string;
  student_name: string;
  college_id: string;
}

interface RoundInfo {
  _id: string;
  title: string;
  mode: "Online" | "Offline";
  round_number: number;
  date_time: string;
  location?: string;
  instructions?: string;
  status: "Pending" | "Ongoing" | "Completed";
  selected_students: SelectedStudent[];
}

interface PlacementDrive {
  _id: string;
  drive_title: string;
  description?: string;
  companyName: string;
  job_profile_name?: string;
  drive_date: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  hiring_process: RoundInfo[];
}

export default function PlacementDriveDetails() {
  const { driveId } = useParams<{ driveId: string }>();
  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({});

  const toggleStudents = (roundId: string) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [roundId]: !prev[roundId],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!driveId) return;

      try {
        setLoading(true);

        // Fetch drive with selected students
        const driveRes = await axios.get(
          `${API_ROUTES.GET_DRIVE_STUDENT}/${driveId}/with-students`,
          { withCredentials: true }
        );

        // Fetch college ID of logged-in student
        const collegeRes = await axios.get(`${API_ROUTES.GET_COLLEGE_ID}`, {
          withCredentials: true,
        });

        const collegeValue =
          collegeRes.data?.data?.college_id ||
          collegeRes.data?.data?.conllege_id ||
          "-";

        setCollegeId(collegeValue);
        setDrive(driveRes.data?.data || null);

        // Find student name if exists in selected list
        if (driveRes.data?.data?.hiring_process) {
          const found = driveRes.data.data.hiring_process
            .flatMap((r: RoundInfo) => r.selected_students)
            .find((s: SelectedStudent) => s.college_id === collegeValue);
          if (found) setSelectedName(found.student_name);
        }
      } catch (err: any) {
        console.error("Error fetching drive:", err);
        setError(err.response?.data?.message || "Failed to fetch placement drive.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [driveId]);

  if (loading)
    return <p className="text-center py-6">Loading placement drive details...</p>;
  if (error)
    return <p className="text-center py-6 text-red-600">{error}</p>;
  if (!drive)
    return (
      <p className="text-center py-6 text-gray-600">
        No placement drive scheduled.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Drive Header */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">{drive.drive_title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {drive.job_profile_name && (
            <p>
              <strong>Job Profile:</strong> {drive.job_profile_name}
            </p>
          )}
          <p>
            <strong>Drive Date:</strong>{" "}
            {drive.drive_date
              ? new Date(drive.drive_date).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> <Badge>{drive.status}</Badge>
          </p>
          {drive.description && (
            <p>
              <strong>Description:</strong> {drive.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Hiring Rounds */}
      <h2 className="text-xl font-semibold">Hiring Rounds</h2>
      {drive.hiring_process?.length === 0 ? (
        <p className="text-gray-600">No rounds scheduled for this drive.</p>
      ) : (
        <div className="space-y-4">
          {drive.hiring_process.map((round) => (
            <Card key={round._id} className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Round {round.round_number}: {round.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  <strong>Mode:</strong> {round.mode}
                </p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(round.date_time).toLocaleString()}
                </p>
                {round.location && (
                  <p>
                    <strong>Location:</strong> {round.location}
                  </p>
                )}
                {round.instructions && (
                  <p>
                    <strong>Instructions:</strong> {round.instructions}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant={
                      round.status === "Completed"
                        ? "secondary"
                        : round.status === "Ongoing"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {round.status}
                  </Badge>
                </p>

                {/* Show if current student is selected */}
                {collegeId &&
                  round.selected_students.some(
                    (student) => student.college_id === collegeId
                  ) && (
                    <p className="text-green-700 font-medium">
                      ✅ You ({selectedName}) are selected in this round.
                    </p>
                  )}

                {/* Collapsible Selected Students */}
                {round.selected_students.length > 0 && (
                  <div className="mt-2">
                    <button
                      className="flex items-center justify-between w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md font-medium text-gray-800 transition-colors duration-200"
                      onClick={() => toggleStudents(round._id)}
                    >
                      <span>
                        Selected Students ({round.selected_students.length})
                      </span>
                      <span className="ml-2 text-sm">
                        {expandedStudents[round._id] ? "▲" : "▼"}
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedStudents[round._id]
                          ? "max-h-96 mt-2"
                          : "max-h-0"
                      }`}
                    >
                      <ul className="bg-white border border-gray-200 rounded-md p-3 space-y-1 shadow-sm">
                        {round.selected_students
                          .slice()
                          .sort((a, b) =>
                            a.college_id.localeCompare(b.college_id)
                          )
                          .map((student) => (
                            <li
                              key={student.application_id}
                              className="flex justify-between px-2 py-1 hover:bg-gray-50 rounded"
                            >
                              <span className="font-medium text-gray-700">
                                {student.student_name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {student.college_id}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}