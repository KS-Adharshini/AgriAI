"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  FileText,
  History,
  User,
  Tractor,
  ChevronDown,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Leaf,
  Cloud,
  Bug,
  Truck,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [reportsOpen, setReportsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigateProtected = (path: string) => {
    const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("currentUser")
    router.push(isLoggedIn ? path : "/signup")
    setIsMobileOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const sidebarContent = (
    <div className="relative flex h-full flex-col rounded-2xl bg-white/80 dark:bg-gray-900/70 border border-white/30 backdrop-blur-md shadow-md">
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">AgriAI</span>
        </div>
        <ThemeToggle />
      </div>

      <ScrollArea className="p-4 pb-20">
        <nav className="space-y-2">
          <Button
            onClick={() => navigateProtected("/dashboard")}
            variant={pathname === "/dashboard" ? "default" : "ghost"}
            className={`w-full justify-start ${
              pathname === "/dashboard" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
            }`}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            onClick={() => navigateProtected("/reports/crop-selection")}
            variant={pathname === "/reports/crop-selection" ? "default" : "ghost"}
            className={`w-full justify-start ${
              pathname === "/reports/crop-selection" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
            }`}
          >
            <Leaf className="mr-2 h-4 w-4" />
            Crop Selection
          </Button>

          <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                <FileText className="mr-2 h-4 w-4" />
                Reports
                {reportsOpen ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 space-y-1">
              <Link href="/reports/spend">
                <Button
                  variant={pathname === "/reports/spend" ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    pathname === "/reports/spend" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
                  }`}
                >
                  <DollarSign className="mr-2 h-3 w-3" />
                  Spend
                </Button>
              </Link>
              <Link href="/reports/income">
                <Button
                  variant={pathname === "/reports/income" ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    pathname === "/reports/income" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
                  }`}
                >
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Income
                </Button>
              </Link>
              
              <Link href="/reports/climate">
                <Button
                  variant={pathname === "/reports/climate" ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    pathname === "/reports/climate" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
                  }`}
                >
                  <Cloud className="mr-2 h-3 w-3" />
                  Climate
                </Button>
              </Link>
              <Link href="/reports/pesticide">
                <Button
                  variant={pathname === "/reports/pesticide" ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    pathname === "/reports/pesticide"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Bug className="mr-2 h-3 w-3" />
                  Pesticide
                </Button>
              </Link>
              <Link href="/reports/sales">
                <Button
                  variant={pathname === "/reports/sales" ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    pathname === "/reports/sales" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
                  }`}
                >
                  <Truck className="mr-2 h-3 w-3" />
                  Sales & Transport
                </Button>
              </Link>
              <Link href="/reports/yield">
                <Button
                  variant={pathname === "/reports/yield" ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    pathname === "/reports/yield" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
                  }`}
                >
                  <BarChart3 className="mr-2 h-3 w-3" />
                  Yield Analysis
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={() => navigateProtected("/history")}
            variant={pathname === "/history" ? "default" : "ghost"}
            className={`w-full justify-start ${
              pathname === "/history" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
            }`}
          >
            <History className="mr-2 h-4 w-4" />
            Plan Report
          </Button>

          <Button
            onClick={() => navigateProtected("/personal")}
            variant={pathname === "/personal" ? "default" : "ghost"}
            className={`w-full justify-start ${
              pathname === "/personal" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
            }`}
          >
            <User className="mr-2 h-4 w-4" />
            Personal
          </Button>

          <Button
            onClick={() => navigateProtected("/farm")}
            variant={pathname === "/farm" ? "default" : "ghost"}
            className={`w-full justify-start ${
              pathname === "/farm" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-white/10"
            }`}
          >
            <Tractor className="mr-2 h-4 w-4" />
            Farm
          </Button>
        </nav>
      </ScrollArea>

      <div className="px-4 pt-4 pb-4 border-t border-white/20 absolute bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-none"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden backdrop-blur-md bg-white/70 dark:bg-gray-900/70"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed top-4 bottom-4 left-4 w-64 ${
          className ?? ""
        }`}
      >
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 p-2">
            <div className="h-full rounded-r-2xl overflow-hidden">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
