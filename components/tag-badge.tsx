"use client"

import { X } from "lucide-react"
import type { Tag } from "@/types/folder"
import { PREDEFINED_TAGS } from "@/types/folder"
import { cn } from "@/lib/utils"

interface TagBadgeProps {
  tagId: string
  onRemove?: () => void
  size?: "sm" | "md"
}

export function TagBadge({ tagId, onRemove, size = "sm" }: TagBadgeProps) {
  const tag = PREDEFINED_TAGS.find(t => t.id === tagId)

  if (!tag) {
    // Custom tag - use default styling
    return (
      <span className={cn(
        "inline-flex items-center gap-1 rounded border bg-secondary/50 text-foreground border-border",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      )}>
        {tagId}
        {onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="hover:text-destructive"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        )}
      </span>
    )
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded border",
      tag.color,
      size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
    )}>
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="hover:opacity-70"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  )
}

export function getTagById(tagId: string): Tag | undefined {
  return PREDEFINED_TAGS.find(t => t.id === tagId)
}
