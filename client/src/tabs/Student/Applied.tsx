import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useNavigate } from "react-router-dom";

interface Application {
  jobId: string;
  status: "approved" | "rejected" | "pending" | null;
  title: string;
  companyName: string;
  companyLogo: string;
  driveId?: string;
}

export default function StudentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(API_ROUTES.GET_APPLICATION, { withCredentials: true });
        setApplications(res.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading applications...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (applications.length === 0)
    return <p className="text-center mt-8 text-gray-500">You have not applied to any jobs yet.</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">My Applications</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <Card key={app.jobId} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center gap-4">
              <img
                src={app.companyLogo || "https://placehold.co/64x64?text=No+Logo"}
                alt={app.companyName}
                className="w-16 h-16 rounded-full border border-gray-300 object-cover"
              />
              <div className="flex flex-col">
                <CardTitle className="text-lg font-semibold">{app.companyName}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">{app.title}</p>
              </div>
            </CardHeader>

            <CardContent className="mt-2 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    app.status === "approved"
                      ? "secondary"
                      : app.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {app.status || "Pending"}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                {/* View Job Details Button */}
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/student/dashboard/jobs/${app.jobId}`)}
                >
                  View Job Details
                </Button>

                {/* View Drive Schedule Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/student/dashboard/drive/${app.jobId}`)}
                >
                  View Drive Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
