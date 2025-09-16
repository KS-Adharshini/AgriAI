export interface User {
  id: string
  name: string
  age: number
  email: string
  location: string
  password: string
  createdAt: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("agriAI_currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("agriAI_currentUser")
  window.location.href = "/login"
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
