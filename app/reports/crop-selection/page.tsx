"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { Leaf, Sparkles, Plus, Info, IndianRupee } from "lucide-react"
import { useRouter } from "next/navigation"

const CROP_DATABASE = {
  wheat: {
    name: "Wheat",
    water: "moderate",
    soil: ["loamy", "clay"],
    season: ["autumn", "winter"],
    temp: "cool",
    rainfall: "moderate",
    pest: "low",
    seedCostPerAcre: 2250, // ₹ per acre
  },
  corn: {
    name: "Corn",
    water: "high",
    soil: ["loamy", "sandy"],
    season: ["spring", "summer"],
    temp: "warm",
    rainfall: "high",
    pest: "moderate",
    seedCostPerAcre: 3750, // ₹ per acre
  },
  rice: {
    name: "Rice",
    water: "very-high",
    soil: ["clay", "silty"],
    season: ["summer"],
    temp: "warm",
    rainfall: "very-high",
    pest: "high",
    seedCostPerAcre: 1500, // ₹ per acre
  },
  soybeans: {
    name: "Soybeans",
    water: "moderate",
    soil: ["loamy", "sandy"],
    season: ["spring", "summer"],
    temp: "warm",
    rainfall: "moderate",
    pest: "low",
    seedCostPerAcre: 3000, // ₹ per acre
  },
  tomatoes: {
    name: "Tomatoes",
    water: "high",
    soil: ["loamy", "sandy"],
    season: ["spring", "summer"],
    temp: "warm",
    rainfall: "moderate",
    pest: "high",
    seedCostPerAcre: 4500, // ₹ per acre
  },
  potatoes: {
    name: "Potatoes",
    water: "moderate",
    soil: ["sandy", "loamy"],
    season: ["spring", "autumn"],
    temp: "cool",
    rainfall: "moderate",
    pest: "moderate",
    seedCostPerAcre: 6000, // ₹ per acre (seed tubers)
  },
  cotton: {
    name: "Cotton",
    water: "high",
    soil: ["loamy", "clay"],
    season: ["spring", "summer"],
    temp: "hot",
    rainfall: "moderate",
    pest: "high",
    seedCostPerAcre: 1800, // ₹ per acre
  },
  barley: {
    name: "Barley",
    water: "low",
    soil: ["loamy", "sandy"],
    season: ["autumn", "winter"],
    temp: "cool",
    rainfall: "low",
    pest: "low",
    seedCostPerAcre: 1950, // ₹ per acre
  },
  carrots: {
    name: "Carrots",
    water: "moderate",
    soil: ["sandy", "loamy"],
    season: ["spring", "autumn"],
    temp: "cool",
    rainfall: "moderate",
    pest: "low",
    seedCostPerAcre: 1200, // ₹ per acre
  },
  lettuce: {
    name: "Lettuce",
    water: "high",
    soil: ["loamy", "sandy"],
    season: ["spring", "autumn"],
    temp: "cool",
    rainfall: "moderate",
    pest: "moderate",
    seedCostPerAcre: 900, // ₹ per acre
  },
}

