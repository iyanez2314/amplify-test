"use client"

import { FolderPlus, PanelLeftClose, PanelLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderTreeItem } from "@/components/folder-tree-item"
import type { Folder } from "@/types/folder"
import type { UploadFile } from "@/components/upload-item"
import { cn } from "@/lib/utils"

interface FolderTreeSidebarProps {
  folders: Folder[]
  selectedFolderId: string | null
  expandedFolderIds: Set<string>
  files: UploadFile[]
  isCollapsed: boolean
  onSelectFolder: (id: string | null) => void
  onToggleExpand: (id: string) => void
  onToggleCollapse: () => void
  onCreateFolder: () => void
  hasChildren: (id: string) => boolean
  getChildFolders: (parentId: string | null) => Folder[]
}

export function FolderTreeSidebar({
  folders,
  selectedFolderId,
  expandedFolderIds,
  files,
  isCollapsed,
  onSelectFolder,
  onToggleExpand,
  onToggleCollapse,
  onCreateFolder,
  hasChildren,
  getChildFolders
}: FolderTreeSidebarProps) {
  const getFileCountForFolder = (folderId: string | null) => {
    return files.filter(f => f.folderId === folderId).length
  }

  const renderFolderTree = (parentId: string | null, level: number = 0) => {
    const childFolders = getChildFolders(parentId)

    return childFolders.map(folder => (
      <FolderTreeItem
        key={folder.id}
        folder={folder}
        level={level}
        isSelected={selectedFolderId === folder.id}
        isExpanded={expandedFolderIds.has(folder.id)}
        hasChildren={hasChildren(folder.id)}
        fileCount={getFileCountForFolder(folder.id)}
        onSelect={onSelectFolder}
        onToggleExpand={onToggleExpand}
      >
        {renderFolderTree(folder.id, level + 1)}
      </FolderTreeItem>
    ))
  }

  if (isCollapsed) {
    return (
      <div className="hidden md:flex w-12 flex-shrink-0 border-r border-border/50 bg-card/30 flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground"
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onSelectFolder(null)}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            selectedFolderId === null && "bg-primary/15 text-primary"
          )}
        >
          <Home className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex w-64 flex-shrink-0 border-r border-border/50 bg-card/30 flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Folders</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCreateFolder}
            className="text-muted-foreground hover:text-foreground"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => onSelectFolder(null)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left mb-1",
            "hover:bg-secondary/60",
            selectedFolderId === null && "bg-primary/15 text-primary hover:bg-primary/20"
          )}
        >
          <Home className={cn(
            "w-4 h-4",
            selectedFolderId === null ? "text-primary" : "text-muted-foreground"
          )} />
          <span className={cn(
            "flex-1",
            selectedFolderId === null && "font-medium"
          )}>
            All Files
          </span>
          {getFileCountForFolder(null) > 0 && (
            <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary/60 rounded">
              {getFileCountForFolder(null)}
            </span>
          )}
        </button>

        <div className="h-px bg-border/50 my-2" />

        {renderFolderTree(null)}

        {folders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No folders yet
          </div>
        )}
      </div>
    </div>
  )
}
