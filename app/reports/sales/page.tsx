"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { Truck, TrendingUp, MapPin, IndianRupee, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"

// Random Indian locations for different regions
const INDIAN_LOCATIONS = {
  "North Region": ["Punjab", "Haryana", "Uttar Pradesh", "Delhi", "Jammu & Kashmir", "Himachal Pradesh", "Uttarakhand"],
  "East Region": ["West Bengal", "Bihar", "Jharkhand", "Odisha", "Assam", "Sikkim", "Arunachal Pradesh"],
  "South Region": ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana", "Puducherry"],
  "West Region": ["Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Goa", "Dadra & Nagar Haveli"],
  "Central Region": ["Madhya Pradesh", "Chhattisgarh", "Uttar Pradesh", "Bihar", "Jharkhand"]
}

// Crop-specific sales data
const CROP_SALES_DATA = {
  wheat: [
    {
      location: "Punjab",
      transport: "YES",
      priceRange: "₹183.75 - ₹250.50",
      avgPrice: 216.75,
      volume: "1,250 tons",
      trend: "up",
    },
    {
      location: "Haryana",
      transport: "YES",
      priceRange: "₹200.25 - ₹234.00",
      avgPrice: 217.50,
      volume: "1,180 tons",
      trend: "up",
    },
    {
      location: "Uttar Pradesh",
      transport: "YES",
      priceRange: "₹216.75 - ₹242.25",
      avgPrice: 229.50,
      volume: "1,100 tons",
      trend: "down",
    },
    {
      location: "Delhi",
      transport: "YES",
      priceRange: "₹200.25 - ₹221.25",
      avgPrice: 210.75,
      volume: "980 tons",
      trend: "up",
    },
    {
      location: "Himachal Pradesh",
      transport: "YES",
      priceRange: "₹183.75 - ₹208.50",
      avgPrice: 196.50,
      volume: "920 tons",
      trend: "up",
    },
  ],
  corn: [
    {
      location: "West Bengal",
      transport: "YES",
      priceRange: "₹208.50 - ₹275.25",
      avgPrice: 241.88,
      volume: "1,450 tons",
      trend: "up",
    },
    {
      location: "Bihar",
      transport: "YES",
      priceRange: "₹221.25 - ₹258.75",
      avgPrice: 240.00,
      volume: "1,380 tons",
      trend: "up",
    },
    {
      location: "Jharkhand",
      transport: "YES",
      priceRange: "₹242.25 - ₹275.25",
      avgPrice: 258.75,
      volume: "1,300 tons",
      trend: "down",
    },
    {
      location: "Odisha",
      transport: "YES",
      priceRange: "₹221.25 - ₹242.25",
      avgPrice: 231.75,
      volume: "1,200 tons",
      trend: "up",
    },
    {
      location: "Assam",
      transport: "YES",
      priceRange: "₹200.25 - ₹221.25",
      avgPrice: 210.75,
      volume: "1,100 tons",
      trend: "up",
    },
  ],
  rice: [
    {
      location: "Karnataka",
      transport: "YES",
      priceRange: "₹159.00 - ₹225.75",
      avgPrice: 192.38,
      volume: "2,100 tons",
      trend: "up",
    },
    {
      location: "Tamil Nadu",
      transport: "YES",
      priceRange: "₹175.50 - ₹208.50",
      avgPrice: 192.00,
      volume: "2,050 tons",
      trend: "up",
    },
    {
      location: "Kerala",
      transport: "YES",
      priceRange: "₹191.25 - ₹225.75",
      avgPrice: 208.50,
      volume: "1,950 tons",
      trend: "down",
    },
    {
      location: "Andhra Pradesh",
      transport: "YES",
      priceRange: "₹175.50 - ₹191.25",
      avgPrice: 183.38,
      volume: "1,850 tons",
      trend: "up",
    },
    {
      location: "Telangana",
      transport: "YES",
      priceRange: "₹159.00 - ₹175.50",
      avgPrice: 167.25,
      volume: "1,750 tons",
      trend: "up",
    },
  ],
  soybeans: [
    {
      location: "Madhya Pradesh",
      transport: "YES",
      priceRange: "₹183.75 - ₹250.50",
      avgPrice: 216.75,
      volume: "1,250 tons",
      trend: "up",
    },
    {
      location: "Chhattisgarh",
      transport: "YES",
      priceRange: "₹200.25 - ₹234.00",
      avgPrice: 217.50,
      volume: "1,180 tons",
      trend: "up",
    },
    {
      location: "Uttar Pradesh",
      transport: "YES",
      priceRange: "₹216.75 - ₹242.25",
      avgPrice: 229.50,
      volume: "1,100 tons",
      trend: "down",
    },
  ]
}

