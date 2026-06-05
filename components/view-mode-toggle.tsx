"use client"

import { Film, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ViewMode = "videos" | "upload"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  videoCount: number
  uploadCount: number
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
  videoCount,
  uploadCount
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("videos")}
        className={cn(
          "gap-2 text-muted-foreground",
          viewMode === "videos" && "bg-background text-foreground shadow-sm"
        )}
      >
        <Film className="w-4 h-4" />
        Videos
        {videoCount > 0 && (
          <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
            {videoCount}
          </span>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("upload")}
        className={cn(
          "gap-2 text-muted-foreground",
          viewMode === "upload" && "bg-background text-foreground shadow-sm"
        )}
      >
        <Upload className="w-4 h-4" />
        Upload
        {uploadCount > 0 && (
          <span className="text-xs bg-chart-2/20 text-chart-2 px-1.5 py-0.5 rounded">
            {uploadCount}
          </span>
        )}
      </Button>
    </div>
  )
}
