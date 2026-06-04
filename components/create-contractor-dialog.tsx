"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, UserPlus, Folder, FolderOpen, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Folder as FolderType } from "@/types/folder"
import { cn } from "@/lib/utils"

interface CreateContractorDialogProps {
  isOpen: boolean
  folders: FolderType[]
  onClose: () => void
  onCreate: (data: {
    name: string
    email: string
    folderIds: string[]
    expiresAt: Date
  }) => void
}

interface FolderNode {
  folder: FolderType
  children: FolderNode[]
}

function buildFolderTree(folders: FolderType[], parentId: string | null = null): FolderNode[] {
  return folders
    .filter(f => f.parentId === parentId)
    .map(folder => ({
      folder,
      children: buildFolderTree(folders, folder.id)
    }))
}

function getAllDescendantIds(folders: FolderType[], parentId: string): string[] {
  const children = folders.filter(f => f.parentId === parentId)
  const childIds = children.map(c => c.id)
  const descendantIds = children.flatMap(c => getAllDescendantIds(folders, c.id))
  return [...childIds, ...descendantIds]
}

function FolderTreeSelect({
  node,
  level = 0,
  selectedFolders,
  expandedFolders,
  onToggleSelect,
  onToggleExpand
}: {
  node: FolderNode
  level?: number
  selectedFolders: string[]
  expandedFolders: string[]
  onToggleSelect: (id: string) => void
  onToggleExpand: (id: string) => void
}) {
  const hasChildren = node.children.length > 0
  const isSelected = selectedFolders.includes(node.folder.id)
  const isExpanded = expandedFolders.includes(node.folder.id)

  return (
    <div className={level === 0 && node.children.length > 0 ? "mb-1" : ""}>
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-2 rounded-lg transition-colors cursor-pointer my-0.5",
          isSelected
            ? "bg-primary/15 border border-primary/20"
            : "hover:bg-secondary/50 border border-transparent"
        )}
        style={{ paddingLeft: `${8 + level * 20}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.folder.id)
            }}
            className="w-4 h-4 flex items-center justify-center"
          >
            <ChevronRight
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          </button>
        ) : (
          <span className="w-4" />
        )}

        <button
          type="button"
          onClick={() => onToggleSelect(node.folder.id)}
          className="flex items-center gap-2 flex-1"
        >
          <span className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            isSelected
              ? "bg-primary border-primary"
              : "border-border"
          )}>
            {isSelected && (
              <Check className="w-3 h-3 text-primary-foreground" />
            )}
          </span>

          {hasChildren && isExpanded ? (
            <FolderOpen className={cn(
              "w-4 h-4",
              isSelected ? "text-primary" : "text-muted-foreground"
            )} />
          ) : (
            <Folder className={cn(
              "w-4 h-4",
              isSelected ? "text-primary" : "text-muted-foreground"
            )} />
          )}

          <span className={cn(
            "text-sm",
            isSelected ? "text-foreground font-medium" : "text-foreground"
          )}>
            {node.folder.name}
          </span>
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map(child => (
            <FolderTreeSelect
              key={child.folder.id}
              node={child}
              level={level + 1}
              selectedFolders={selectedFolders}
              expandedFolders={expandedFolders}
              onToggleSelect={onToggleSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CreateContractorDialog({
  isOpen,
  folders,
  onClose,
  onCreate
}: CreateContractorDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [expiryDays, setExpiryDays] = useState(30)

  const folderTree = buildFolderTree(folders)

  useEffect(() => {
    if (isOpen) {
      setName("")
      setEmail("")
      setSelectedFolders([])
      // Auto-expand root folders
      setExpandedFolders(folders.filter(f => f.parentId === null).map(f => f.id))
      setExpiryDays(30)
    }
  }, [isOpen, folders])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.trim() && selectedFolders.length > 0) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiryDays)

      onCreate({
        name: name.trim(),
        email: email.trim(),
        folderIds: selectedFolders,
        expiresAt
      })
    }
  }

  const toggleFolder = (folderId: string) => {
    const descendantIds = getAllDescendantIds(folders, folderId)
    const allIds = [folderId, ...descendantIds]

    setSelectedFolders(prev => {
      const isCurrentlySelected = prev.includes(folderId)
      if (isCurrentlySelected) {
        // Uncheck this folder and all descendants
        return prev.filter(id => !allIds.includes(id))
      } else {
        // Check this folder and all descendants
        const newSelection = new Set([...prev, ...allIds])
        return Array.from(newSelection)
      }
    })

    // Auto-expand the folder when selecting so user sees all checked children
    if (!selectedFolders.includes(folderId) && descendantIds.length > 0) {
      setExpandedFolders(prev =>
        prev.includes(folderId) ? prev : [...prev, folderId]
      )
    }
  }

  const toggleExpand = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  const dialog = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Add Contractor
            </h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@contractor.com"
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Access Duration
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Folder Access
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Select which folders this contractor can view and upload to
              </p>
              <div className="bg-secondary/30 rounded-lg border border-border/50 p-2 max-h-48 overflow-y-auto">
                {folderTree.map(node => (
                  <FolderTreeSelect
                    key={node.folder.id}
                    node={node}
                    selectedFolders={selectedFolders}
                    expandedFolders={expandedFolders}
                    onToggleSelect={toggleFolder}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
              {selectedFolders.length === 0 && (
                <p className="text-xs text-destructive mt-2">
                  Please select at least one folder
                </p>
              )}
              {selectedFolders.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedFolders.length} folder{selectedFolders.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/50 bg-card">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!name.trim() || !email.trim() || selectedFolders.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Generate Credentials
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(dialog, document.body) : null
}
