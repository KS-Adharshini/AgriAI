"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { Bug, ThumbsUp, ThumbsDown, IndianRupee, Plus, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"

// Crop-specific pesticide recommendations
const CROP_PESTICIDE_DATA = {
  wheat: {
    recommended: [
      {
        name: "Tebuconazole",
        cost: 3375, // 45 USD * 75 INR
        effectiveness: 4.8,
        safety: 4.2,
        description: "Fungicide for wheat rust and powdery mildew control",
        application: "2-3 applications during growing season",
      },
      {
        name: "Imidacloprid",
        cost: 2850, // 38 USD * 75 INR
        effectiveness: 4.6,
        safety: 4.0,
        description: "Systemic insecticide for aphid and termite control",
        application: "Seed treatment or soil application",
      },
      {
        name: "2,4-D",
        cost: 3150, // 42 USD * 75 INR
        effectiveness: 4.5,
        safety: 3.8,
        description: "Selective herbicide for broadleaf weed control",
        application: "Post-emergence application",
      },
    ],
    notRecommended: [
      { name: "DDT", cost: 1125, effectiveness: 1.2, safety: 1.0, description: "Banned organochlorine insecticide" },
      { name: "Aldrin", cost: 1350, effectiveness: 1.4, safety: 1.1, description: "Persistent organic pollutant" },
    ],
    specificNotes: "Wheat requires protection against rust diseases and aphids. Use systemic fungicides early in the season."
  },
  corn: {
    recommended: [
      {
        name: "Atrazine",
        cost: 2850, // 38 USD * 75 INR
        effectiveness: 4.6,
        safety: 4.0,
        description: "Pre-emergence herbicide for corn and sorghum",
        application: "Pre-plant or pre-emergence",
      },
      {
        name: "Glyphosate",
        cost: 3375, // 45 USD * 75 INR
        effectiveness: 4.8,
        safety: 4.2,
        description: "Post-emergence herbicide for weed control",
        application: "Post-emergence when weeds are 4-6 inches",
      },
      {
        name: "Bifenthrin",
        cost: 4125, // 55 USD * 75 INR
        effectiveness: 4.4,
        safety: 4.1,
        description: "Pyrethroid insecticide for corn borer control",
        application: "Apply during tasseling stage",
      },
    ],
    notRecommended: [
      { name: "Endrin", cost: 1650, effectiveness: 1.6, safety: 1.2, description: "Highly toxic cyclodiene insecticide" },
      { name: "Chlordane", cost: 1500, effectiveness: 1.8, safety: 1.3, description: "Banned organochlorine compound" },
    ],
    specificNotes: "Corn is susceptible to corn borer and weed competition. Use pre-emergence herbicides and monitor for pests."
  },
  rice: {
    recommended: [
      {
        name: "Carbendazim",
        cost: 3000, // 40 USD * 75 INR
        effectiveness: 4.7,
        safety: 4.3,
        description: "Fungicide for rice blast disease control",
        application: "3-4 applications during growing season",
      },
      {
        name: "Chlorpyrifos",
        cost: 2625, // 35 USD * 75 INR
        effectiveness: 4.5,
        safety: 3.9,
        description: "Insecticide for stem borer control",
        application: "Apply during tillering and flowering",
      },
      {
        name: "Butachlor",
        cost: 2250, // 30 USD * 75 INR
        effectiveness: 4.4,
        safety: 4.0,
        description: "Pre-emergence herbicide for rice fields",
        application: "Pre-plant or pre-emergence",
      },
    ],
    notRecommended: [
      { name: "Heptachlor", cost: 1875, effectiveness: 2.0, safety: 1.5, description: "Restricted use pesticide" },
      { name: "DDT", cost: 1125, effectiveness: 1.2, safety: 1.0, description: "Banned organochlorine insecticide" },
    ],
    specificNotes: "Rice requires protection against blast disease and stem borers. Use fungicides preventively and monitor water levels."
  },
  soybeans: {
    recommended: [
      {
        name: "Glyphosate",
        cost: 3375, // 45 USD * 75 INR
        effectiveness: 4.8,
        safety: 4.2,
        description: "Broad-spectrum herbicide for weed control",
        application: "Post-emergence application",
      },
      {
        name: "Atrazine",
        cost: 2850, // 38 USD * 75 INR
        effectiveness: 4.6,
        safety: 4.0,
        description: "Pre-emergence herbicide for broadleaf weeds",
        application: "Pre-plant or pre-emergence",
      },
      {
        name: "2,4-D",
        cost: 3150, // 42 USD * 75 INR
        effectiveness: 4.5,
        safety: 3.8,
        description: "Selective herbicide for broadleaf weeds",
        application: "Post-emergence application",
      },
    ],
    notRecommended: [
      { name: "DDT", cost: 1125, effectiveness: 1.2, safety: 1.0, description: "Banned organochlorine insecticide" },
      { name: "Aldrin", cost: 1350, effectiveness: 1.4, safety: 1.1, description: "Persistent organic pollutant" },
    ],
    specificNotes: "Soybeans are nitrogen-fixing legumes. Use herbicides carefully to avoid damaging beneficial bacteria."
  },
  tomatoes: {
    recommended: [
      {
        name: "Copper Oxychloride",
        cost: 1875, // 25 USD * 75 INR
        effectiveness: 4.3,
        safety: 4.5,
        description: "Fungicide for early blight and bacterial diseases",
        application: "Weekly applications during wet weather",
      },
      {
        name: "Spinosad",
        cost: 3750, // 50 USD * 75 INR
        effectiveness: 4.6,
        safety: 4.4,
        description: "Biological insecticide for caterpillar control",
        application: "Apply when pests are detected",
      },
      {
        name: "Neem Oil",
        cost: 1500, // 20 USD * 75 INR
        effectiveness: 3.8,
        safety: 4.8,
        description: "Natural insecticide and fungicide",
        application: "Weekly applications as preventive measure",
      },
    ],
    notRecommended: [
      { name: "Methyl Parathion", cost: 2250, effectiveness: 2.5, safety: 1.8, description: "Highly toxic organophosphate" },
      { name: "Endosulfan", cost: 1875, effectiveness: 2.8, safety: 1.6, description: "Banned organochlorine compound" },
    ],
    specificNotes: "Tomatoes are sensitive to chemical pesticides. Use organic options when possible and rotate fungicides to prevent resistance."
  },
  // Default data for other crops
  default: {
    recommended: [
      {
        name: "Glyphosate",
        cost: 3375, // 45 USD * 75 INR
        effectiveness: 4.8,
        safety: 4.2,
        description: "Broad-spectrum herbicide for weed control",
        application: "Post-emergence application",
      },
      {
        name: "Atrazine",
        cost: 2850, // 38 USD * 75 INR
        effectiveness: 4.6,
        safety: 4.0,
        description: "Pre-emergence herbicide for broadleaf weeds",
        application: "Pre-plant or pre-emergence",
      },
      {
        name: "2,4-D",
        cost: 3150, // 42 USD * 75 INR
        effectiveness: 4.5,
        safety: 3.8,
        description: "Selective herbicide for broadleaf weeds",
        application: "Post-emergence application",
      },
    ],
    notRecommended: [
      { name: "DDT", cost: 1125, effectiveness: 1.2, safety: 1.0, description: "Banned organochlorine insecticide" },
      { name: "Aldrin", cost: 1350, effectiveness: 1.4, safety: 1.1, description: "Persistent organic pollutant" },
    ],
    specificNotes: "General recommendations for crop protection. Always follow label instructions and local regulations."
  }
}

