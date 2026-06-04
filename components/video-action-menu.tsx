"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { MoreVertical, Tag, Trash2, Download, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagSelector } from "@/components/tag-selector"
import { RenameVideoDialog } from "@/components/rename-video-dialog"
import { DeleteVideoDialog } from "@/components/delete-video-dialog"
import { cn } from "@/lib/utils"

interface VideoActionMenuProps {
  videoId: string
  videoName: string
  currentTags: string[]
  customTags: string[]
  onUpdateTags: (tags: string[]) => void
  onCreateCustomTag: (name: string) => void
  onRename: (newName: string) => void
  onDelete: () => void
}

export function VideoActionMenu({
  videoId,
  videoName,
  currentTags,
  customTags,
  onUpdateTags,
  onCreateCustomTag,
  onRename,
  onDelete
}: VideoActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setShowTagSelector(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = showTagSelector ? 256 : 160
      const viewportWidth = window.innerWidth

      let left = rect.right - menuWidth
      if (left < 8) {
        left = 8
      }
      if (rect.right > viewportWidth - 8) {
        left = viewportWidth - menuWidth - 8
      }

      setMenuPosition({
        top: rect.bottom + 4,
        left: Math.max(8, left)
      })
    }

    setIsOpen(!isOpen)
    setShowTagSelector(false)
  }

  const handleTagsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 256
      const viewportWidth = window.innerWidth

      let left = rect.right - menuWidth
      if (left < 8) {
        left = 8
      }
      if (left + menuWidth > viewportWidth - 8) {
        left = viewportWidth - menuWidth - 8
      }

      setMenuPosition({
        top: rect.bottom + 4,
        left: Math.max(8, left)
      })
    }

    setShowTagSelector(true)
  }

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    setShowRenameDialog(true)
  }

  const handleTagsChange = (tags: string[]) => {
    onUpdateTags(tags)
  }

  const handleCloseTagSelector = () => {
    setShowTagSelector(false)
    setIsOpen(false)
  }

  const handleRename = (newName: string) => {
    onRename(newName)
    setShowRenameDialog(false)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    setShowDeleteDialog(true)
  }

  const menuContent = isOpen && (
    <div
      ref={menuRef}
      className="fixed z-[100]"
      style={{ top: menuPosition.top, left: menuPosition.left }}
      onClick={(e) => e.stopPropagation()}
    >
      {!showTagSelector ? (
        <div className="w-40 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={handleTagsClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Tag className="w-4 h-4" />
            Add Tags
          </button>
          <button
            onClick={handleRenameClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Rename
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <div className="h-px bg-border my-1" />
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      ) : (
        <TagSelector
          selectedTags={currentTags}
          customTags={customTags}
          onTagsChange={handleTagsChange}
          onCreateCustomTag={onCreateCustomTag}
          onClose={handleCloseTagSelector}
        />
      )}
    </div>
  )

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon-xs"
        onClick={handleMenuClick}
        className={cn(
          "bg-background/80 text-muted-foreground hover:text-foreground hover:bg-secondary/80",
          isOpen && "bg-secondary text-foreground"
        )}
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {typeof window !== "undefined" && menuContent && createPortal(menuContent, document.body)}

      <RenameVideoDialog
        isOpen={showRenameDialog}
        currentName={videoName}
        onClose={() => setShowRenameDialog(false)}
        onRename={handleRename}
      />

      <DeleteVideoDialog
        isOpen={showDeleteDialog}
        videoName={videoName}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={onDelete}
      />
    </>
  )
}
