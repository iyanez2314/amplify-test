"use client"

import { ChevronRight, Folder, FolderOpen } from "lucide-react"
import type { Folder as FolderType } from "@/types/folder"
import { cn } from "@/lib/utils"

interface FolderTreeItemProps {
  folder: FolderType
  level: number
  isSelected: boolean
  isExpanded: boolean
  hasChildren: boolean
  fileCount?: number
  onSelect: (id: string) => void
  onToggleExpand: (id: string) => void
  children?: React.ReactNode
}

export function FolderTreeItem({
  folder,
  level,
  isSelected,
  isExpanded,
  hasChildren,
  fileCount = 0,
  onSelect,
  onToggleExpand,
  children
}: FolderTreeItemProps) {
  const handleClick = () => {
    onSelect(folder.id)
  }

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpand(folder.id)
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left",
          "hover:bg-secondary/60",
          isSelected && "bg-primary/15 text-primary hover:bg-primary/20"
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        <span
          onClick={handleChevronClick}
          className={cn(
            "w-4 h-4 flex items-center justify-center rounded transition-transform cursor-pointer",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        </span>

        {isExpanded && hasChildren ? (
          <FolderOpen className={cn(
            "w-4 h-4 flex-shrink-0",
            isSelected ? "text-primary" : "text-muted-foreground"
          )} />
        ) : (
          <Folder className={cn(
            "w-4 h-4 flex-shrink-0",
            isSelected ? "text-primary" : "text-muted-foreground"
          )} />
        )}

        <span className={cn(
          "flex-1 truncate",
          isSelected ? "font-medium" : "text-foreground"
        )}>
          {folder.name}
        </span>

        {fileCount > 0 && (
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary/60 rounded">
            {fileCount}
          </span>
        )}
      </button>

      {isExpanded && hasChildren && (
        <div className="mt-0.5">
          {children}
        </div>
      )}
    </div>
  )
}
