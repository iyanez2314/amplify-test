"use client"

import { createPortal } from "react-dom"
import { X, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteVideoDialogProps {
  isOpen: boolean
  videoName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteVideoDialog({
  isOpen,
  videoName,
  onClose,
  onConfirm
}: DeleteVideoDialogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
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
            <div className="w-9 h-9 rounded-lg bg-destructive/15 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-destructive" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Delete Video
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

        <div className="p-5">
          <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              This action cannot be undone. The video will be permanently deleted.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{videoName}</span>?
          </p>

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
              type="button"
              size="sm"
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(dialog, document.body) : null
}
