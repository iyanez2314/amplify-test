"use client"

import { ChevronRight, Home } from "lucide-react"
import type { Folder } from "@/types/folder"
import { cn } from "@/lib/utils"

interface FolderBreadcrumbProps {
  path: Folder[]
  onNavigate: (folderId: string | null) => void
}

export function FolderBreadcrumb({ path, onNavigate }: FolderBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      <button
        onClick={() => onNavigate(null)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
          path.length === 0 && "text-foreground font-medium"
        )}
      >
        <Home className="w-3.5 h-3.5" />
        <span>All Files</span>
      </button>

      {path.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mx-1" />
          <button
            onClick={() => onNavigate(folder.id)}
            className={cn(
              "px-2 py-1 rounded-md transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              index === path.length - 1 && "text-foreground font-medium"
            )}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </nav>
  )
}
