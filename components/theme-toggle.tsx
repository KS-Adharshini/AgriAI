'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const isDark = (theme ?? resolvedTheme) === 'dark'

	return (
		<Button
			variant="ghost"
			size="sm"
			className="backdrop-blur-sm bg-white/20 dark:bg-black/20"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label="Toggle theme"
		>
			{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</Button>
	)
}


