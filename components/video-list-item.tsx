"use client"

import { Play, Clock, HardDrive, Film, Check } from "lucide-react"
import type { Video } from "@/types/folder"
import { TagBadge } from "@/components/tag-badge"
import { VideoActionMenu } from "@/components/video-action-menu"
import { formatDuration, formatFileSize } from "./video-card"
import { cn } from "@/lib/utils"

interface VideoListItemProps {
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

export function VideoListItem({
  video,
  isSelected,
  onSelect,
  selectionMode,
  customTags = [],
  onUpdateTags,
  onCreateCustomTag,
  onRename,
  onDelete
}: VideoListItemProps) {
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
        "group flex items-center gap-4 p-3 border rounded-xl transition-all cursor-pointer",
        isSelected
          ? "bg-primary/5 border-primary"
          : "bg-card/40 border-border/50 hover:bg-card/60 hover:border-border"
      )}
    >
      {(selectionMode || isSelected) && (
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
            isSelected
              ? "bg-primary border-primary"
              : "bg-background border-border group-hover:border-muted-foreground"
          )}
        >
          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
      )}

      <div className="relative w-32 aspect-video bg-secondary/50 rounded-lg overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity bg-background/30",
          selectionMode ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        )}>
          <div className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 text-foreground ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-background/90 rounded text-[10px] font-medium text-foreground">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate mb-1">
          {video.name}
        </h4>

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {video.tags.map(tagId => (
              <TagBadge key={tagId} tagId={tagId} size="sm" />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(video.duration)}
          </span>
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            {formatFileSize(video.size)}
          </span>
        </div>
      </div>

      {onUpdateTags && onCreateCustomTag && onRename && onDelete && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
    </div>
  )
}
