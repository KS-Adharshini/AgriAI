import Link from "next/link"
import { Leaf, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="backdrop-blur-md bg-white/10 dark:bg-black/10 border-t border-white/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">AgriAI</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Empowering farmers with AI-driven insights and comprehensive farm management tools for sustainable and
              profitable agriculture.
            </p>
            {/* Removed general contact email per request */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/reports"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
              >
                Reports
              </Link>
              <Link
                href="/history"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
              >
                Plan Report
              </Link>
              <Link
                href="/personal"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Contact Info (replacing phone/address with emails + theme toggle) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>jamunadevig@kongu.edu</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>adharshiniks.23aim@kongu.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 dark:border-gray-800/20 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">© 2025 AgriAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
