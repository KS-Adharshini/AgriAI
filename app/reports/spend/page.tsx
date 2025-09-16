"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/sidebar"
import { IndianRupee, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const EXPENSE_CATEGORIES = [
  "Seeds",
  "Fertilizer",
  "Pesticides",
  "Equipment",
  "Labor",
  "Fuel",
  "Irrigation",
  "Transportation",
  "Storage",
  "Other",
]

const COLORS = [
  "#16a34a",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6b7280",
]

export default function SpendPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [spendData, setSpendData] = useState<any[]>([])
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
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

    // Load spend data
    const spend = localStorage.getItem(`spend_${userData.id}`)
    if (spend) {
      setSpendData(JSON.parse(spend))
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!formData.amount || !formData.category || !formData.date) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      const newExpense = {
        id: Date.now().toString(),
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        createdAt: new Date().toISOString(),
      }

      const updatedSpendData = [...spendData, newExpense]
      setSpendData(updatedSpendData)
      localStorage.setItem(`spend_${user.id}`, JSON.stringify(updatedSpendData))

      setSuccess("Expense added successfully!")
      setFormData({
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      })
    } catch (err) {
      setError("Failed to add expense")
    }

    setLoading(false)
  }

  const handleDelete = (id: string) => {
    const updatedSpendData = spendData.filter((item) => item.id !== id)
    setSpendData(updatedSpendData)
    localStorage.setItem(`spend_${user.id}`, JSON.stringify(updatedSpendData))
  }

  const calculateAndStoreTotalExpenses = () => {
    if (!user) return
    
    try {
      // Calculate total from spend data
      const spendTotal = spendData.reduce((sum, item) => sum + item.amount, 0)
      
      // Calculate total from plan data
      const planData = JSON.parse(localStorage.getItem(`plan_${user.id}`) || '[]')
      let planTotal = 0
      
      planData.forEach((crop: any) => {
        // Sum seed costs
        if (crop.seeds) {
          crop.seeds.forEach((seed: any) => {
            planTotal += seed.cost || 0
          })
        }
        // Sum location costs (using avgPrice if available)
        if (crop.locations) {
          crop.locations.forEach((loc: any) => {
            planTotal += loc.avgPrice || 0
          })
        }
      })
      
      const totalExpenses = spendTotal + planTotal
      
      // Store the total in localStorage
      localStorage.setItem(`total_expenses_${user.id}`, totalExpenses.toString())
      
      // Show success message
      setSuccess(`Total expenses calculated: ₹${totalExpenses.toFixed(2)}`)
      
      return totalExpenses
    } catch (error) {
      setError('Failed to calculate total expenses')
      console.error('Error calculating total expenses:', error)
      return 0
    }
  }

  // Calculate total from spend data
  const calculateTotalSpend = () => {
    if (!user) return 0;
    
    // Get spend total from expenses
    const spendTotal = spendData.reduce((sum, item) => sum + item.amount, 0);
    
    // Get plan total from plan data
    let planTotal = 0;
    try {
      const planData = JSON.parse(localStorage.getItem(`plan_${user.id}`) || '[]');
      planData.forEach((crop: any) => {
        if (crop.seeds) {
          crop.seeds.forEach((seed: any) => {
            planTotal += seed.cost || 0;
          });
        }
        if (crop.locations) {
          crop.locations.forEach((loc: any) => {
            planTotal += loc.avgPrice || 0;
          });
        }
      });
    } catch (error) {
      console.error('Error calculating plan total:', error);
    }
    
    return spendTotal + planTotal;
  };
  
  // Calculate total spend
  const totalSpend = calculateTotalSpend();

  const chartData = EXPENSE_CATEGORIES.map((category) => {
    const categoryTotal = spendData
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0)
    return {
      name: category,
      value: categoryTotal,
    }
  }).filter((item) => item.value > 0)

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Expense Tracking</h1>
              <Button 
                onClick={calculateAndStoreTotalExpenses}
                variant="outline"
                className="bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300"
              >
                Calculate Total Expenses
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Track your farm expenses and analyze spending patterns</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Add Expense Form */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-green-600" />
                  Add Expense
                </CardTitle>
                <CardDescription>Record a new farm expense</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
                      required
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
                    <IndianRupee className="mr-2 h-4 w-4" />
                    {loading ? "Adding..." : "Add Expense"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Total Spend Card */}
            <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IndianRupee className="mr-2 h-5 w-5 text-red-600" />
                  Total Expenses
                </CardTitle>
                <CardDescription>Your total farm spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">₹{totalSpend.toFixed(2)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">From {spendData.length} transactions</p>
              </CardContent>
            </Card>

            {/* Expense Chart */}
            {chartData.length > 0 && (
              <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Expense breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
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

          {/* Expenses Table */}
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>All your recorded expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {spendData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spendData
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell className="font-medium">₹{expense.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No expenses recorded yet. Add your first expense above.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
