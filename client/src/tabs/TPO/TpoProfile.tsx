import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";
import { toast } from "sonner";

const TPOProfileForm = ({ allowUpdate }: { allowUpdate: boolean }) => {
    const emptyProfile = {
        userId: "",
        name: "",
        mobile: "",
        email: "",
        updatedAt: "",
    };

    const [formData, setFormData] = useState<any>(emptyProfile);
    const [passwords, setPasswords] = useState({
        current_password: "",
        change_password: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [passwordSaving, setPasswordSaving] = useState<boolean>(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: any) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    // -------------------------------
    // CHANGE PASSWORD
    // -------------------------------
    const handlePasswordSubmit = async () => {
        if (!passwords.current_password) {
            toast.error("Please enter your current password");
            return;
        }
        if (!passwords.change_password) {
            toast.error("Please enter a new password");
            return;
        }

        try {
            setPasswordSaving(true);
            const payload = {
                newPassword: passwords.change_password,
                oldPassword: passwords.current_password,
            };

            const res = await axios.put(API_ROUTES.UPDATE_PASSWORD, payload, {
                withCredentials: true,
            });

            toast.success(res.data?.message || "Password updated successfully");

            setPasswords({ current_password: "", change_password: "" });
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to update password";
            toast.error(message);
        } finally {
            setPasswordSaving(false);
        }
    };

    // -------------------------------
    // FETCH TPO PROFILE DATA
    // -------------------------------
    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axios.get(API_ROUTES.TPO_PROFILE, {
                    withCredentials: true,
                });

                const data = res.data.data;
                if (mounted && data) {
                    setFormData({
                        ...emptyProfile,
                        ...data,
                        email: data.userId?.email || "",
                    });
                }
            } catch (err) {
                console.error("Failed to fetch TPO profile:", err);
                toast.error("Failed to load profile");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProfile();
        return () => {
            mounted = false;
        };
    }, []);

    // -------------------------------
    // SAVE PROFILE UPDATE
    // -------------------------------
    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(API_ROUTES.TPO_PROFILE, formData, {
                withCredentials: true,
            });
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update TPO profile:", err);
            toast.error("Update failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {/* PROFILE CARD */}
            <Card className="bg-white text-gray-800 w-full rounded-md mb-3">
                <div className="container mx-auto px-4 py-8">
                    {/* HEADER */}
                    <header className="mb-10">
                        <div className="flex items-center space-x-4">
                            <img
                                src={`https://placehold.co/64x64/7c3aed/ffffff?text=${(formData?.name || "")[0] || ""
                                    }`}
                                alt="User Avatar"
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {formData?.name}
                                </h1>
                                <p className="text-gray-500">TPO User Profile</p>
                            </div>
                        </div>
                    </header>

                    {/* FORM */}
                    <div className="border rounded-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Profile Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NAME */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ""}
                                    disabled={!allowUpdate}
                                    onChange={handleChange}
                                    className="border bg-white rounded-md w-full h-10 px-3"
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    disabled // email cannot be changed
                                    className="border bg-gray-100 rounded-md w-full h-10 px-3"
                                />
                            </div>

                            {/* MOBILE */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Mobile
                                </label>
                                <input
                                    type="text"
                                    name="mobile"
                                    maxLength={10}
                                    value={formData.mobile || ""}
                                    disabled={!allowUpdate}
                                    onChange={handleChange}
                                    className="border bg-white rounded-md w-full h-10 px-3"
                                />
                            </div>

                            {/* LAST UPDATED */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Last Updated
                                </label>
                                <input
                                    type="text"
                                    value={
                                        formData.updatedAt
                                            ? new Date(formData.updatedAt).toLocaleString()
                                            : "N/A"
                                    }
                                    disabled
                                    className="border bg-gray-100 rounded-md w-full h-10 px-3"
                                />
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        {allowUpdate && (
                            <div className="mt-8 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving || loading}
                                    className="bg-gray-700 text-white hover:bg-black"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* PASSWORD UPDATE */}
            {allowUpdate && (
                <Card className="bg-white text-gray-800 w-full rounded-md">
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwords.current_password}
                                    onChange={handlePasswordChange}
                                    className="border bg-white rounded-md w-full h-10 px-3"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="change_password"
                                    value={passwords.change_password}
                                    onChange={handlePasswordChange}
                                    className="border bg-white rounded-md w-full h-10 px-3"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handlePasswordSubmit}
                                disabled={passwordSaving}
                                className="bg-gray-700 text-white hover:bg-black"
                            >
                                {passwordSaving ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TPOProfileForm;