export default function SalesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [salesData, setSalesData] = useState<any[]>([])
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false)
  const [newLocation, setNewLocation] = useState({
    name: "",
    region: "North Region",
    transport: "YES",
    priceRange: "",
    avgPrice: "",
    volume: ""
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
        setSalesData(CROP_SALES_DATA[cropKey as keyof typeof CROP_SALES_DATA] || [])
      }
    }
  }, [router])

  const addLocationToCropPlan = (locationData: any) => {
    if (!user || !selectedCrop) return

    const key = `plan_${user.id}`
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as any[]
    
    // Find the crop in the plan
    const cropIndex = existing.findIndex((c) => c.key === selectedCrop)
    
    if (cropIndex !== -1) {
      // Initialize locations array if it doesn't exist
      if (!existing[cropIndex].locations) {
        existing[cropIndex].locations = []
      }
      
      // Check if location already exists
      const existingLocationIndex = existing[cropIndex].locations.findIndex(
        (l: any) => l.name === locationData.name && l.region === locationData.region
      )
      
      if (existingLocationIndex === -1) {
        // Add new location to the crop plan
        const locationToAdd = {
          ...locationData,
          id: Date.now().toString(),
          addedAt: new Date().toISOString(),
          isCustom: true
        }
        
        existing[cropIndex].locations.push(locationToAdd)
        localStorage.setItem(key, JSON.stringify(existing))
        
        setSuccess(`Added ${locationData.name}, ${locationData.region} to ${selectedCrop} plan!`)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(`${locationData.name}, ${locationData.region} is already in your ${selectedCrop} plan`)
        setTimeout(() => setSuccess(""), 3000)
      }
    }
  }

  const addCustomLocationToPlan = () => {
    if (!newLocation.name || !newLocation.priceRange || !newLocation.avgPrice || !newLocation.volume) {
      setError("Please fill in all required fields")
      return
    }

    const locationData = {
      ...newLocation,
      avgPrice: Number(newLocation.avgPrice),
      priceRange: `₹${newLocation.priceRange}`,
      volume: `${newLocation.volume} tons`
    }

    // Add to crop plan
    addLocationToCropPlan(locationData)
    
    // Reset form
    setNewLocation({
      name: "",
      region: "North Region",
      transport: "YES",
      priceRange: "",
      avgPrice: "",
      volume: ""
    })
    
    setIsAddLocationDialogOpen(false)
    setError("")
  }

  const getRandomIndianLocation = (region: string) => {
    const locations = INDIAN_LOCATIONS[region as keyof typeof INDIAN_LOCATIONS] || INDIAN_LOCATIONS["North Region"]
    return locations[Math.floor(Math.random() * locations.length)]
  }

  const addRandomLocationToCrop = (region: string) => {
    const randomLocation = getRandomIndianLocation(region)
    const randomPrice = Math.floor(Math.random() * (300 - 150) + 150)
    const randomVolume = Math.floor(Math.random() * (2000 - 500) + 500)
    
    const locationData = {
      name: randomLocation,
      region: region,
      transport: "YES",
      priceRange: `₹${randomPrice - 25} - ₹${randomPrice + 25}`,
      avgPrice: randomPrice,
      volume: `${randomVolume} tons`
    }

    addLocationToCropPlan(locationData)
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    )
  }

  const getTransportBadge = (hasTransport: string) => {
    return hasTransport === "YES" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">Not Available</Badge>
    )
  }

  const getPriceColor = (price: number) => {
    if (price >= 225.0) return "text-green-600 font-semibold"
    if (price >= 180.0) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  // Helper function to determine region from location
  const getRegionFromLocation = (location: string) => {
    for (const [region, cities] of Object.entries(INDIAN_LOCATIONS)) {
      if ((cities as string[]).includes(location)) {
        return region
      }
    }
    return "Other Region"
  }

  // Group data by location for summary
  const locationStats = (salesData || []).reduce((acc: any, item: any) => {
    const region = getRegionFromLocation(item.location)
    if (!acc[region]) {
      acc[region] = { totalVolume: 0, avgPrice: 0, count: 0 }
    }
    acc[region].totalVolume += Number.parseInt(item.volume.replace(/[^\d]/g, ""))
    acc[region].avgPrice += item.avgPrice
    acc[region].count += 1
    return acc
  }, {} as any)

  Object.keys(locationStats).forEach((region) => {
    locationStats[region].avgPrice = locationStats[region].avgPrice / locationStats[region].count
  })

  if (!user) {
    return <div>Loading...</div>
  }

  const getCropDisplayName = (cropKey: string) => {
    const cropNames: Record<string, string> = {
      wheat: "Wheat",
      corn: "Corn",
      rice: "Rice",
      tomatoes: "Tomatoes",
      soybeans: "Soybeans",
      potatoes: "Potatoes",
      cotton: "Cotton",
      barley: "Barley",
      carrots: "Carrots",
      lettuce: "Lettuce"
    }
    return cropNames[cropKey] || cropKey.charAt(0).toUpperCase() + cropKey.slice(1)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sales & Transportation Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Historical sales data and transportation insights for {selectedCrop ? getCropDisplayName(selectedCrop) : "your selected crop"}
            </p>
            {selectedCrop && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing data specific to {getCropDisplayName(selectedCrop)}
              </p>
            )}
          </div>

          {/* Add Custom Location Button */}
          <div className="mb-6 flex justify-end">
            <Dialog open={isAddLocationDialogOpen} onOpenChange={setIsAddLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Custom Location</DialogTitle>
                  <DialogDescription>
                    Add a new location to your {selectedCrop ? getCropDisplayName(selectedCrop) : "crop"} plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name *</Label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      placeholder="e.g., Mumbai, Bangalore"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      value={newLocation.region}
                      onValueChange={(value) => setNewLocation({ ...newLocation, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North Region">North Region</SelectItem>
                        <SelectItem value="East Region">East Region</SelectItem>
                        <SelectItem value="South Region">South Region</SelectItem>
                        <SelectItem value="West Region">West Region</SelectItem>
                        <SelectItem value="Central Region">Central Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Availability</Label>
                    <Select
                      value={newLocation.transport}
                      onValueChange={(value) => setNewLocation({ ...newLocation, transport: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">Available</SelectItem>
                        <SelectItem value="NO">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceRange">Price Range (₹) *</Label>
                      <Input
                        id="priceRange"
                        value={newLocation.priceRange}
                        onChange={(e) => setNewLocation({ ...newLocation, priceRange: e.target.value })}
                        placeholder="e.g., 150-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avgPrice">Average Price (₹) *</Label>
                      <Input
                        id="avgPrice"
                        type="number"
                        value={newLocation.avgPrice}
                        onChange={(e) => setNewLocation({ ...newLocation, avgPrice: e.target.value })}
                        placeholder="175"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="volume">Volume (tons) *</Label>
                      <Input
                        id="volume"
                        type="number"
                        value={newLocation.volume}
                        onChange={(e) => setNewLocation({ ...newLocation, volume: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                  
                  {error && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddLocationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addCustomLocationToPlan}>
                      Add to Crop Plan
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(locationStats || {})
              .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.avgPrice - a.avgPrice)
              .slice(0, 4)
              .map(([region, stats]: [string, any]) => (
                <Card key={region} className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{region}</CardTitle>
                    <CardDescription>Regional performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Avg Price:</span>
                        <span className={getPriceColor(stats.avgPrice)}>₹{stats.avgPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Volume:</span>
                        <span className="font-semibold">{(stats.totalVolume / 1000).toFixed(1)}K tons</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Sales Data Table */}
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-blue-600" />
                Sales Data Analysis (Past 5 Years)
              </CardTitle>
              <CardDescription>
                Price range per kilogram for {selectedCrop ? getCropDisplayName(selectedCrop) : "wheat"} crop across different regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Add to Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(salesData || []).sort((a: any, b: any) => a.location.localeCompare(b.location)).map(
                    (row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{row.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTransportBadge(row.transport)}</TableCell>
                        <TableCell className="font-mono text-sm">{row.priceRange}</TableCell>
                        <TableCell className={getPriceColor(row.avgPrice)}>₹{row.avgPrice.toFixed(2)}</TableCell>
                        <TableCell>{row.volume}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(row.trend)}
                            <span className={row.trend === "up" ? "text-green-600" : "text-red-600"}>
                              {row.trend === "up" ? "Up" : "Down"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => addRandomLocationToCrop(row.location)}
                            className="bg-green-600 hover:bg-green-700"
                            title={`Add random location from ${row.location} to crop plan`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Transportation Insights */}
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-green-600" />
                Transportation Insights
              </CardTitle>
              <CardDescription>Key findings from sales and transportation data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Transport Advantage</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Regions with transportation access show 15-20% higher average prices, indicating the value of
                    logistics infrastructure.
                  </p>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Regional Performance</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedCrop === "corn" ? "East Region consistently shows highest prices (₹208.50-₹275.25 avg)" : 
                     selectedCrop === "rice" ? "South Region shows competitive pricing (₹159.00-₹225.75 avg)" :
                     "North Region consistently shows highest prices (₹183.75-₹250.50 avg)"}, while South Region has the most
                    price volatility.
                  </p>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">Market Trends</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Overall upward price trend across most regions, with some locations showing peak prices while others
                    experience slight corrections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
