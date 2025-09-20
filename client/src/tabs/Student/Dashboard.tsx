import { Card, CardContent } from "@/components/ui/card";
import { studentProfile } from "@/lib/dummyProfiles";

export default function StudentDashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
                <CardContent>
                    <h1 className="text-2xl font-bold mb-6 text-center">Student Dashboard</h1>
                    <div className="space-y-2">
                        <div><b>Name:</b> {studentProfile.f_name} {studentProfile.l_name}</div>
                        <div><b>College ID:</b> {studentProfile.college_id}</div>
                        <div><b>Mobile:</b> {studentProfile.mobile}</div>
                        <div><b>Department:</b> {studentProfile.dept_id}</div>
                        <div><b>Skills:</b> {studentProfile.skills.join(", ")}</div>
                        <div><b>Placed:</b> {studentProfile.isPlaced ? "Yes" : "No"}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
