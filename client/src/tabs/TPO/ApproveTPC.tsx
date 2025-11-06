import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

export default function TPOApproveTPC() {
  const [pendingTPCs, setPendingTPCs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await axios.get(API_ROUTES.PENDING);
    setPendingTPCs(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (userId: string, approve: boolean) => {
    await axios.post("/api/tpo/tpc/approve", { userId, approve });
    fetchPending();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Pending TPC Approvals
          </h1>
          {loading ? (
            <div>Loading...</div>
          ) : pendingTPCs.length === 0 ? (
            <div className="text-center">No pending TPCs.</div>
          ) : (
            <div className="space-y-4">
              {pendingTPCs.map((tpc) => (
                <div
                  key={tpc._id}
                  className="flex justify-between items-center border p-3 rounded-lg bg-white"
                >
                  <div>
                    <div>
                      <b>Email:</b> {tpc.email}
                    </div>
                    <div>
                      <b>Created:</b> {new Date(tpc.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleAction(tpc._id, true)}
                      variant="default"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(tpc._id, false)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
