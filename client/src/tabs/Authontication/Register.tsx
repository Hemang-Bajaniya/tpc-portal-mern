import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

          {/* Student ID */}
          <div className="mb-4">
            <Label htmlFor="text" className="mb-2 block">Student ID</Label>
            <Input id="text" type="text" placeholder="22XX001" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label htmlFor="cpassword" className="mb-2 block">Confirm Password</Label>
            <Input id="cpassword" type="password" placeholder="********" />
          </div>

          {/* Role Dropdown */}
          <div className="mb-6">
            <Label htmlFor="role" className="mb-2 block">Role</Label>
            <Select defaultValue="student">
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="tpc">TPC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sign In Button */}
          <Button className="w-full">Sign Up</Button>

          {/* Link to Register */}
          <div className="text-sm text-center mt-4">
            <p>
              Already have an account?
              <Link to="/" className="text-blue-600 hover:underline ml-1">Sign in</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}