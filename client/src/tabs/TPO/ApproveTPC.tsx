import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";
import { toast } from "sonner";

export default function TPOApproveTPC() {
  const [pendingTPCs, setPendingTPCs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch pending TPCs
  const fetchPending = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_ROUTES.PENDING_TPC, {
        withCredentials: true, // If JWT is stored in cookie
      });

      setPendingTPCs(res.data);
    } catch (error: any) {
      console.error(error);
      toast
        .error(
          error?.response?.data?.message || "Failed to load pending TPCs"
        );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Approve / Reject
  const handleAction = async (userId: string, approve: boolean) => {
    try {
      setActionLoading(userId + "-" + approve);

      const res = await axios.post(
        API_ROUTES.APPROVE_TPC,
        { userId, approve },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Action completed");

      // Refresh list after action
      fetchPending();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Could not process your request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Pending TPC Approvals
          </h1>

          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : pendingTPCs.length === 0 ? (
            <div className="text-center text-gray-600">No pending TPCs.</div>
          ) : (
            <div className="space-y-4">
              {pendingTPCs.map((tpc) => {
                const approveKey = tpc._id + "-true";
                const rejectKey = tpc._id + "-false";

                return (
                  <div
                    key={tpc._id}
                    className="flex justify-between items-center border p-3 rounded-lg bg-white"
                  >
                    <div>
                      <div>
                        <b>Email:</b> {tpc.email}
                      </div>
                      <div>
                        <b>Created:</b>{" "}
                        {new Date(tpc.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="space-x-2">
                      <Button
                        disabled={actionLoading === approveKey}
                        onClick={() => handleAction(tpc._id, true)}
                      >
                        {actionLoading === approveKey ? "Approving..." : "Approve"}
                      </Button>

                      <Button
                        variant="destructive"
                        disabled={actionLoading === rejectKey}
                        onClick={() => handleAction(tpc._id, false)}
                      >
                        {actionLoading === rejectKey ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
