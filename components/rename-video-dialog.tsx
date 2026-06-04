"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RenameVideoDialogProps {
  isOpen: boolean
  currentName: string
  onClose: () => void
  onRename: (newName: string) => void
}

export function RenameVideoDialog({
  isOpen,
  currentName,
  onClose,
  onRename
}: RenameVideoDialogProps) {
  const [name, setName] = useState(currentName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName(currentName)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen, currentName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && name.trim() !== currentName) {
      onRename(name.trim())
    }
    onClose()
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
        className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Rename Video
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

        <form onSubmit={handleSubmit} className="p-5">
          <label className="block text-sm font-medium text-foreground mb-2">
            Video Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter video name..."
            className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
          />

          <div className="flex items-center justify-end gap-2 mt-5">
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
              disabled={!name.trim() || name.trim() === currentName}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Rename
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(dialog, document.body) : null
}