export default function PesticidePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [pesticideData, setPesticideData] = useState(CROP_PESTICIDE_DATA.default)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPesticide, setNewPesticide] = useState({
    name: "",
    cost: "",
    effectiveness: "4.0",
    safety: "4.0",
    description: "",
    application: "",
    category: "recommended"
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Get selected crop from crop selection or farm data
    const cropPlan = localStorage.getItem(`plan_${userData.id}`)
    if (cropPlan) {
      const plan = JSON.parse(cropPlan)
      if (plan.length > 0) {
        const cropKey = plan[0].key
        setSelectedCrop(cropKey)
        setPesticideData(CROP_PESTICIDE_DATA[cropKey as keyof typeof CROP_PESTICIDE_DATA] || CROP_PESTICIDE_DATA.default)
      }
    }
  }, [router])

  const addPesticideAsSeedToCropPlan = (pesticide: any) => {
    if (!user || !selectedCrop) return

    const key = `plan_${user.id}`
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as any[]
    
    // Find the crop in the plan
    const cropIndex = existing.findIndex((c) => c.key === selectedCrop)
    
    if (cropIndex !== -1) {
      // Initialize seeds array if it doesn't exist
      if (!existing[cropIndex].seeds) {
        existing[cropIndex].seeds = []
      }
      
      // Check if pesticide already exists as a seed
      const existingSeedIndex = existing[cropIndex].seeds.findIndex(
        (s: any) => s.name === pesticide.name
      )
      
      if (existingSeedIndex === -1) {
        // Add pesticide as a seed to the crop plan
        const seedToAdd = {
          ...pesticide,
          id: Date.now().toString(),
          addedAt: new Date().toISOString(),
          isCustom: pesticide.isCustom || false
        }
        
        existing[cropIndex].seeds.push(seedToAdd)
        localStorage.setItem(key, JSON.stringify(existing))
        
        setSuccess(`Added ${pesticide.name} as seed to ${selectedCrop} plan!`)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(`${pesticide.name} is already in your ${selectedCrop} plan as a seed`)
        setTimeout(() => setError(""), 3000)
      }
    }
  }

  const addCustomPesticideAsSeedToPlan = () => {
    if (!newPesticide.name || !newPesticide.cost || !newPesticide.description) {
      setError("Please fill in all required fields")
      return
    }

    const pesticide = {
      ...newPesticide,
      cost: Number(newPesticide.cost),
      effectiveness: Number(newPesticide.effectiveness),
      safety: Number(newPesticide.safety),
      isCustom: true
    }

    // Add to crop plan as seed
    addPesticideAsSeedToCropPlan(pesticide)
    
    // Reset form
    setNewPesticide({
      name: "",
      cost: "",
      effectiveness: "4.0",
      safety: "4.0",
      description: "",
      application: "",
      category: "recommended"
    })
    
    setIsAddDialogOpen(false)
    setError("")
  }

  const removePesticideSeedFromPlan = (pesticideName: string) => {
    if (!user || !selectedCrop) return

    const key = `plan_${user.id}`
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as any[]
    
    const cropIndex = existing.findIndex((c) => c.key === selectedCrop)
    
    if (cropIndex !== -1 && existing[cropIndex].seeds) {
      existing[cropIndex].seeds = existing[cropIndex].seeds.filter(
        (s: any) => s.name !== pesticideName
      )
      localStorage.setItem(key, JSON.stringify(existing))
      
      setSuccess(`Removed ${pesticideName} seed from ${selectedCrop} plan`)
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const getEffectivenessColor = (rating: number) => {
    if (rating >= 4.0) return "bg-green-100 text-green-800 border-green-200"
    if (rating >= 3.0) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getSafetyColor = (rating: number) => {
    if (rating >= 4.0) return "text-green-600"
    if (rating >= 3.0) return "text-yellow-600"
    return "text-red-600"
  }

  const isPesticideInPlanAsSeed = (pesticideName: string) => {
    if (!user || !selectedCrop) return false
    
    const key = `plan_${user.id}`
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as any[]
    const crop = existing.find((c) => c.key === selectedCrop)
    
    return crop?.seeds?.some((s: any) => s.name === pesticideName) || false
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pesticide Recommendations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered pesticide analysis for {selectedCrop ? `${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}` : "your selected crop"}
            </p>
            {selectedCrop && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing recommendations specific to {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
              </p>
            )}
          </div>

          {/* Add Custom Pesticide Button */}
          <div className="mb-6 flex justify-end">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Pesticide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Custom Pesticide</DialogTitle>
                  <DialogDescription>
                    Add a new pesticide as seed to your {selectedCrop ? selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1) : "crop"} plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Pesticide Name *</Label>
                    <Input
                      id="name"
                      value={newPesticide.name}
                      onChange={(e) => setNewPesticide({ ...newPesticide, name: e.target.value })}
                      placeholder="Enter pesticide name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per Acre (₹) *</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={newPesticide.cost}
                      onChange={(e) => setNewPesticide({ ...newPesticide, cost: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="effectiveness">Effectiveness (1-5)</Label>
                      <Select
                        value={newPesticide.effectiveness}
                        onValueChange={(value) => setNewPesticide({ ...newPesticide, effectiveness: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.0">1.0</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2.0">2.0</SelectItem>
                          <SelectItem value="2.5">2.5</SelectItem>
                          <SelectItem value="3.0">3.0</SelectItem>
                          <SelectItem value="3.5">3.5</SelectItem>
                          <SelectItem value="4.0">4.0</SelectItem>
                          <SelectItem value="4.5">4.5</SelectItem>
                          <SelectItem value="5.0">5.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="safety">Safety (1-5)</Label>
                      <Select
                        value={newPesticide.safety}
                        onValueChange={(value) => setNewPesticide({ ...newPesticide, safety: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.0">1.0</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2.0">2.0</SelectItem>
                          <SelectItem value="2.5">2.5</SelectItem>
                          <SelectItem value="3.0">3.0</SelectItem>
                          <SelectItem value="3.5">3.5</SelectItem>
                          <SelectItem value="4.0">4.0</SelectItem>
                          <SelectItem value="4.5">4.5</SelectItem>
                          <SelectItem value="5.0">5.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newPesticide.category}
                      onValueChange={(value) => setNewPesticide({ ...newPesticide, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="notRecommended">Not Recommended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newPesticide.description}
                      onChange={(e) => setNewPesticide({ ...newPesticide, description: e.target.value })}
                      placeholder="Describe the pesticide and its use"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="application">Application Method</Label>
                    <Input
                      id="application"
                      value={newPesticide.application}
                      onChange={(e) => setNewPesticide({ ...newPesticide, application: e.target.value })}
                      placeholder="e.g., Post-emergence, Seed treatment"
                    />
                  </div>
                  
                  {error && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addCustomPesticideAsSeedToPlan}>
                      Add as Seed to Crop Plan
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <AlertDescription className="text-green-700 dark:text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Recommended Pesticides */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5 text-green-600" />
                  Top Recommended Pesticides
                </CardTitle>
                <CardDescription>Highly effective and safe pesticides for {selectedCrop || "your crop"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pesticideData.recommended.map((pesticide, index) => {
                  const isInPlan = isPesticideInPlanAsSeed(pesticide.name)
                  return (
                    <div
                      key={pesticide.name}
                      className="p-4 rounded-lg border backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-green-800 dark:text-green-400">
                            #{index + 1} {pesticide.name}
                          </span>
                          <Badge className={getEffectivenessColor(pesticide.effectiveness)}>
                            {pesticide.effectiveness}/5
                          </Badge>
                          {isInPlan && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              In Plan as Seed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">{pesticide.cost}/acre</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pesticide.description}</p>
                      {pesticide.application && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <strong>Application:</strong> {pesticide.application}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span>
                            Effectiveness: <strong>{pesticide.effectiveness}/5</strong>
                          </span>
                          <span className={getSafetyColor(pesticide.safety)}>
                            Safety: <strong>{pesticide.safety}/5</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isInPlan ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePesticideSeedFromPlan(pesticide.name)}
                              className="text-red-600 hover:text-red-700 border-red-200"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Remove Seed
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addPesticideAsSeedToCropPlan(pesticide)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add as Seed
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Pesticides to Avoid */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ThumbsDown className="mr-2 h-5 w-5 text-red-600" />
                  Pesticides to Avoid
                </CardTitle>
                <CardDescription>Pesticides to avoid due to safety or effectiveness concerns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pesticideData.notRecommended.map((pesticide, index) => {
                  const isInPlan = isPesticideInPlanAsSeed(pesticide.name)
                  return (
                    <div
                      key={pesticide.name}
                      className="p-4 rounded-lg border backdrop-blur-sm bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-red-800 dark:text-red-400">
                            #{index + 1} {pesticide.name}
                          </span>
                          <Badge className={getEffectivenessColor(pesticide.effectiveness)}>
                            {pesticide.effectiveness}/5
                          </Badge>
                          {isInPlan && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              In Plan as Seed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4 text-red-600" />
                          <span className="font-semibold text-red-600">{pesticide.cost}/acre</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pesticide.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span>
                            Effectiveness: <strong>{pesticide.effectiveness}/5</strong>
                          </span>
                          <span className={getSafetyColor(pesticide.safety)}>
                            Safety: <strong>{pesticide.safety}/5</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isInPlan ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePesticideSeedFromPlan(pesticide.name)}
                              className="text-red-600 hover:text-red-700 border-red-200"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Remove Seed
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addPesticideAsSeedToCropPlan(pesticide)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add as Seed
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Crop-Specific Notes */}
          {selectedCrop && (
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="mr-2 h-5 w-5 text-blue-600" />
                  {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}-Specific Recommendations
                </CardTitle>
                <CardDescription>Special considerations for {selectedCrop} cultivation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg backdrop-blur-sm bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {pesticideData.specificNotes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety Guidelines */}
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bug className="mr-2 h-5 w-5 text-blue-600" />
                Pesticide Safety Guidelines
              </CardTitle>
              <CardDescription>Important safety information for pesticide use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg backdrop-blur-sm bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Application Safety</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Always wear protective equipment</li>
                    <li>• Follow label instructions precisely</li>
                    <li>• Apply during calm weather conditions</li>
                    <li>• Keep children and pets away</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Environmental Impact</h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Consider impact on beneficial insects</li>
                    <li>• Protect water sources from contamination</li>
                    <li>• Use integrated pest management</li>
                    <li>• Rotate pesticide types to prevent resistance</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Best Practices</h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Monitor pest levels before application</li>
                    <li>• Use minimum effective dosage</li>
                    <li>• Keep detailed application records</li>
                    <li>• Consult with agricultural experts</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg backdrop-blur-sm bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <strong>Note:</strong> Pesticides are now added as seeds to your crop plan. They will appear in the Plan Report section of the sidebar under each crop's seed list.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
