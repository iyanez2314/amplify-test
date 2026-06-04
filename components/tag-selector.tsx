"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Plus, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PREDEFINED_TAGS } from "@/types/folder"
import { cn } from "@/lib/utils"

interface TagSelectorProps {
  selectedTags: string[]
  customTags: string[]
  onTagsChange: (tags: string[]) => void
  onCreateCustomTag: (name: string) => void
  onClose: () => void
}

export function TagSelector({
  selectedTags,
  customTags,
  onTagsChange,
  onCreateCustomTag,
  onClose
}: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState("")
  const [showInput, setShowInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus()
    }
  }, [showInput])

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(t => t !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const handleCreateTag = () => {
    const trimmed = newTagName.trim().toLowerCase().replace(/\s+/g, "-")
    if (trimmed && !PREDEFINED_TAGS.some(t => t.id === trimmed) && !customTags.includes(trimmed)) {
      onCreateCustomTag(trimmed)
      onTagsChange([...selectedTags, trimmed])
      setNewTagName("")
      setShowInput(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCreateTag()
    } else if (e.key === "Escape") {
      setShowInput(false)
      setNewTagName("")
    }
  }

  const allTags = [
    ...PREDEFINED_TAGS,
    ...customTags.map(id => ({ id, name: id, color: "bg-secondary/50 text-foreground border-border" }))
  ]

  return (
    <div className="w-64 bg-card border border-border rounded-xl shadow-xl">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Tag className="w-4 h-4" />
          Add Tags
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-2 max-h-64 overflow-y-auto">
        {allTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left",
              "hover:bg-secondary/60",
              selectedTags.includes(tag.id) && "bg-secondary/40"
            )}
          >
            <span className={cn(
              "w-4 h-4 rounded border flex items-center justify-center",
              selectedTags.includes(tag.id)
                ? "bg-primary border-primary"
                : "border-border"
            )}>
              {selectedTags.includes(tag.id) && (
                <Check className="w-3 h-3 text-primary-foreground" />
              )}
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded border text-xs",
              tag.color
            )}>
              {tag.name}
            </span>
          </button>
        ))}

        {showInput ? (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <input
              ref={inputRef}
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tag name..."
              className="flex-1 px-2 py-1 text-sm bg-secondary/50 border border-border/50 rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
              className="text-primary"
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create custom tag
          </button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="px-3 py-2 border-t border-border/50">
          <Button
            size="sm"
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply {selectedTags.length} {selectedTags.length === 1 ? "tag" : "tags"}
          </Button>
        </div>
      )}
    </div>
  )
}
