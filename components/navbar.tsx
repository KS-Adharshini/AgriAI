"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Menu, X, Leaf } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navigateProtected = (path: string) => {
    const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("currentUser")
    router.push(isLoggedIn ? path : "/signup")
    setIsMenuOpen(false)
  }

  return (
    <nav className="backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-gray-800/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AgriAI</span>
          </div>

          {/* Desktop Menu (removed links per request) */}
          <div className="hidden md:flex items-center space-x-8" />

          {/* Right Side - Theme toggle & Profile */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="backdrop-blur-sm bg-white/20">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="backdrop-blur-md bg-white/90 dark:bg-black/90">
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); navigateProtected("/personal") }}>
                  Personal
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); navigateProtected("/farm") }}>
                  Farm
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); navigateProtected("/dashboard") }}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); navigateProtected("/history") }}>
                  Plan Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="backdrop-blur-sm bg-white/20"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-lg mt-2">
            <div className="flex flex-col space-y-2">
              {/* No top-level links as requested */}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
              <div className="border-t border-white/20 pt-2 mt-2">
                <button
                  className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:text-green-600 block"
                  onClick={() => navigateProtected("/personal")}
                >
                  Personal
                </button>
                <button
                  className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:text-green-600 block"
                  onClick={() => navigateProtected("/farm")}
                >
                  Farm
                </button>
                <button
                  className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:text-green-600 block"
                  onClick={() => navigateProtected("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:text-green-600 block"
                  onClick={() => navigateProtected("/history")}
                >
                  History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
