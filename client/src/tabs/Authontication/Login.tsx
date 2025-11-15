import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { API_ROUTES } from "@/lib/apiRoutes"


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await axios.post(API_ROUTES.LOGIN, form, {
        withCredentials: true,
      })

      const { success: apiSuccess, message, data } = res.data

      if (!apiSuccess) {
        setError(message || "Invalid credentials.")
        setLoading(false)
        return
      }

      // Extract approval state
      const approved = data?.approved

      // ----------------------------
      // LOGIN APPROVAL LOGIC
      // ----------------------------

      // 1. Pending approval (approved === undefined)
      if (approved === null) {
        setError("Your account is pending approval.")
        setLoading(false)
        return
      }

      // 2. Rejected (approved === false)
      if (approved === false) {
        setError(
          "Your account request was rejected. Please contact TPO or TPC for clarification."
        )
        setLoading(false)
        return
      }

      // 3. Approved → allow login
      setSuccess("Login successful!")

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)

      setTimeout(() => {
        switch (data.role) {
          case "Student":
            navigate("/student/dashboard/profile")
            break
          case "TPC":
            navigate("/tpc")
            break
          case "TPO":
            navigate("/tpo")
            break
          case "TPF":
            navigate("/tpf/dashboard")
            break
          default:
            navigate("/")
        }
      }, 800)
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

          {error && (
            <div className="mb-4 text-red-600 text-center text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-600 text-center text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-sm text-center mt-4">
            <p>
              Don&apos;t have an account?
              <Link
                to="/auth/register"
                className="text-blue-600 hover:underline ml-1"
              >
                Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
