"use client"

import { useState } from "react"
import { Tag, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagSelector } from "@/components/tag-selector"

interface BulkActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  onApplyTags: (tags: string[]) => void
  onDelete?: () => void
  customTags: string[]
  onCreateCustomTag: (name: string) => void
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onApplyTags,
  onDelete,
  customTags,
  onCreateCustomTag
}: BulkActionBarProps) {
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleApplyTags = () => {
    onApplyTags(selectedTags)
    setSelectedTags([])
    setShowTagSelector(false)
  }

  const handleCloseTagSelector = () => {
    if (selectedTags.length > 0) {
      handleApplyTags()
    } else {
      setShowTagSelector(false)
    }
  }

  return (
    <div className="sticky bottom-4 mx-auto w-fit">
      <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl shadow-xl">
        <div className="flex items-center gap-2 pr-3 border-r border-border">
          <span className="text-sm font-medium text-foreground">
            {selectedCount} selected
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagSelector(!showTagSelector)}
            className="gap-2"
          >
            <Tag className="w-4 h-4" />
            Add Tags
          </Button>

          {showTagSelector && (
            <TagSelector
              selectedTags={selectedTags}
              customTags={customTags}
              onTagsChange={setSelectedTags}
              onCreateCustomTag={onCreateCustomTag}
              onClose={handleCloseTagSelector}
            />
          )}
        </div>

        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
