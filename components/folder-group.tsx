"use client"

import { useState } from "react"
import { ChevronRight, Folder, Home } from "lucide-react"
import { UploadItem } from "@/components/upload-item"
import type { UploadFile } from "@/components/upload-item"
import { cn } from "@/lib/utils"

interface FolderGroupProps {
  folderName: string | null
  files: UploadFile[]
  onCancelUpload: (id: string) => void
  defaultExpanded?: boolean
}

export function FolderGroup({
  folderName,
  files,
  onCancelUpload,
  defaultExpanded = true
}: FolderGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const completedCount = files.filter(f => f.status === "complete").length
  const inProgressCount = files.filter(
    f => f.status === "uploading" || f.status === "processing"
  ).length
  const errorCount = files.filter(f => f.status === "error").length

  const aggregateProgress = files.length > 0
    ? Math.round(files.reduce((sum, f) => sum + f.progress, 0) / files.length)
    : 0

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/20">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <ChevronRight
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-90"
          )}
        />

        {folderName ? (
          <Folder className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Home className="w-4 h-4 text-muted-foreground" />
        )}

        <span className="font-medium text-foreground">
          {folderName || "Unfiled"}
        </span>

        <div className="flex items-center gap-2 ml-auto text-xs">
          {inProgressCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-chart-2/20 text-chart-2">
              {inProgressCount} uploading ({aggregateProgress}%)
            </span>
          )}
          {completedCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">
              {completedCount} complete
            </span>
          )}
          {errorCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-destructive/20 text-destructive">
              {errorCount} failed
            </span>
          )}
          <span className="text-muted-foreground">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {files.map(file => (
            <UploadItem
              key={file.id}
              file={file}
              onCancel={onCancelUpload}
            />
          ))}
        </div>
      )}
    </div>
  )
}
