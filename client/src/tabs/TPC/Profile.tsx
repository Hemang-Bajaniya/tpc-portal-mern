import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_ROUTES } from "@/lib/apiRoutes"

interface TPCProfile {
    name: string
    gender: string
    dept_id: string
    mobile: string
}

export default function TPCProfileForm() {
    const [form, setForm] = useState<TPCProfile>({
        name: "",
        gender: "",
        dept_id: "",
        mobile: "",
    })
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Fetch profile + departments
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, deptRes] = await Promise.all([
                    axios.get(API_ROUTES.TPC_PROFILE, { withCredentials: true }),
                    axios.get(API_ROUTES.DEPARTMENTS),
                ])
                setForm(profileRes.data.data)
                setDepartments(deptRes.data)
            } catch {
                setError("Failed to load profile.")
            }
        }
        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleGenderChange = (value: string) => {
        setForm({ ...form, gender: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")
        try {
            await axios.put(API_ROUTES.TPC_PROFILE, {
                name: form.name,
                gender: form.gender,
                mobile: form.mobile,
            }, { withCredentials: true })
            setSuccess("Profile updated successfully.")
        } catch {
            setError("Failed to update profile.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
                <CardContent>
                    <h1 className="text-2xl font-bold mb-6 text-center">TPC Profile Management</h1>

                    {error && <div className="mb-4 text-red-600 text-center text-sm font-medium">{error}</div>}
                    {success && <div className="mb-4 text-green-600 text-center text-sm font-medium">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <Label htmlFor="name" className="mb-2 block">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <Label htmlFor="gender" className="mb-2 block">Gender</Label>
                            <Select value={form.gender} onValueChange={handleGenderChange}>
                                <SelectTrigger id="gender" className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                    <SelectItem value="O">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department (disabled) */}
                        <div>
                            <Label htmlFor="dept_id" className="mb-2 block">Department</Label>
                            <Select value={form.dept_id} disabled>
                                <SelectTrigger id="dept_id" className="w-full">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept: any) => (
                                        <SelectItem key={dept._id} value={dept._id}>
                                            {dept.dept_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mobile */}
                        <Input
                            id="mobile"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                            maxLength={10}
                            placeholder="Enter 10-digit mobile number"
                        />


                        {/* Submit Button */}
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
