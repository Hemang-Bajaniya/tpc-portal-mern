import { Card, CardContent } from "@/components/ui/card";
import { tpfProfile } from "@/lib/dummyProfiles";

export default function TPFDashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
                <CardContent>
                    <h1 className="text-2xl font-bold mb-6 text-center">TPF Dashboard</h1>
                    <div className="space-y-2">
                        <div><b>Name:</b> {tpfProfile.name}</div>
                        <div><b>Department:</b> {tpfProfile.deptId}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
