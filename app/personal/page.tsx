"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { User, Save, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PersonalPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    gmail: "",
    location: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load existing personal data
    const personal = localStorage.getItem(`personal_${userData.id}`)
    if (personal) {
      const personalData = JSON.parse(personal)
      setFormData({
        name: personalData.name || userData.name,
        gmail: personalData.gmail || userData.gmail,
        location: personalData.location || "",
        password: "",
        confirmPassword: "",
      })
    } else {
      // Use signup data as defaults
      setFormData({
        name: userData.name,
        gmail: userData.gmail,
        location: "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validation for password change
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      // Update personal data
      const personalData = {
        name: formData.name,
        gmail: formData.gmail,
        location: formData.location,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(`personal_${user.id}`, JSON.stringify(personalData))

      // Update password if provided
      if (formData.password) {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: any) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex].password = formData.password
          localStorage.setItem("users", JSON.stringify(users))

          // Update current user
          const updatedUser = { ...user, password: formData.password }
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          setUser(updatedUser)
        }
      }

      setSuccess("Personal information updated successfully!")
      setFormData({ ...formData, password: "", confirmPassword: "" })
    } catch (err) {
      setError("Failed to update personal information")
    }

    setLoading(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile details and account settings</p>
          </div>

          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-green-600" />
                Profile Settings
              </CardTitle>
              <CardDescription>Update your personal information and change your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      readOnly
                      className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Name cannot be changed after signup</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gmail">Email Address</Label>
                  <Input
                    id="gmail"
                    type="email"
                    value={formData.gmail}
                    readOnly
                    className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed after signup</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                    placeholder="Enter your location (city, state, country)"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 pr-10"
                          placeholder="Leave blank to keep current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                </div>

                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <AlertDescription className="text-green-700 dark:text-green-400">{success}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
