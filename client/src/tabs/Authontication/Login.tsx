import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          <div className="mb-4">
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="mb-6">
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>

          <Button className="w-full">Sign In</Button>

          <div className="text-sm text-center mt-4">
            <p>
              Don&apos;t have an account?
              <Link to="/auth/register" className="text-blue-600 hover:underline ml-1">Register</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}