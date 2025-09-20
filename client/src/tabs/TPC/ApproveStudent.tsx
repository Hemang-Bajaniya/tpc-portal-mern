import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/pagination";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

export default function TPCApproveStudent() {
    const [pendingStudents, setPendingStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const fetchPending = async (pageNum = 1) => {
        setLoading(true);
        const res = await axios.get(`${API_ROUTES.PENDING}?page=${pageNum}&pageSize=${pageSize}`, { withCredentials: true });
        setPendingStudents(res.data.data || []);
        setTotal(res.data.total || 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchPending(page)
    }, [page]);

    const handleAction = async (studentId: string, approve: boolean) => {
        await axios.post(API_ROUTES.PENDING, { studentId, approve }, { withCredentials: true });
        fetchPending(page);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl">
                <CardContent>
                    <h1 className="text-2xl font-bold mb-6 text-center">Pending Student Approvals</h1>
                    {loading ? (
                        <div>Loading...</div>
                    ) : pendingStudents.length === 0 ? (
                        <div className="text-center">No pending students.</div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {pendingStudents.map((stu) => (
                                    <div key={stu._id} className="flex justify-between items-center border p-3 rounded-lg bg-white">
                                        <div>
                                            <div><b>Email:</b> {stu.userId.email}</div>
                                            <div><b>Dept:</b> {stu.dept_id.dept_name}</div>
                                            <div><b>Created:</b> {new Date(stu.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div className="space-x-2">
                                            <Button onClick={() => handleAction(stu._id, true)} variant="default">Approve</Button>
                                            <Button onClick={() => handleAction(stu._id, false)} variant="destructive">Reject</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
