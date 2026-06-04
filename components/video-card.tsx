"use client"

import { Play, HardDrive, Check } from "lucide-react"
import type { Video } from "@/types/folder"
import { TagBadge } from "@/components/tag-badge"
import { VideoActionMenu } from "@/components/video-action-menu"
import { cn } from "@/lib/utils"

interface VideoCardProps {
  video: Video
  isSelected?: boolean
  onSelect?: (id: string) => void
  selectionMode?: boolean
  customTags?: string[]
  onUpdateTags?: (videoId: string, tags: string[]) => void
  onCreateCustomTag?: (name: string) => void
  onRename?: (videoId: string, newName: string) => void
  onDelete?: (videoId: string) => void
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function VideoCard({
  video,
  isSelected,
  onSelect,
  selectionMode,
  customTags = [],
  onUpdateTags,
  onCreateCustomTag,
  onRename,
  onDelete
}: VideoCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(video.id)
    }
  }

  const handleUpdateTags = (tags: string[]) => {
    if (onUpdateTags) {
      onUpdateTags(video.id, tags)
    }
  }

  const handleRename = (newName: string) => {
    if (onRename) {
      onRename(video.id, newName)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(video.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative bg-card/40 border rounded-xl transition-all cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-border/50 hover:bg-card/60 hover:border-border hover:shadow-lg"
      )}
    >
      {/* Action menu - positioned outside thumbnail to avoid clipping */}
      {onUpdateTags && onCreateCustomTag && onRename && onDelete && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <VideoActionMenu
            videoId={video.id}
            videoName={video.name}
            currentTags={video.tags}
            customTags={customTags}
            onUpdateTags={handleUpdateTags}
            onCreateCustomTag={onCreateCustomTag}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </div>
      )}

      <div className="relative aspect-video bg-secondary/50 rounded-t-xl overflow-hidden">
        {(selectionMode || isSelected) && (
          <div
            className={cn(
              "absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all z-10",
              isSelected
                ? "bg-primary border-primary"
                : "bg-background/80 border-border group-hover:border-muted-foreground"
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "w-12 h-12 rounded-full bg-background/80 flex items-center justify-center transition-opacity",
            selectionMode ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          )}>
            <Play className="w-5 h-5 text-foreground ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-background/90 rounded text-xs font-medium text-foreground">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-medium text-foreground text-sm truncate mb-2">
          {video.name}
        </h4>

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {video.tags.slice(0, 3).map(tagId => (
              <TagBadge key={tagId} tagId={tagId} size="sm" />
            ))}
            {video.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {formatFileSize(video.size)}
          </span>
        </div>
      </div>
    </div>
  )
}

export { formatDuration, formatFileSize }
