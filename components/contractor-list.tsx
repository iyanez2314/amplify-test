"use client"

import { useState } from "react"
import { User, Folder, Calendar, MoreVertical, Ban, Trash2, Copy, Check, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Contractor } from "@/types/contractor"
import { cn } from "@/lib/utils"

interface ContractorListProps {
  contractors: Contractor[]
  isAdmin: boolean
  onRevoke: (id: string) => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr))
}

function getStatusConfig(status: Contractor["status"]) {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-primary/20 text-primary border-primary/30" }
    case "expired":
      return { label: "Expired", className: "bg-orange-500/20 text-orange-500 border-orange-500/30" }
    case "revoked":
      return { label: "Revoked", className: "bg-destructive/20 text-destructive border-destructive/30" }
  }
}

function ContractorRow({
  contractor,
  isAdmin,
  onRevoke,
  onDelete,
}: {
  contractor: Contractor
  isAdmin: boolean
  onRevoke: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const statusConfig = getStatusConfig(contractor.status)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(contractor.uploadLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-5 hover:bg-card/60 transition-colors">
      <div className="flex items-start justify-between gap-2 md:gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
          </div>

          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h3 className="font-semibold text-sm md:text-base text-foreground truncate">{contractor.contractorName}</h3>
              <Badge variant="outline" className={cn("text-xs flex-shrink-0", statusConfig.className)}>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 truncate">
                <Folder className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                <span className="truncate">{contractor.dropboxFolder}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                Expires {formatDate(contractor.expiresAt)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link className="w-3 h-3" />
              <span>{contractor.uploadCount} / {contractor.maxUploads} uploads used</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <code className="text-xs bg-secondary/60 px-2 py-1 rounded font-mono text-muted-foreground truncate max-w-[200px] md:max-w-sm">
                {contractor.uploadLink}
              </code>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyLink}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                  {contractor.status === "active" && (
                    <button
                      onClick={() => { onRevoke(); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-500 hover:bg-orange-500/10 transition-colors"
                    >
                      <Ban className="w-4 h-4" />
                      Revoke Access
                    </button>
                  )}
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => { onDelete(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ContractorList({ contractors, isAdmin, onRevoke, onDelete }: ContractorListProps) {
  if (contractors.length === 0) {
    return (
      <div className="text-center py-16 bg-card/20 border border-border/50 rounded-xl">
        <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-5">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No contractors yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Add contractors to generate temporary upload links for them
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {contractors.map((contractor) => (
        <ContractorRow
          key={contractor.id}
          contractor={contractor}
          isAdmin={isAdmin}
          onRevoke={() => onRevoke(contractor.id)}
          onDelete={() => onDelete(contractor.id)}
        />
      ))}
    </div>
  )
}
