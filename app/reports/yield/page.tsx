"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { BarChart3, TrendingUp, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

// Crop-specific yield data
const CROP_YIELD_DATA = {
  wheat: [
    { year: 2014, yield: 175, rainfall: 420, temperature: 22.5, costPerAcre: 33750 },
    { year: 2015, yield: 153, rainfall: 380, temperature: 24.1, costPerAcre: 37500 },
    { year: 2016, yield: 164, rainfall: 450, temperature: 21.8, costPerAcre: 34500 },
    { year: 2017, yield: 142, rainfall: 320, temperature: 25.2, costPerAcre: 41250 },
    { year: 2018, yield: 131, rainfall: 290, temperature: 26.8, costPerAcre: 45000 },
    { year: 2019, yield: 153, rainfall: 410, temperature: 23.4, costPerAcre: 37500 },
    { year: 2020, yield: 164, rainfall: 480, temperature: 22.1, costPerAcre: 34500 },
    { year: 2021, yield: 142, rainfall: 350, temperature: 24.9, costPerAcre: 41250 },
    { year: 2022, yield: 131, rainfall: 310, temperature: 26.2, costPerAcre: 45000 },
    { year: 2023, yield: 120, rainfall: 280, temperature: 27.5, costPerAcre: 48750 },
  ],
  corn: [
    { year: 2014, yield: 180, rainfall: 450, temperature: 24.0, costPerAcre: 45000 },
    { year: 2015, yield: 165, rainfall: 420, temperature: 25.5, costPerAcre: 48750 },
    { year: 2016, yield: 175, rainfall: 480, temperature: 23.8, costPerAcre: 45000 },
    { year: 2017, yield: 155, rainfall: 350, temperature: 26.2, costPerAcre: 52500 },
    { year: 2018, yield: 145, rainfall: 320, temperature: 27.8, costPerAcre: 56250 },
    { year: 2019, yield: 165, rainfall: 430, temperature: 25.4, costPerAcre: 48750 },
    { year: 2020, yield: 175, rainfall: 500, temperature: 24.1, costPerAcre: 45000 },
    { year: 2021, yield: 155, rainfall: 370, temperature: 26.9, costPerAcre: 52500 },
    { year: 2022, yield: 145, rainfall: 330, temperature: 28.2, costPerAcre: 56250 },
    { year: 2023, yield: 135, rainfall: 300, temperature: 29.5, costPerAcre: 60000 },
  ],
  rice: [
    { year: 2014, yield: 160, rainfall: 600, temperature: 26.0, costPerAcre: 37500 },
    { year: 2015, yield: 145, rainfall: 550, temperature: 27.5, costPerAcre: 41250 },
    { year: 2016, yield: 155, rainfall: 620, temperature: 25.8, costPerAcre: 37500 },
    { year: 2017, yield: 135, rainfall: 480, temperature: 28.2, costPerAcre: 45000 },
    { year: 2018, yield: 125, rainfall: 450, temperature: 29.8, costPerAcre: 48750 },
    { year: 2019, yield: 145, rainfall: 530, temperature: 27.4, costPerAcre: 41250 },
    { year: 2020, yield: 155, rainfall: 600, temperature: 26.1, costPerAcre: 37500 },
    { year: 2021, yield: 135, rainfall: 470, temperature: 28.9, costPerAcre: 45000 },
    { year: 2022, yield: 125, rainfall: 430, temperature: 30.2, costPerAcre: 48750 },
    { year: 2023, yield: 115, rainfall: 400, temperature: 31.5, costPerAcre: 52500 },
  ],
  tomatoes: [
    { year: 2019, yield: 25, rainfall: 380, temperature: 24.0, costPerAcre: 67500 },
    { year: 2020, yield: 28, rainfall: 420, temperature: 23.1, costPerAcre: 60000 },
    { year: 2021, yield: 22, rainfall: 350, temperature: 25.9, costPerAcre: 75000 },
    { year: 2022, yield: 20, rainfall: 310, temperature: 27.2, costPerAcre: 82500 },
    { year: 2023, yield: 18, rainfall: 280, temperature: 28.5, costPerAcre: 90000 },
  ],
  // Default data for other crops
  default: [
    { year: 2014, yield: 175, rainfall: 420, temperature: 22.5, costPerAcre: 33750 },
    { year: 2015, yield: 153, rainfall: 380, temperature: 24.1, costPerAcre: 37500 },
    { year: 2016, yield: 164, rainfall: 450, temperature: 21.8, costPerAcre: 34500 },
    { year: 2017, yield: 142, rainfall: 320, temperature: 25.2, costPerAcre: 41250 },
    { year: 2018, yield: 131, rainfall: 290, temperature: 26.8, costPerAcre: 45000 },
    { year: 2019, yield: 153, rainfall: 410, temperature: 23.4, costPerAcre: 37500 },
    { year: 2020, yield: 164, rainfall: 480, temperature: 22.1, costPerAcre: 34500 },
    { year: 2021, yield: 142, rainfall: 350, temperature: 24.9, costPerAcre: 41250 },
    { year: 2022, yield: 131, rainfall: 310, temperature: 26.2, costPerAcre: 45000 },
    { year: 2023, yield: 120, rainfall: 280, temperature: 27.5, costPerAcre: 48750 },
  ]
}

