import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, DollarSign, Brain, Smartphone } from "lucide-react"

const features = [
  {
    icon: Database,
    title: "Farm Data Management",
    description:
      "Store and organize personal and farm details with comprehensive tracking of soil, water, and crop information.",
  },
  {
    icon: DollarSign,
    title: "Spend & Income Reports",
    description:
      "Track your financials in dollars with detailed expense and income analysis to maximize profitability.",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description:
      "Get intelligent insights for crop selection, pesticide recommendations, and yield analysis powered by AI.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Access your dashboard seamlessly across all devices - mobile, tablet, and desktop with modern UI.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Farming
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to manage your agricultural operations efficiently and make informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg bg-white/10 dark:bg-black/10 border border-white/20 dark:border-gray-800/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 group"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900/30 w-fit group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
