"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Key, Copy, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CredentialsDialogProps {
  isOpen: boolean
  credentials: {
    name: string
    username: string
    password: string
  } | null
  onClose: () => void
}

export function CredentialsDialog({
  isOpen,
  credentials,
  onClose
}: CredentialsDialogProps) {
  const [copiedField, setCopiedField] = useState<"username" | "password" | "all" | null>(null)

  if (!isOpen || !credentials) return null

  const handleCopy = async (field: "username" | "password" | "all") => {
    let text = ""
    if (field === "username") {
      text = credentials.username
    } else if (field === "password") {
      text = credentials.password
    } else {
      text = `Username: ${credentials.username}\nPassword: ${credentials.password}`
    }

    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const dialog = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Credentials Generated
              </h2>
              <p className="text-xs text-muted-foreground">
                For {credentials.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Save these credentials now. The password cannot be retrieved later.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Username
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg font-mono text-sm text-foreground">
                  {credentials.username}
                </code>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleCopy("username")}
                  className="flex-shrink-0"
                >
                  {copiedField === "username" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg font-mono text-sm text-foreground">
                  {credentials.password}
                </code>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleCopy("password")}
                  className="flex-shrink-0"
                >
                  {copiedField === "password" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy("all")}
            className="gap-2"
          >
            {copiedField === "all" ? (
              <>
                <Check className="w-4 h-4 text-primary" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy All
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(dialog, document.body) : null
}
