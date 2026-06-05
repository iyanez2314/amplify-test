"use client"

import { createPortal } from "react-dom"
import { X, FolderPlus, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderTreeItem } from "@/components/folder-tree-item"
import type { Folder } from "@/types/folder"
import type { UploadFile } from "@/components/upload-item"
import { cn } from "@/lib/utils"

interface MobileFolderDrawerProps {
  isOpen: boolean
  folders: Folder[]
  selectedFolderId: string | null
  expandedFolderIds: Set<string>
  files: UploadFile[]
  onClose: () => void
  onSelectFolder: (id: string | null) => void
  onToggleExpand: (id: string) => void
  onCreateFolder: () => void
  hasChildren: (id: string) => boolean
  getChildFolders: (parentId: string | null) => Folder[]
}

export function MobileFolderDrawer({
  isOpen,
  folders,
  selectedFolderId,
  expandedFolderIds,
  files,
  onClose,
  onSelectFolder,
  onToggleExpand,
  onCreateFolder,
  hasChildren,
  getChildFolders
}: MobileFolderDrawerProps) {
  const getFileCountForFolder = (folderId: string | null) => {
    return files.filter(f => f.folderId === folderId).length
  }

  const handleSelectFolder = (id: string | null) => {
    onSelectFolder(id)
    onClose()
  }

  const handleCreateFolder = () => {
    onClose()
    onCreateFolder()
  }

  const renderFolderTree = (parentId: string | null, level: number = 0): React.ReactNode => {
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
        onSelect={handleSelectFolder}
        onToggleExpand={onToggleExpand}
      >
        {renderFolderTree(folder.id, level + 1)}
      </FolderTreeItem>
    ))
  }

  if (!isOpen || typeof window === "undefined") {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Folders</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCreateFolder}
              className="text-muted-foreground hover:text-foreground"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <button
            onClick={() => handleSelectFolder(null)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors text-left mb-1",
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
          </button>

          <div className="h-px bg-border/50 my-2" />

          {renderFolderTree(null)}
        </div>
      </div>
    </div>,
    document.body
  )
}
