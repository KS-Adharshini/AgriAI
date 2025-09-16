"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Leaf, Trash2, Plus, Bug, IndianRupee, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"

interface PlannedCrop {
	key: string
	name: string
	addedAt: string
	seeds?: Array<{
		name: string
		cost: number
		effectiveness: number
		safety: number
		description: string
		application?: string
		id: string
		addedAt: string
		isCustom: boolean
	}>
	locations?: Array<{
		name: string
		region: string
		transport: string
		priceRange: string
		avgPrice: number
		volume: string
		id: string
		addedAt: string
		isCustom: boolean
	}>
}

export default function PlanReportPage() {
	const [user, setUser] = useState<any>(null)
	const [plan, setPlan] = useState<PlannedCrop[]>([])
	const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set())

	useEffect(() => {
		const currentUser = localStorage.getItem("currentUser")
		if (!currentUser) {
			window.location.href = "/login"
			return
		}
		const userData = JSON.parse(currentUser)
		setUser(userData)
		const list = JSON.parse(localStorage.getItem(`plan_${userData.id}`) || "[]")
		setPlan(list)
	}, [])

	const removeFromPlan = (cropKey: string) => {
		if (!user) return
		const key = `plan_${user.id}`
		const next = plan.filter((c) => c.key !== cropKey)
		localStorage.setItem(key, JSON.stringify(next))
		setPlan(next)
		// Remove from expanded state if it was expanded
		setExpandedPlans(prev => {
			const newSet = new Set(prev)
			newSet.delete(cropKey)
			return newSet
		})
	}

	const removeSeedFromCrop = (cropKey: string, seedName: string) => {
		if (!user) return
		const key = `plan_${user.id}`
		const updatedPlan = plan.map(crop => {
			if (crop.key === cropKey && crop.seeds) {
				return {
					...crop,
					seeds: crop.seeds.filter(s => s.name !== seedName)
				}
			}
			return crop
		})
		localStorage.setItem(key, JSON.stringify(updatedPlan))
		setPlan(updatedPlan)
	}

	const removeLocationFromCrop = (cropKey: string, locationId: string) => {
		if (!user) return
		const key = `plan_${user.id}`
		const updatedPlan = plan.map(crop => {
			if (crop.key === cropKey && crop.locations) {
				return {
					...crop,
					locations: crop.locations.filter(l => l.id !== locationId)
				}
			}
			return crop
		})
		localStorage.setItem(key, JSON.stringify(updatedPlan))
		setPlan(updatedPlan)
	}

	const clearAll = () => {
		if (!user) return
		localStorage.removeItem(`plan_${user.id}`)
		setPlan([])
		setExpandedPlans(new Set())
	}

	const toggleCropExpansion = (cropKey: string) => {
		setExpandedPlans(prev => {
			const newSet = new Set(prev)
			if (newSet.has(cropKey)) {
				newSet.delete(cropKey)
			} else {
				newSet.add(cropKey)
			}
			return newSet
		})
	}

	const getEffectivenessColor = (rating: number) => {
		if (rating >= 4.0) return "bg-green-100 text-green-800 border-green-200"
		if (rating >= 3.0) return "bg-yellow-100 text-yellow-800 border-yellow-200"
		return "bg-red-100 text-red-800 border-red-200"
	}

	const getSafetyColor = (rating: number) => {
		if (rating >= 4.0) return "text-green-600"
		if (rating >= 3.0) return "text-yellow-600"
		return "text-red-600"
	}

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
			<Sidebar />
			<div className="flex-1 p-6 md:ml-64">
				<div className="max-w-5xl mx-auto">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Plan Report</h1>
							<p className="text-gray-600 dark:text-gray-400">Crops you've added from AI recommendations with their selected seeds and locations</p>
						</div>
						{plan.length > 0 && (
							<Button variant="outline" onClick={clearAll} className="text-red-600 border-red-300">
								<Trash2 className="h-4 w-4 mr-2" /> Clear All
							</Button>
						)}
					</div>

					<Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20">
						<CardHeader>
							<CardTitle className="flex items-center">
								<Leaf className="mr-2 h-5 w-5 text-green-600" /> Saved Crops, Seeds & Locations
							</CardTitle>
							<CardDescription>Your selected crops and their associated seeds and locations for planning</CardDescription>
						</CardHeader>
						<CardContent>
							{plan.length === 0 ? (
								<p className="text-center text-gray-500 py-10">No crops added yet. Use AI Crop Selection to add crops to your plan.</p>
							) : (
								<div className="space-y-4">
									{plan.map((crop) => (
										<div key={crop.key} className="border rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 overflow-hidden">
											{/* Crop Header */}
											<div className="p-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b">
												<div className="flex items-center space-x-3">
													<Leaf className="h-5 w-5 text-green-600" />
													<div>
														<h3 className="font-semibold text-lg text-gray-900 dark:text-white">{crop.name}</h3>
														<p className="text-xs text-gray-500">Added on {new Date(crop.addedAt).toLocaleString()}</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{crop.seeds && crop.seeds.length > 0 && (
														<Badge className="bg-blue-100 text-blue-800 border-blue-200">
															{crop.seeds.length} Seed{crop.seeds.length !== 1 ? 's' : ''}
														</Badge>
													)}
													{crop.locations && crop.locations.length > 0 && (
														<Badge className="bg-purple-100 text-purple-800 border-purple-200">
															{crop.locations.length} Location{crop.locations.length !== 1 ? 's' : ''}
														</Badge>
													)}
													<Button
														variant="ghost"
														size="sm"
														onClick={() => toggleCropExpansion(crop.key)}
														className="text-gray-600 hover:text-gray-800"
													>
														{expandedPlans.has(crop.key) ? (
															<ChevronDown className="h-4 w-4" />
														) : (
															<ChevronRight className="h-4 w-4" />
														)}
													</Button>
													<Button 
														variant="ghost" 
														className="text-red-600 hover:text-red-700" 
														onClick={() => removeFromPlan(crop.key)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>

											{/* Seeds Section */}
											{crop.seeds && crop.seeds.length > 0 && (
												<Collapsible open={expandedPlans.has(crop.key)} onOpenChange={() => toggleCropExpansion(crop.key)}>
													<CollapsibleContent>
														<div className="p-4 bg-gray-50/50 dark:bg-gray-800/30">
															<div className="mb-3">
																<h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
																	<Bug className="h-4 w-4 mr-2 text-blue-600" />
																	Selected Seeds
																</h4>
															</div>
															<div className="space-y-3">
																{crop.seeds.map((seed) => (
																	<div
																		key={seed.id}
																		className="p-3 rounded-lg border bg-white/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
																	>
																		<div className="flex items-start justify-between mb-2">
																			<div className="flex items-center space-x-2">
																				<span className="font-semibold text-gray-800 dark:text-gray-200">
																					{seed.name}
																				</span>
																				<Badge className={getEffectivenessColor(seed.effectiveness)}>
																					{seed.effectiveness}/5
																				</Badge>
																				{seed.isCustom && (
																					<Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
																						Custom
																					</Badge>
																				)}
																			</div>
																			<div className="flex items-center space-x-2">
																				<div className="flex items-center space-x-1">
																					<IndianRupee className="h-4 w-4 text-green-600" />
																					<span className="font-semibold text-green-600">{seed.cost}/acre</span>
																				</div>
																				<Button
																					variant="ghost"
																					size="sm"
																					onClick={() => removeSeedFromCrop(crop.key, seed.name)}
																					className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
																				>
																					<X className="h-3 w-3" />
																				</Button>
																			</div>
																		</div>

																		<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
																			{seed.description}
																		</p>

																		{seed.application && (
																			<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
																				<strong>Application:</strong> {seed.application}
																			</p>
																		)}

																		<div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
																			<span>
																				Effectiveness: <strong className={getEffectivenessColor(seed.effectiveness).split(' ')[1]}>{seed.effectiveness}/5</strong>
																			</span>
																			<span className={getSafetyColor(seed.safety)}>
																				Safety: <strong>{seed.safety}/5</strong>
																			</span>
																			<span className="text-xs text-gray-400">
																				Added: {new Date(seed.addedAt).toLocaleDateString()}
																			</span>
																		</div>
																	</div>
																))}
															</div>
														</div>
													</CollapsibleContent>
												</Collapsible>
											)}

											{/* Locations Section */}
											{crop.locations && crop.locations.length > 0 && (
												<Collapsible open={expandedPlans.has(crop.key)} onOpenChange={() => toggleCropExpansion(crop.key)}>
													<CollapsibleContent>
														<div className="p-4 bg-gray-50/50 dark:bg-gray-800/30">
															<div className="mb-3">
																<h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
																	<MapPin className="h-4 w-4 mr-2 text-purple-600" />
																	Selected Locations
																</h4>
															</div>
															<div className="space-y-3">
																{crop.locations.map((location) => (
																	<div
																		key={location.id}
																		className="p-3 rounded-lg border bg-white/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
																	>
																		<div className="flex items-start justify-between mb-2">
																			<div className="flex items-center space-x-2">
																				<span className="font-semibold text-gray-800 dark:text-gray-200">
																					{location.name}
																				</span>
																				<Badge className="bg-blue-100 text-blue-800 border-blue-200">
																					{location.region}
																				</Badge>
																				{location.isCustom && (
																					<Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
																						Custom
																					</Badge>
																				)}
																			</div>
																			<div className="flex items-center space-x-2">
																				<div className="flex items-center space-x-1">
																					<IndianRupee className="h-4 w-4 text-green-600" />
																					<span className="font-semibold text-green-600">{location.avgPrice}/kg</span>
																				</div>
																				<Button
																					variant="ghost"
																					size="sm"
																					onClick={() => removeLocationFromCrop(crop.key, location.id)}
													className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
																				>
																					<X className="h-3 w-3" />
																				</Button>
																			</div>
																		</div>

																		<div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
																			<span><strong>Price Range:</strong> {location.priceRange}</span>
																			<span><strong>Volume:</strong> {location.volume}</span>
																			<span><strong>Transport:</strong> {location.transport === "YES" ? "Available" : "Not Available"}</span>
																		</div>

																		<div className="text-xs text-gray-400">
																			Added: {new Date(location.addedAt).toLocaleDateString()}
																		</div>
																	</div>
																))}
															</div>
														</div>
													</CollapsibleContent>
												</Collapsible>
											)}

											{/* No Seeds or Locations Message */}
											{(!crop.seeds || crop.seeds.length === 0) && (!crop.locations || crop.locations.length === 0) && (
												<div className="p-4 bg-gray-50/50 dark:bg-gray-800/30">
													<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
														No seeds or locations selected yet. Go to Seed Recommendations or Sales & Transport to add items for this crop.
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Summary Card */}
					{plan.length > 0 && (
						<Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-white/20 mt-6">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Leaf className="mr-2 h-5 w-5 text-blue-600" /> Plan Summary
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div className="p-4 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
										<h3 className="font-semibold text-green-800 dark:text-green-400">Total Crops</h3>
										<p className="text-2xl font-bold text-green-600">{plan.length}</p>
									</div>
									<div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
										<h3 className="font-semibold text-blue-800 dark:text-blue-400">Total Seeds</h3>
										<p className="text-2xl font-bold text-blue-600">
											{plan.reduce((total, crop) => total + (crop.seeds?.length || 0), 0)}
										</p>
									</div>
									<div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
										<h3 className="font-semibold text-purple-800 dark:text-purple-400">Total Locations</h3>
										<p className="text-2xl font-bold text-purple-600">
											{plan.reduce((total, crop) => total + (crop.locations?.length || 0), 0)}
										</p>
									</div>
									<div className="p-4 rounded-lg bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
										<h3 className="font-semibold text-orange-800 dark:text-orange-400">Custom Items</h3>
										<p className="text-2xl font-bold text-orange-600">
											{plan.reduce((total, crop) => 
												total + (crop.seeds?.filter(s => s.isCustom).length || 0) + (crop.locations?.filter(l => l.isCustom).length || 0), 0
											)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}


