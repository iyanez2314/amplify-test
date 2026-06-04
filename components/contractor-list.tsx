"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Folder,
  FolderOpen,
  Calendar,
  MoreVertical,
  Ban,
  CalendarPlus,
  Trash2,
  Copy,
  Check,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Contractor } from "@/types/contractor"
import type { Folder as FolderType } from "@/types/folder"
import { cn } from "@/lib/utils"

interface ContractorListProps {
  contractors: Contractor[]
  folders: FolderType[]
  onRevoke: (id: string) => void
  onExtend: (id: string, newExpiry: Date) => void
  onDelete: (id: string) => void
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date)
}

function getStatusConfig(status: Contractor["status"]) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        className: "bg-primary/20 text-primary border-primary/30"
      }
    case "expired":
      return {
        label: "Expired",
        className: "bg-orange-500/20 text-orange-500 border-orange-500/30"
      }
    case "revoked":
      return {
        label: "Revoked",
        className: "bg-destructive/20 text-destructive border-destructive/30"
      }
  }
}

interface FolderNode {
  folder: FolderType
  children: FolderNode[]
  hasAccess: boolean
}

function buildFolderTree(
  folders: FolderType[],
  assignedIds: string[],
  parentId: string | null = null
): FolderNode[] {
  return folders
    .filter(f => f.parentId === parentId)
    .map(folder => {
      const children = buildFolderTree(folders, assignedIds, folder.id)
      const hasAccess = assignedIds.includes(folder.id)
      const hasChildWithAccess = children.some(c => c.hasAccess || c.children.length > 0)

      return {
        folder,
        children,
        hasAccess
      }
    })
    .filter(node => node.hasAccess || node.children.some(c => c.hasAccess))
}

function FolderTreeNode({ node, level = 0 }: { node: FolderNode; level?: number }) {
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1 text-sm",
          node.hasAccess ? "text-foreground" : "text-muted-foreground"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <span className="w-3" />
        )}
        {hasChildren ? (
          <FolderOpen className={cn(
            "w-4 h-4",
            node.hasAccess ? "text-primary" : "text-muted-foreground"
          )} />
        ) : (
          <Folder className={cn(
            "w-4 h-4",
            node.hasAccess ? "text-primary" : "text-muted-foreground"
          )} />
        )}
        <span className={node.hasAccess ? "font-medium" : ""}>
          {node.folder.name}
        </span>
        {node.hasAccess && (
          <span className="text-xs px-1.5 py-0.5 bg-primary/15 text-primary rounded">
            Access
          </span>
        )}
      </div>
      {hasChildren && (
        <div>
          {node.children.map(child => (
            <FolderTreeNode key={child.folder.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function FolderAccessTree({
  folders,
  assignedIds
}: {
  folders: FolderType[]
  assignedIds: string[]
}) {
  const tree = buildFolderTree(folders, assignedIds)

  if (tree.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">No folders assigned</span>
    )
  }

  return (
    <div className="bg-secondary/30 rounded-lg p-3 border border-border/50">
      {tree.map(node => (
        <FolderTreeNode key={node.folder.id} node={node} />
      ))}
    </div>
  )
}

function ContractorRow({
  contractor,
  folders,
  onRevoke,
  onExtend,
  onDelete
}: {
  contractor: Contractor
  folders: FolderType[]
  onRevoke: () => void
  onExtend: (newExpiry: Date) => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const statusConfig = getStatusConfig(contractor.status)

  const assignedFolders = folders.filter(f =>
    contractor.assignedFolderIds.includes(f.id)
  )

  const handleCopyCredentials = () => {
    const text = `Username: ${contractor.username}\nPassword: ${contractor.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExtend30Days = () => {
    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)
    onExtend(newExpiry)
    setMenuOpen(false)
  }

  return (
    <div className="bg-card/40 border border-border/50 rounded-xl p-5 hover:bg-card/60 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{contractor.name}</h3>
              <Badge
                variant="outline"
                className={cn("text-xs", statusConfig.className)}
              >
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {contractor.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Expires {formatDate(contractor.expiresAt)}
              </span>
            </div>

            <div className="mt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <Folder className="w-3 h-3" />
                Folder Access:
              </span>
              <FolderAccessTree
                folders={folders}
                assignedIds={contractor.assignedFolderIds}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <code className="text-xs bg-secondary/60 px-2 py-1 rounded font-mono text-muted-foreground">
                {contractor.username}
              </code>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyCredentials}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-primary" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

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
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute top-full right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                {contractor.status !== "revoked" && (
                  <button
                    onClick={handleExtend30Days}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Extend 30 Days
                  </button>
                )}
                {contractor.status === "active" && (
                  <button
                    onClick={() => {
                      onRevoke()
                      setMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-500 hover:bg-orange-500/10 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Revoke Access
                  </button>
                )}
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    onDelete()
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function ContractorList({
  contractors,
  folders,
  onRevoke,
  onExtend,
  onDelete
}: ContractorListProps) {
  if (contractors.length === 0) {
    return (
      <div className="text-center py-16 bg-card/20 border border-border/50 rounded-xl">
        <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-5">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No contractors yet
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Add contractors to give them temporary access to specific folders
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {contractors.map(contractor => (
        <ContractorRow
          key={contractor.id}
          contractor={contractor}
          folders={folders}
          onRevoke={() => onRevoke(contractor.id)}
          onExtend={(date) => onExtend(contractor.id, date)}
          onDelete={() => onDelete(contractor.id)}
        />
      ))}
    </div>
  )
}