const CROP_INFO: Record<string, {
  duration: string
  famousRegions: string
  origin: string
  notes: string[]
}> = {
  corn: {
    duration: "90–120 days from sowing to harvest depending on variety and climate",
    famousRegions: "USA Midwest, Brazil, India (Punjab, Karnataka), China",
    origin: "Domesticated from teosinte in Mesoamerica",
    notes: [
      "Thrives in warm temperatures with adequate moisture.",
      "Responds well to nitrogen-rich soils.",
      "Row spacing and timely weeding are critical for yield.",
      "Susceptible to fall armyworm; monitor and manage early.",
      "Best planted after last frost and when soil is warm.",
      "Requires full sun; shade reduces cob development.",
      "Irrigate during tasseling and silking stages.",
      "Rotate with legumes to improve soil fertility.",
      "Harvest when husks brown and kernels are firm.",
      "Used for food, feed, starch, and biofuel."
    ]
  },
  soybeans: {
    duration: "100–130 days",
    famousRegions: "USA, Brazil, Argentina, India (Madhya Pradesh)",
    origin: "East Asia",
    notes: [
      "Nitrogen-fixing legume that enriches soil.",
      "Prefers warm conditions with moderate rainfall.",
      "Well-drained loamy soils increase nodulation.",
      "Sensitive to waterlogging; ensure drainage.",
      "Critical stages: flowering and pod filling.",
      "Watch for rust and aphids; use IPM.",
      "Timely inoculation improves yields.",
      "Spacing affects branching and pods.",
      "Harvest when pods turn brown and seeds rattle.",
      "Major source of protein and oil."
    ]
  },
  tomatoes: {
    duration: "70–100 days (transplant to harvest)",
    famousRegions: "Italy, California, India (Maharashtra, Karnataka)",
    origin: "Western South America",
    notes: [
      "Need warm temperatures and consistent watering.",
      "Stake or cage for better airflow and fruit quality.",
      "Calcium balance prevents blossom-end rot.",
      "Mulch to reduce soil-borne diseases.",
      "Prune indeterminate varieties for vigor.",
      "Pollination improves with gentle shaking.",
      "Rotate to avoid wilt and nematodes.",
      "Avoid overhead irrigation to limit blight.",
      "Harvest at breaker stage for transport.",
      "Good for fresh market and processing."
    ]
  },
  rice: {
    duration: "110–150 days depending on variety",
    famousRegions: "South and Southeast Asia, China",
    origin: "Yangtze River basin (Oryza sativa)",
    notes: [
      "Requires standing water or controlled irrigation.",
      "Transplanting or direct seeding used.",
      "Pest vigilance: stem borer, blast disease.",
      "Balanced NPK crucial for tillering.",
      "Flood management reduces weeds.",
      "Drain fields before harvest for drying.",
      "Silica-rich soils strengthen stems.",
      "Alternate wetting and drying saves water.",
      "Harvest at 20–24% grain moisture.",
      "Primary staple food for half the world."
    ]
  },
  wheat: {
    duration: "110–130 days",
    famousRegions: "USA Great Plains, India (Punjab, UP), Russia",
    origin: "Fertile Crescent",
    notes: [
      "Cool-season cereal grown in rabi/winter.",
      "Prefers well-drained loams.",
      "Timely sowing ensures proper tillering.",
      "Adequate nitrogen at crown root initiation.",
      "Watch for rust; use resistant varieties.",
      "Irrigate at crown root initiation and ear emergence.",
      "Control weeds early to avoid yield loss.",
      "Avoid lodging by balanced fertilizer.",
      "Harvest when grains hard and straw yellow.",
      "Stored at <12% moisture."
    ]
  },
  potatoes: {
    duration: "80–120 days",
    famousRegions: "Peru (origin), India (Nilgiris), Europe",
    origin: "Andean region of South America",
    notes: [
      "Cool temperatures favor tuber development.",
      "Hilling protects tubers from greening.",
      "Consistent moisture avoids hollow heart.",
      "Seed tuber quality is critical.",
      "Late blight is a key disease to manage.",
      "Avoid high nitrogen late in season.",
      "Harvest after vines die back.",
      "Cure tubers before storage.",
      "Store cool (4–8°C) and dark.",
      "Versatile food crop worldwide."
    ]
  },
  cotton: {
    duration: "150–180 days",
    famousRegions: "India (Gujarat), USA (Texas), China",
    origin: "Tropics and subtropics worldwide",
    notes: [
      "Requires long frost-free period.",
      "Sensitive to water stress at flowering.",
      "Bollworm and sucking pests common.",
      "Use Bt or IPM for pest control.",
      "Avoid waterlogging.",
      "Defoliation aids mechanical harvest.",
      "Requires full sun and heat.",
      "Balanced fertilization essential.",
      "Ginning quality depends on harvest timing.",
      "Cash crop for fiber industry."
    ]
  },
  barley: {
    duration: "90–120 days",
    famousRegions: "Europe, Canada, India (Rajasthan)",
    origin: "Fertile Crescent",
    notes: [
      "Tolerates drought and salinity better than wheat.",
      "Used for malt, feed, and food.",
      "Prefers cool, dry climates.",
      "Early sowing improves yield.",
      "Avoid lodging via moderate nitrogen.",
      "Watch for leaf rust and smut.",
      "Well-drained soils preferred.",
      "Swathing helps uniform ripening.",
      "Harvest when kernels firm.",
      "Dry well before storage."
    ]
  },
  carrots: {
    duration: "70–90 days",
    famousRegions: "Netherlands, USA, India (Punjab)",
    origin: "Central Asia",
    notes: [
      "Cool-season root crop; prefers sandy loam.",
      "Fine seed needs shallow sowing.",
      "Keep soil uniformly moist.",
      "Thinning prevents forked roots.",
      "Avoid fresh manure to reduce branching.",
      "Mulch to maintain moisture.",
      "Harvest when roots reach desired size.",
      "High in beta-carotene.",
      "Store cool and humid.",
      "Good for fresh and processing."
    ]
  },
  lettuce: {
    duration: "45–70 days",
    famousRegions: "USA (California), Europe",
    origin: "Mediterranean",
    notes: [
      "Prefers cool weather; bolts in heat.",
      "Shallow roots need frequent irrigation.",
      "Avoid bitter taste with steady growth.",
      "Use shade nets in hot climates.",
      "Spacing affects head size.",
      "Harvest in early morning.",
      "Sensitive to salinity.",
      "Good for salads and wraps.",
      "Multiple types: leaf, romaine, head.",
      "Short shelf-life; keep cool."
    ]
  }
}

