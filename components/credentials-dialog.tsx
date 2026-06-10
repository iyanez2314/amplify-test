"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Link, Copy, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CredentialsDialogProps {
  isOpen: boolean
  credentials: {
    name: string
    link: string
  } | null
  onClose: () => void
}

export function CredentialsDialog({ isOpen, credentials, onClose }: CredentialsDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !credentials) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(credentials.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dialog = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Link className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Upload Link Generated</h2>
              <p className="text-xs text-muted-foreground">For {credentials.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Share this link with the contractor. It will expire based on the duration you set.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Upload Link</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg font-mono text-xs text-foreground break-all">
                {credentials.link}
              </code>
              <Button variant="outline" size="icon-sm" onClick={handleCopy} className="flex-shrink-0">
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-5 py-4 border-t border-border/50">
          <Button size="sm" onClick={onClose} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Done
          </Button>
        </div>
      </div>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(dialog, document.body) : null
}
