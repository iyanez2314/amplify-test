"use client"

import { useState } from "react"
import { signIn, confirmSignIn } from "aws-amplify/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [requiresNewPassword, setRequiresNewPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const result = await signIn({ username: email, password })

      if (result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setRequiresNewPassword(true)
        return
      }

      if (result.isSignedIn) {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const result = await confirmSignIn({ challengeResponse: newPassword })
      if (result.isSignedIn) {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (requiresNewPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleNewPassword} className="flex flex-col gap-4 w-80">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-sm text-muted-foreground">Your temporary password has expired. Please set a new one.</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">
            Set Password
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">
          Sign In
        </button>
      </form>
    </div>
  )
}
