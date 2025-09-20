import { Card, CardContent } from "@/components/ui/card";
import { tpoProfile } from "@/lib/dummyProfiles";

export default function TPODashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
                <CardContent>
                    <h1 className="text-2xl font-bold mb-6 text-center">TPO Dashboard</h1>
                    <div className="space-y-2">
                        <div><b>Name:</b> {tpoProfile.name}</div>
                        <div><b>Contact:</b> {tpoProfile.contact}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
