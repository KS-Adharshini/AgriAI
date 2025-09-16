"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { TrendingUp, Plus, Trash2, IndianRupee, FileText, Share2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Approximate market price per kilogram (₹) for crops
const MARKET_PRICE_INR: Record<string, number> = {
  wheat: 217,
  corn: 242,
  rice: 192,
  soybeans: 217,
  potatoes: 30,
  cotton: 60,
  barley: 180,
  carrots: 25,
  lettuce: 40,
  tomatoes: 80,
}

export default function IncomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [incomeData, setIncomeData] = useState<any[]>([])
  const [formData, setFormData] = useState({
    crop: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [calcReport, setCalcReport] = useState<any | null>(null)
  const [calcError, setCalcError] = useState("")
  const [totalSpend, setTotalSpend] = useState(0)

  // Function to calculate total expenses from both spend data and plan report data
  const calculateTotalExpenses = (userId: string) => {
    try {
      // Calculate total from spend data
      const spendRaw = localStorage.getItem(`spend_${userId}`)
      const spendData = spendRaw ? JSON.parse(spendRaw) : []
      const spendTotal = spendData.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
      
      // Calculate total from plan data
      const planRaw = localStorage.getItem(`plan_${userId}`)
      const planData = planRaw ? JSON.parse(planRaw) : []
      let planTotal = 0
      
      planData.forEach((crop: any) => {
        // Sum seed costs
        if (crop.seeds) {
          crop.seeds.forEach((seed: any) => {
            planTotal += seed.cost || 0
          })
        }
        // Sum location costs
        if (crop.locations) {
          crop.locations.forEach((loc: any) => {
            planTotal += loc.avgPrice || 0
          })
        }
      })
      
      const totalExpenses = spendTotal + planTotal
      
      // Store the total in localStorage for other components to use
      localStorage.setItem(`total_expenses_${userId}`, totalExpenses.toString())
      
      return totalExpenses
    } catch (error) {
      console.error('Error calculating total expenses:', error)
      return 0
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

    // Load income data
    const income = localStorage.getItem(`income_${userData.id}`)
    if (income) {
      setIncomeData(JSON.parse(income))
    }
    
    // Calculate and set total expenses
    const calculatedTotalExpenses = calculateTotalExpenses(userData.id)
    setTotalSpend(calculatedTotalExpenses)
    
    // Set up event listeners for storage changes to update total spend when expenses or plan changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith(`spend_${userData.id}`) || 
          e.key?.startsWith(`plan_${userData.id}`) || 
          e.key?.startsWith(`income_${userData.id}`)) {
        const updatedTotalExpenses = calculateTotalExpenses(userData.id)
        setTotalSpend(updatedTotalExpenses)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Create an interval to periodically check for changes in expenses or plan data
    // This ensures the Total Spend is updated even if the storage event isn't triggered
    // (e.g., when changes are made in the same window)
    const intervalId = setInterval(() => {
      const updatedTotalExpenses = calculateTotalExpenses(userData.id)
      if (updatedTotalExpenses !== totalSpend) {
        setTotalSpend(updatedTotalExpenses)
      }
    }, 1000) // Check every second for more responsive updates
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [router])

  const calculateEstimate = () => {
    if (!user) return
    setCalcError("")

    // Acres from farm details
    const farmRaw = localStorage.getItem(`farm_${user.id}`)
    const farm = farmRaw ? JSON.parse(farmRaw) : null
    const acres = Number(farm?.acres || 0)
    if (!acres || Number.isNaN(acres)) {
      setCalcError("Please fill Farm Details with valid acres before calculating.")
      setCalcReport(null)
      return
    }

    // Use the calculated totalSpend value that combines both expense tracking and plan report costs
    const totalSpending = totalSpend

    // Selected crop and seeds count
    const planRaw = localStorage.getItem(`plan_${user.id}`)
    const plan = planRaw ? JSON.parse(planRaw) : []
    const selectedCropKey: string = plan?.[0]?.key || "wheat"
    const seedsCount: number = plan?.[0]?.seeds?.length ? Number(plan[0].seeds.length) : 1

    // Market price (₹/kg)
    const marketPrice = MARKET_PRICE_INR[selectedCropKey] || 150

    // Estimated revenue = market price × acres × seeds purchased (approximation)
    const estimatedRevenue = marketPrice * acres * seedsCount

    const profit = estimatedRevenue - totalSpending

    const report = {
      crop: selectedCropKey,
      acres,
      seedsCount,
      totalSpending,
      marketPrice,
      estimatedRevenue,
      profit,
      createdAt: new Date().toISOString(),
    }
    setCalcReport(report)
  }

  const exportReport = () => {
    if (!calcReport) return
    const blob = new Blob([JSON.stringify(calcReport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "income-estimate.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareReport = async () => {
    if (!calcReport) return
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Financial Summary",
          text: `Total Income (₹${calcReport.marketPrice}/kg × ${calcReport.acres} acres × ${calcReport.seedsCount} seeds): ₹${calcReport.estimatedRevenue.toFixed(2)} | Total Expenses: ₹${calcReport.totalSpending.toFixed(2)} | Net Profit: ₹${calcReport.profit.toFixed(2)}`,
        })
      } else {
        await navigator.clipboard.writeText(JSON.stringify(calcReport, null, 2))
        setSuccess("Report copied to clipboard!")
        setTimeout(() => setSuccess(""), 2000)
      }
    } catch (e) {
      setError("Sharing failed")
      setTimeout(() => setError(""), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!formData.crop || !formData.amount || !formData.date) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      const newIncome = {
        id: Date.now().toString(),
        crop: formData.crop,
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        createdAt: new Date().toISOString(),
      }

      const updatedIncomeData = [...incomeData, newIncome]
      setIncomeData(updatedIncomeData)
      localStorage.setItem(`income_${user.id}`, JSON.stringify(updatedIncomeData))
      
      // Recalculate total expenses after adding a new income entry
      const updatedTotalExpenses = calculateTotalExpenses(user.id)
      setTotalSpend(updatedTotalExpenses)

      setSuccess("Income added successfully!")
      setFormData({
        crop: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      })
    } catch (err) {
      setError("Failed to add income")
    }

    setLoading(false)
  }

  const handleDelete = (id: string) => {
    const updatedIncomeData = incomeData.filter((item) => item.id !== id)
    setIncomeData(updatedIncomeData)
    localStorage.setItem(`income_${user.id}`, JSON.stringify(updatedIncomeData))
    
    // Recalculate total expenses after deleting an income entry
    const updatedTotalExpenses = calculateTotalExpenses(user.id)
    setTotalSpend(updatedTotalExpenses)
  }

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0)

  // Prepare chart data - group by month
  const chartData = incomeData
    .reduce((acc, item) => {
      const month = new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      const existing = acc.find((entry: any) => entry.month === month)
      if (existing) {
        existing.income += item.amount
      } else {
        acc.push({ month, income: item.amount })
      }
      return acc
    }, [] as any[])
    .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime())

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Income Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">View and analyze your farm income reports</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Calculate income, expenses, and profit based on your farm details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <h3 className="font-medium">Total Spend</h3>
                  <p className="text-xs text-gray-500">Combined expenses from tracking and plan report</p>
                </div>
                <p className="font-bold text-red-600">₹{totalSpend.toFixed(2)}</p>
              </div>
              <Button 
                onClick={calculateEstimate}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Calculate Financial Summary
              </Button>
              
              {calcError && (
                <Alert variant="destructive">
                  <AlertDescription>{calcError}</AlertDescription>
                </Alert>
              )}

              {calcReport && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={shareReport}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={exportReport}
                    >
                      <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Total Income</h3>
                        <p className="text-xs text-gray-500">Based on market price (₹{calcReport.marketPrice}/kg) × acres ({calcReport.acres}) × seeds ({calcReport.seedsCount})</p>
                      </div>
                      <p className="font-bold">₹{calcReport.estimatedRevenue.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Total Expenses</p>
                        <p className="text-xs text-gray-500">Combined expenses from tracking and plan report</p>
                      </div>
                      <p className="text-sm">₹{calcReport.totalSpending.toFixed(2)}</p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Net Profit</p>
                        <p className="text-xs text-gray-500">Total Income minus Total Expenses</p>
                      </div>
                      <p className={`font-bold ${calcReport.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {calcReport.profit >= 0 ? '+' : ''}₹{calcReport.profit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
