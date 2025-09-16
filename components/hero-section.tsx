import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-500/20 to-emerald-600/20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Main Content */}
        <div className="backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-3xl border border-white/20 dark:border-gray-800/20 p-8 md:p-12 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-green-600 dark:text-green-400 font-semibold">AI-Powered Agriculture</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Smart Agriculture Dashboard
            <span className="block text-green-600 dark:text-green-400">for Farmers</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track farm data, expenses, income, and improve yield with AI insights. Make data-driven decisions to
            maximize your agricultural productivity and profitability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {/* Secondary CTA removed per request */}
          </div>
        </div>
      </div>
    </section>
  )
}