export default function CropSelectionPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    water: "",
    soil: "",
    labor: "",
    storage: "",
    preference: "",
    fertilizer: "",
    pestRisk: "",
  })
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null)
  const [validationError, setValidationError] = useState("")

  const addToPlan = (crop: any) => {
    if (!user) return
    const key = `plan_${user.id}`
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as any[]
    if (!existing.find((c) => c.key === crop.key)) {
      existing.push({ key: crop.key, name: crop.name, addedAt: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(existing))
    }
          // Navigate to Plan Report page after add
      router.push("/history")
  }

  const viewDetails = async (crop: any) => {
    try {
      // fetch from public JSON
      const res = await fetch("/crops.json", { cache: "no-cache" })
      const data = await res.json()
      const found = (data as any[]).find((c) => c.id === crop.key)
      setSelectedCrop({
        key: crop.key,
        name: found?.name || crop.name,
        water: found?.water || crop.water,
        soil: found?.soil || crop.soil,
        season: found?.season || crop.season,
        pest: found?.pestRisk || crop.pest,
        description: found?.description || undefined,
        temp: crop.temp,
        rainfall: crop.rainfall,
        seedCostPerAcre: crop.seedCostPerAcre,
      })
      const el = document.getElementById("crop-details")
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    } catch (e) {
      setSelectedCrop(crop)
    }
  }

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load farm data to pre-fill form
    const farm = localStorage.getItem(`farm_${userData.id}`)
    if (farm) {
      const farmData = JSON.parse(farm)
      setFormData({
        water: farmData.waterAvailability || "",
        soil: farmData.soilType || "",
        labor: "",
        storage: "",
        preference: "",
        fertilizer: farmData.fertilizer || "",
        pestRisk: farmData.pestRisk || "",
      })
    }
  }, [router])

  const validateForm = () => {
    const requiredFields = [
      { field: 'water', label: 'Water Availability' },
      { field: 'soil', label: 'Soil Type' },
      { field: 'labor', label: 'Labor Availability' },
      { field: 'storage', label: 'Storage & Infrastructure' },
      { field: 'preference', label: 'Crop Preference' },
      { field: 'pestRisk', label: 'Pest Risk' }
    ]

    const missingFields = requiredFields.filter(({ field }) => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(({ label }) => label).join(', ')
      setValidationError(`Please choose all the required values before getting recommendations. Missing: ${missingLabels}`)
      return false
    }
    
    setValidationError("")
    return true
  }

  const generateRecommendations = () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    // AI simulation - match crops based on conditions
    const scored = Object.entries(CROP_DATABASE).map(([key, crop]) => {
      let score = 0

      // Water availability match
      if (formData.water === crop.water) score += 3
      else if (
        (formData.water === "abundant" && crop.water === "high") ||
        (formData.water === "adequate" && crop.water === "moderate")
      )
        score += 2

      // Soil type match
      if (crop.soil.includes(formData.soil)) score += 3

      // Labor availability preference
      const laborIntensity: Record<string, "low" | "medium" | "high"> = {
        wheat: "medium",
        corn: "high",
        rice: "high",
        soybeans: "medium",
        tomatoes: "high",
        potatoes: "medium",
        cotton: "high",
        barley: "low",
        carrots: "medium",
        lettuce: "high",
      }
      const cropLabor = laborIntensity[key] || "medium"
      if (formData.labor === "adequate") {
        if (cropLabor === "high") score += 2
        else if (cropLabor === "medium") score += 1
      } else if (formData.labor === "limited") {
        if (cropLabor === "low") score += 2
        else if (cropLabor === "medium") score += 1
      } else if (formData.labor === "family-only") {
        if (cropLabor === "low") score += 2
        else if (cropLabor === "medium") score += 1
        else score -= 1
      }

      // Storage & infrastructure preference
      const storageCategory: Record<string, "store-well" | "perishable"> = {
        wheat: "store-well",
        corn: "store-well",
        rice: "store-well",
        soybeans: "store-well",
        cotton: "store-well",
        barley: "store-well",
        potatoes: "store-well",
        tomatoes: "perishable",
        carrots: "perishable",
        lettuce: "perishable",
      }
      const cropStorage = storageCategory[key] || "store-well"
      if (formData.storage === "on-farm") {
        if (cropStorage === "store-well") score += 2
        else score += 1
      } else if (formData.storage === "shared") {
        if (cropStorage === "store-well") score += 2
        else score += 1
      } else if (formData.storage === "none") {
        if (cropStorage === "perishable") score += 2
        else score -= 1
      }

      // Crop preference (organic vs conventional)
      if (formData.preference === "organic") {
        if (crop.pest === "low") score += 2
        else if (crop.pest === "moderate") score += 1
        else score -= 1
      } else if (formData.preference === "conventional") {
        score += 1
      }

      // Pest risk consideration (lower pest risk crops get bonus)
      if (formData.pestRisk === "high" && crop.pest === "low") score += 2
      if (formData.pestRisk === "low" && crop.pest === "low") score += 1

      return { ...crop, key, score }
    })

    // Sort by score and take top recommendations
    const topRecommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((crop, index) => ({
        ...crop,
        confidence: Math.max(60, Math.min(95, crop.score * 15 + Math.random() * 10)),
        rank: index + 1,
      }))

    setTimeout(() => {
      setRecommendations(topRecommendations)
      setLoading(false)
    }, 1500) // Simulate AI processing time
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-100 text-green-800 border-green-200"
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Crop Selection</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized crop recommendations based on your farm conditions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-green-600" />
                  Farm Conditions
                </CardTitle>
                <CardDescription>Enter your current farm conditions for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Water Availability *</Label>
                    <Select
                      value={formData.water}
                      onValueChange={(value) => setFormData({ ...formData, water: value })}
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
                    <Label>Soil Type *</Label>
                    <Select value={formData.soil} onValueChange={(value) => setFormData({ ...formData, soil: value })}>
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Labor Availability *</Label>
                    <Select
                      value={formData.labor}
                      onValueChange={(value) => setFormData({ ...formData, labor: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select labor availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adequate">Adequate labor</SelectItem>
                        <SelectItem value="limited">Limited labor</SelectItem>
                        <SelectItem value="family-only">Family-only labor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Storage & Infrastructure *</Label>
                    <Select
                      value={formData.storage}
                      onValueChange={(value) => setFormData({ ...formData, storage: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select storage/infrastructure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-farm">On-farm storage</SelectItem>
                        <SelectItem value="shared">Shared warehouse</SelectItem>
                        <SelectItem value="none">No storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Crop Preference *</Label>
                    <Select
                      value={formData.preference}
                      onValueChange={(value) => setFormData({ ...formData, preference: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select crop preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organic">Organic farming</SelectItem>
                        <SelectItem value="conventional">Conventional farming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Pest Risk *</Label>
                    <Select
                      value={formData.pestRisk}
                      onValueChange={(value) => setFormData({ ...formData, pestRisk: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select pest risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {validationError && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertDescription className="text-red-700 dark:text-red-400">{validationError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={generateRecommendations}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {loading ? "Analyzing..." : "Get AI Recommendations"}
                </Button>

                {/* Selected Crop Details */}
                {selectedCrop && (
                  <div id="crop-details" className="mt-2 p-4 rounded-lg border bg-white/60 dark:bg-gray-800/60">
                    <h3 className="text-lg font-semibold mb-2">{selectedCrop.name} Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <p><strong>Water needs:</strong> input</p>
                      <p><strong>Soil:</strong> {selectedCrop.soil.join(", ")}</p>
                      <p><strong>Pest risk:</strong> {selectedCrop.pest}</p>
                      {selectedCrop.seedCostPerAcre && (
                        <p className="col-span-2">
                          <strong>Seed cost per acre:</strong> 
                          <span className="ml-2 text-green-600 font-semibold">
                            <IndianRupee className="inline h-4 w-4 mr-1" />
                            {selectedCrop.seedCostPerAcre.toLocaleString()}
                          </span>
                        </p>
                      )}
                    </div>
                    {selectedCrop?.description && (
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        <h4 className="font-semibold mb-1">Description</h4>
                        <p>{selectedCrop.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized crop suggestions for your farm</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2">AI is analyzing your conditions...</span>
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((crop) => (
                      <div
                        key={crop.key}
                        className="p-4 rounded-lg border backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            #{crop.rank} {crop.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getConfidenceColor(crop.confidence)}>
                              {crop.confidence.toFixed(0)}% Match
                            </Badge>
                            <Button size="icon" variant="ghost" onClick={() => addToPlan(crop)} aria-label="Add">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Seed Cost Information - Below Match Section */}
                        <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Seed cost per acre:</strong>
                            <span className="ml-2 font-semibold">
                              <IndianRupee className="inline h-4 w-4 mr-1" />
                              {crop.seedCostPerAcre?.toLocaleString() || "N/A"}
                            </span>
                          </p>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>
                            <strong>Water needs:</strong> input
                          </p>
                          <p>
                            <strong>Soil:</strong> {crop.soil.join(", ")}
                          </p>
                          <p>
                            <strong>Season:</strong> input
                          </p>
                          <p>
                            <strong>Pest risk:</strong> {crop.pest}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button className="bg-green-600 hover:bg-green-700" onClick={() => addToPlan(crop)}>
                            <Plus className="h-4 w-4 mr-2" /> Add to Plan
                          </Button>
                          <Button variant="outline" onClick={() => viewDetails(crop)}>
                            <Info className="h-4 w-4 mr-2" /> View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">
                    Fill in all the required farm conditions and click "Get AI Recommendations" to see personalized crop suggestions.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
