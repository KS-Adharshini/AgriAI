"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Cloud, Thermometer, Droplets, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ClimatePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [weatherData, setWeatherData] = useState({
    locationLabel: "",
    lastPeriod: {
      label: "Last 30 days",
      temperature: 0,
      rainfall: 0,
    },
    nextPeriod: {
      label: "Next 2 weeks",
      temperature: 0,
      rainfall: 0,
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load personal location
    const personal = localStorage.getItem(`personal_${userData.id}`)
    const location = personal ? (JSON.parse(personal).location as string) : ""
    if (location) {
      fetchWeatherForLocation(location)
    } else {
      setError("Please set your location in Personal Information to see location-based climate data.")
    }
  }, [router])

  const fetchWeatherForLocation = async (location: string) => {
    try {
      setLoading(true)
      setError("")

      // Geocode the location to lat/lon using Open-Meteo geocoding API
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
      )
      const geoData = await geoRes.json()
      if (!geoData?.results?.length) {
        throw new Error("Could not find the location")
      }
      const { latitude, longitude, name, country_code } = geoData.results[0]

      // Fetch daily weather with past 30 days and next 16 days forecast
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=30&forecast_days=16&timezone=auto`,
      )
      const w = await weatherRes.json()
      const dates: string[] = w?.daily?.time || []
      const tmax: number[] = w?.daily?.temperature_2m_max || []
      const tmin: number[] = w?.daily?.temperature_2m_min || []
      const rain: number[] = w?.daily?.precipitation_sum || []

      const today = new Date().toISOString().slice(0, 10)
      const pastIndices = dates
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => d < today)
        .slice(-30) // last 30 past days
        .map(({ i }) => i)

      const futureIndices = dates
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => d >= today)
        .slice(0, 14) // next 2 weeks
        .map(({ i }) => i)

      const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)

      const pastTemps = pastIndices.map((i) => (tmax[i] + tmin[i]) / 2)
      const pastRain = pastIndices.map((i) => rain[i])

      const futureTemps = futureIndices.map((i) => (tmax[i] + tmin[i]) / 2)
      const futureRain = futureIndices.map((i) => rain[i])

      setWeatherData({
        locationLabel: `${name}${country_code ? ", " + country_code : ""}`,
        lastPeriod: {
          label: "Last 30 days",
          temperature: Number(avg(pastTemps).toFixed(1)),
          rainfall: Number(avg(pastRain).toFixed(1)),
        },
        nextPeriod: {
          label: "Next 2 weeks",
          temperature: Number(avg(futureTemps).toFixed(1)),
          rainfall: Number(avg(futureRain).toFixed(1)),
        },
      })
    } catch (err: any) {
      setError(err?.message || "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return "text-blue-600"
    if (temp < 25) return "text-green-600"
    if (temp < 35) return "text-orange-600"
    return "text-red-600"
  }

  const getRainfallColor = (rainfall: number) => {
    if (rainfall < 50) return "text-red-600"
    if (rainfall < 100) return "text-green-600"
    return "text-blue-600"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Climate & Weather Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time weather insights and predictions for smart farming decisions
            </p>
            {weatherData.locationLabel && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Location: {weatherData.locationLabel}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Past Month Average */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Past Month Average
                </CardTitle>
                <CardDescription>Historical weather data for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                      <p className="text-lg font-semibold">Average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getTemperatureColor(weatherData.lastPeriod.temperature)}`}>
                      {weatherData.lastPeriod.temperature.toFixed(1)}°C
                    </p>
                    <p className="text-sm text-gray-500">{weatherData.lastPeriod.label}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <Droplets className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rainfall</p>
                      <p className="text-lg font-semibold">Total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getRainfallColor(weatherData.lastPeriod.rainfall)}`}>
                      {weatherData.lastPeriod.rainfall.toFixed(1)}mm
                    </p>
                    <p className="text-sm text-gray-500">{weatherData.lastPeriod.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Month Prediction */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="mr-2 h-5 w-5 text-green-600" />
                  Next Month Prediction
                </CardTitle>
                <CardDescription>AI-powered weather forecasting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                      <p className="text-lg font-semibold">Predicted</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getTemperatureColor(weatherData.nextPeriod.temperature)}`}>
                      {weatherData.nextPeriod.temperature.toFixed(1)}°C
                    </p>
                    <p className="text-sm text-gray-500">{weatherData.nextPeriod.label}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <Droplets className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rainfall</p>
                      <p className="text-lg font-semibold">Expected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getRainfallColor(weatherData.nextPeriod.rainfall)}`}>
                      {weatherData.nextPeriod.rainfall.toFixed(1)}mm
                    </p>
                    <p className="text-sm text-gray-500">{weatherData.nextPeriod.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Insights */}
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="mr-2 h-5 w-5 text-blue-600" />
                Weather Insights & Recommendations
              </CardTitle>
              <CardDescription>AI-powered farming recommendations based on weather patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Temperature Trend</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {weatherData.nextPeriod.temperature > weatherData.lastPeriod.temperature
                      ? "Temperature is expected to rise. Consider heat-resistant crops and increased irrigation."
                      : "Temperature is expected to drop. Good time for cool-season crops like lettuce and carrots."}
                  </p>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Rainfall Forecast</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {weatherData.nextPeriod.rainfall > 100
                      ? "High rainfall expected. Ensure proper drainage and consider fungal disease prevention."
                      : weatherData.nextPeriod.rainfall < 50
                        ? "Low rainfall predicted. Plan for irrigation and drought-resistant crops."
                        : "Moderate rainfall expected. Ideal conditions for most crops."}
                  </p>
                </div>

                <div className="p-4 rounded-lg backdrop-blur-sm bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">Farming Action</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {weatherData.nextPeriod.temperature > 30
                      ? "High temperatures ahead. Increase shade coverage and water frequency."
                      : weatherData.nextPeriod.temperature < 15
                        ? "Cool weather coming. Protect sensitive plants and consider greenhouse cultivation."
                        : "Optimal growing conditions. Perfect time for planting and field activities."}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg backdrop-blur-sm bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <strong>Note:</strong> Climate data is fetched from weather APIs for real-time accuracy. Predictions
                  are based on historical patterns and meteorological models. Always consult local weather services for
                  critical farming decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
