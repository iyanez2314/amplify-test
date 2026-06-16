"use client"

import { useEffect, useState } from "react"
import { fetchAuthSession, signOut } from "aws-amplify/auth"

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true })
      const groups = (session.tokens?.accessToken?.payload?.["cognito:groups"] as string[]) ?? []
      setIsAuthenticated(true)
      setIsAdmin(groups.includes("Admins"))
    } catch {
      setIsAuthenticated(false)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  return { isAdmin, isLoading, isAuthenticated, handleSignOut }
}
