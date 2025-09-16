import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
