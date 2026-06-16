"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import outputs from "@/amplify_outputs.json"

type TokenState = "loading" | "valid" | "invalid"

interface LinkInfo {
  contractorName: string
  dropboxFolder: string
}

function UploadContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [tokenState, setTokenState] = useState<TokenState>("loading")
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setError("No upload token provided.")
      setTokenState("invalid")
      return
    }
    validateToken(token)
  }, [token])

  const validateToken = async (token: string) => {
    try {
      const apiUrl = (outputs as any).custom?.apiUrl
      const res = await fetch(`${apiUrl}validate?token=${token}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setTokenState("invalid")
        return
      }

      setLinkInfo(data)
      setTokenState("valid")
    } catch {
      setError("Failed to validate link.")
      setTokenState("invalid")
    }
  }

  if (tokenState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Validating your link...</p>
      </div>
    )
  }

  if (tokenState === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2">Link Invalid</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Hi {linkInfo?.contractorName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload your files to{" "}
            <span className="font-medium text-foreground">{linkInfo?.dropboxFolder}</span>
          </p>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-card/40">
          <p className="text-muted-foreground text-sm">Upload UI coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">
            Dropbox integration will be wired in here
          </p>
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  )
}
