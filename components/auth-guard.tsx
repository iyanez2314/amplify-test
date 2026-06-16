"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/auth/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login")
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-secondary/60 rounded-lg" />
        <div className="h-4 w-96 bg-secondary/40 rounded-lg" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-secondary/40 rounded-xl" />)}
        </div>
        {[1,2,3].map(i => <div key={i} className="h-20 bg-secondary/30 rounded-xl" />)}
      </div>
    </div>
  )

  if (!isAuthenticated) return null

  return <>{children}</>
}
