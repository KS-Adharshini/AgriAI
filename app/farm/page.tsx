"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { Tractor, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FarmPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    acres: "",
    soilType: "",
    landMoisture: "",
    cropsGrown: "",
    fertilizer: "",
    notes: "",
    waterAvailability: "",
    season: "",
  })
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

    // Load existing farm data (latest record)
    const farm = localStorage.getItem(`farm_${userData.id}`)
    if (farm) {
      const farmData = JSON.parse(farm)
      setFormData(farmData)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validation
    if (!formData.acres || !formData.soilType) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      // Create farm record with timestamp
      const farmRecord = {
        ...formData,
        acres: Number.parseFloat(formData.acres),
        year: new Date().getFullYear(),
        createdAt: new Date().toISOString(),
        userId: user.id,
      }

      // Save current farm data
      localStorage.setItem(`farm_${user.id}`, JSON.stringify(farmRecord))

      // Add to farm history
      const farmHistory = JSON.parse(localStorage.getItem(`farm_history_${user.id}`) || "[]")

      // Check if record for current year exists
      const currentYearIndex = farmHistory.findIndex((record: any) => record.year === farmRecord.year)

      if (currentYearIndex !== -1) {
        // Update existing record for current year
        farmHistory[currentYearIndex] = farmRecord
      } else {
        // Add new record
        farmHistory.push(farmRecord)
      }

      localStorage.setItem(`farm_history_${user.id}`, JSON.stringify(farmHistory))

      setSuccess("Farm information saved successfully!")
    } catch (err) {
      setError("Failed to save farm information")
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Farm Information</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Record your farm details for {new Date().getFullYear()}. This information helps generate personalized
              recommendations.
            </p>
          </div>

          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tractor className="mr-2 h-5 w-5 text-blue-600" />
                Farm Details ({new Date().getFullYear()})
              </CardTitle>
              <CardDescription>Enter your current farm information and growing conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="acres">Acres of Land *</Label>
                    <Input
                      id="acres"
                      type="number"
                      step="0.1"
                      value={formData.acres}
                      onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                      placeholder="e.g., 25.5"
                      required
                    />
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type *</Label>
                    <Select
                      value={formData.soilType}
                      onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                        <SelectItem value="peaty">Peaty</SelectItem>
                        <SelectItem value="chalky">Chalky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landMoisture">Land Moisture</Label>
                    <Select
                      value={formData.landMoisture}
                      onValueChange={(value) => setFormData({ ...formData, landMoisture: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select moisture level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-dry">Very Dry</SelectItem>
                        <SelectItem value="dry">Dry</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="moist">Moist</SelectItem>
                        <SelectItem value="very-moist">Very Moist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fertilizer">Fertilizer Type</Label>
                    <Select
                      value={formData.fertilizer}
                      onValueChange={(value) => setFormData({ ...formData, fertilizer: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select fertilizer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="synthetic">Synthetic</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waterAvailability">Water Availability</Label>
                    <Select
                      value={formData.waterAvailability}
                      onValueChange={(value) => setFormData({ ...formData, waterAvailability: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select input" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abundant">Abundant</SelectItem>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="scarce">Scarce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <Select
                      value={formData.season}
                      onValueChange={(value) => setFormData({ ...formData, season: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select input" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="autumn">Autumn</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cropsGrown">Crops Grown</Label>
                  <Input
                    id="cropsGrown"
                    type="text"
                    value={formData.cropsGrown}
                    onChange={(e) => setFormData({ ...formData, cropsGrown: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                    placeholder="e.g., Wheat, Corn, Soybeans, Tomatoes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 min-h-[100px]"
                    placeholder="Any additional information about your farm, challenges, or goals..."
                  />
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
                  {loading ? "Saving..." : "Save Farm Record"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
