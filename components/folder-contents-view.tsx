"use client"

import { useState, useCallback } from "react"
import { Grid3X3, List, Film, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoCard } from "@/components/video-card"
import { VideoListItem } from "@/components/video-list-item"
import { BulkActionBar } from "@/components/bulk-action-bar"
import type { Video, Folder } from "@/types/folder"
import { cn } from "@/lib/utils"

interface FolderContentsViewProps {
  folder: Folder
  videos: Video[]
  onUpdateVideoTags: (videoIds: string[], tags: string[]) => void
  onSetVideoTags: (videoId: string, tags: string[]) => void
  customTags: string[]
  onCreateCustomTag: (name: string) => void
  onRenameVideo: (videoId: string, newName: string) => void
  onDeleteVideo: (videoId: string) => void
}

export function FolderContentsView({
  folder,
  videos,
  onUpdateVideoTags,
  onSetVideoTags,
  customTags,
  onCreateCustomTag,
  onRenameVideo,
  onDeleteVideo
}: FolderContentsViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState(false)

  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      if (next.size === 0) {
        setSelectionMode(false)
      } else {
        setSelectionMode(true)
      }
      return next
    })
  }, [])

  const handleSelectAll = () => {
    if (selectedIds.size === videos.length) {
      setSelectedIds(new Set())
      setSelectionMode(false)
    } else {
      setSelectedIds(new Set(videos.map(v => v.id)))
      setSelectionMode(true)
    }
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
    setSelectionMode(false)
  }

  const handleApplyTags = (tags: string[]) => {
    onUpdateVideoTags(Array.from(selectedIds), tags)
    handleClearSelection()
  }

  const handleSingleVideoTags = useCallback((videoId: string, tags: string[]) => {
    onSetVideoTags(videoId, tags)
  }, [onSetVideoTags])

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-5">
          <Film className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No videos in this folder
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Upload videos to &quot;{folder.name}&quot; to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="relative pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Film className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground tracking-tight">
              {folder.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
              {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className={cn(
              "gap-2",
              selectedIds.size === videos.length && "bg-primary/10 border-primary/30"
            )}
          >
            <CheckSquare className="w-4 h-4" />
            {selectedIds.size === videos.length ? "Deselect All" : "Select All"}
          </Button>

          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "text-muted-foreground",
                viewMode === "grid" && "bg-background text-foreground shadow-sm"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "text-muted-foreground",
                viewMode === "list" && "bg-background text-foreground shadow-sm"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-visible">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isSelected={selectedIds.has(video.id)}
              onSelect={handleSelect}
              selectionMode={selectionMode}
              customTags={customTags}
              onUpdateTags={handleSingleVideoTags}
              onCreateCustomTag={onCreateCustomTag}
              onRename={onRenameVideo}
              onDelete={onDeleteVideo}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {videos.map(video => (
            <VideoListItem
              key={video.id}
              video={video}
              isSelected={selectedIds.has(video.id)}
              onSelect={handleSelect}
              selectionMode={selectionMode}
              customTags={customTags}
              onUpdateTags={handleSingleVideoTags}
              onCreateCustomTag={onCreateCustomTag}
              onRename={onRenameVideo}
              onDelete={onDeleteVideo}
            />
          ))}
        </div>
      )}

      {selectedIds.size > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.size}
          onClearSelection={handleClearSelection}
          onApplyTags={handleApplyTags}
          customTags={customTags}
          onCreateCustomTag={onCreateCustomTag}
        />
      )}
    </div>
  )
}
