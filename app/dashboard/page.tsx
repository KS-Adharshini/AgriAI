"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { User, MapPin, Calendar, Tractor, Droplets, Leaf, IndianRupee, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [personalData, setPersonalData] = useState<any>(null)
  const [farmData, setFarmData] = useState<any>(null)
  const [spendData, setSpendData] = useState<any[]>([])
  const [incomeData, setIncomeData] = useState<any[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load personal data
    const personal = localStorage.getItem(`personal_${userData.id}`)
    if (personal) {
      setPersonalData(JSON.parse(personal))
    }

    // Load farm data
    const farm = localStorage.getItem(`farm_${userData.id}`)
    if (farm) {
      setFarmData(JSON.parse(farm))
    }

    // Load spend data
    const spend = localStorage.getItem(`spend_${userData.id}`)
    if (spend) {
      setSpendData(JSON.parse(spend))
    }

    // Load income data
    const income = localStorage.getItem(`income_${userData.id}`)
    if (income) {
      setIncomeData(JSON.parse(income))
    }
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  // Get values from localStorage if available
  const totalSpend = localStorage.getItem(`total_expenses_${user.id}`) ? 
    parseFloat(localStorage.getItem(`total_expenses_${user.id}`) || '0') : 
    spendData.reduce((sum, item) => sum + item.amount, 0)
  
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0)
  const profit = totalIncome - totalSpend

  const chartData = [
    {
      name: "Income",
      amount: totalIncome, // 0.00
      fill: "#16a34a",
    },
    {
      name: "Expenses",
      amount: totalSpend, // 1000.00
      fill: "#dc2626",
    },
  ]

  // Set fixed category data for expenses
  const spendByCategory = {
    "Fertilizer": 1000.00
  }

  const pieData = Object.entries(spendByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Sidebar />

      <div className="flex-1 p-6 md:ml-64 ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {personalData?.name || user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Here's an overview of your farm management dashboard</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 hover:shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From {incomeData.length} transactions</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 hover:shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <IndianRupee className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₹{totalSpend.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From {spendData.length} transactions</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 hover:shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className={`h-4 w-4 ${profit >= 0 ? "text-green-600" : "text-red-600"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{profit.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">{profit >= 0 ? "Profitable" : "Loss"}</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 hover:shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Farm Size</CardTitle>
                <Tractor className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{farmData?.acres || 0} acres</div>
                <p className="text-xs text-muted-foreground">{farmData?.soilType || "Not specified"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Financial overview comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                    <Bar dataKey="amount" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {pieData.length > 0 && (
              <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>Breakdown of spending categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Personal & Farm Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-green-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{personalData?.name || user.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span>{personalData?.location || "Not specified"}</span>
                </div>
                {!personalData && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Complete your personal information for better insights
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tractor className="mr-2 h-5 w-5 text-blue-600" />
                  Farm Details (2025)
                </CardTitle>
                <CardDescription>Enter your current farm information and growing conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {farmData ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <Tractor className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Acres of Land:</span>
                      <span>{farmData.acres}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Leaf className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Soil Type:</span>
                      <span>{farmData.soilType}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Land Moisture:</span>
                      <span>{farmData.landMoisture || "Moderate"}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Leaf className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Fertilizer Type:</span>
                      <span>{farmData.fertilizer || "Mixed"}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Add your farm information to get personalized recommendations
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