export default function YieldPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [yieldData, setYieldData] = useState(CROP_YIELD_DATA.default)

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
        setYieldData(CROP_YIELD_DATA[cropKey as keyof typeof CROP_YIELD_DATA] || CROP_YIELD_DATA.default)
      }
    }
  }, [router])

  const averageYield = yieldData.reduce((sum, item) => sum + item.yield, 0) / yieldData.length
  const currentYield = yieldData[yieldData.length - 1].yield
  const previousYield = yieldData[yieldData.length - 2].yield
  const yieldChange = ((currentYield - previousYield) / previousYield) * 100

  const bestYear = yieldData.reduce((best, current) => (current.yield > best.yield ? current : best))
  const worstYear = yieldData.reduce((worst, current) => (current.yield < worst.yield ? current : worst))

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

  const getYieldUnit = (cropKey: string) => {
    if (cropKey === "tomatoes") return "tons per acre"
    return "bushels per acre"
  }

  const getCostUnit = (cropKey: string) => {
    if (cropKey === "tomatoes") return "₹ per acre"
    return "₹ per acre"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crop Yield Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Historical yield performance and trend analysis for {selectedCrop ? getCropDisplayName(selectedCrop) : "your selected crop"}
            </p>
            {selectedCrop && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing data specific to {getCropDisplayName(selectedCrop)}
              </p>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Yield (2023)</CardTitle>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{currentYield}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{getYieldUnit(selectedCrop)}</p>
                <div className={`flex items-center mt-1 ${yieldChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${yieldChange < 0 ? "rotate-180" : ""}`} />
                  <span className="text-xs">{Math.abs(yieldChange).toFixed(1)}% vs 2022</span>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{yieldData.length}-Year Average</CardTitle>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{averageYield.toFixed(0)}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{getYieldUnit(selectedCrop)}</p>
                <p className="text-xs text-gray-500 mt-1">{yieldData[0].year}-{yieldData[yieldData.length-1].year} period</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Best Year</CardTitle>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{bestYear.yield}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">in {bestYear.year}</p>
                <p className="text-xs text-gray-500 mt-1">{bestYear.rainfall}mm rainfall</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lowest Year</CardTitle>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{worstYear.yield}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">in {worstYear.year}</p>
                <p className="text-xs text-gray-500 mt-1">{worstYear.rainfall}mm rainfall</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Yield Trend Chart */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle>Yield Trend (Past {yieldData.length} Years)</CardTitle>
                <CardDescription>Annual crop yield performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [`${value} ${getYieldUnit(selectedCrop)}`, name === "yield" ? "Yield" : name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="yield"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Yield vs Rainfall Correlation */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle>Yield vs Rainfall Correlation</CardTitle>
                <CardDescription>Relationship between rainfall and crop yield</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rainfall" name="Rainfall" unit="mm" />
                    <YAxis dataKey="yield" name="Yield" unit={getYieldUnit(selectedCrop)} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "yield" ? `${value} ${getYieldUnit(selectedCrop)}` : `${value}mm`,
                        name === "yield" ? "Yield" : "Rainfall",
                      ]}
                      labelFormatter={(label) => `Year: ${yieldData.find((d) => d.rainfall === label)?.year || ""}`}
                    />
                    <Scatter dataKey="yield" fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Insights */}
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                Yield Analysis Insights
              </CardTitle>
              <CardDescription>Key findings from {yieldData.length}-year yield performance data for {selectedCrop ? getCropDisplayName(selectedCrop) : "your crop"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg backdrop-blur-sm bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Rainfall Impact</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedCrop === "rice" ? "Rice shows strong correlation with rainfall. Years with 500mm+ rainfall consistently show yields above 140 tons per acre." :
                     selectedCrop === "tomatoes" ? "Tomatoes are sensitive to rainfall variations. Consistent moderate rainfall (350-450mm) produces optimal yields." :
                     "Strong positive correlation between rainfall and yield. Years with 400mm+ rainfall consistently show yields above 150 bushels per acre."}
                  </p>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">Temperature Effects</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {selectedCrop === "rice" ? "Rice thrives in warm temperatures (25-28°C). Temperatures above 30°C significantly reduce yields." :
                     selectedCrop === "tomatoes" ? "Tomatoes prefer moderate temperatures (22-26°C). High temperatures above 28°C cause yield reduction." :
                     "Rising temperatures correlate with declining yields. Years with temperatures above 25°C show significantly lower productivity."}
                  </p>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Optimization Potential</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {selectedCrop === "rice" ? "Implementing water management systems and heat-resistant varieties could help maintain yields above 150 tons per acre consistently." :
                     selectedCrop === "tomatoes" ? "Using shade nets and temperature control measures could help maintain yields above 25 tons per acre consistently." :
                     "Implementing drought-resistant varieties and improved irrigation could help maintain yields above 160 bushels per acre consistently."}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg backdrop-blur-sm bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-400 mb-2">Recommendations</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    • <strong>Water Management:</strong> Invest in efficient irrigation systems to mitigate rainfall
                    variability
                  </li>
                  <li>
                    • <strong>Crop Varieties:</strong> Consider heat and drought-resistant cultivars for climate
                    adaptation
                  </li>
                  <li>
                    • <strong>Soil Health:</strong> Improve soil organic matter to enhance water retention capacity
                  </li>
                  <li>
                    • <strong>Precision Agriculture:</strong> Use data-driven approaches to optimize inputs and timing
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
