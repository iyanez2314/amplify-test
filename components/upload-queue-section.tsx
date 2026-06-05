"use client"

import { useMemo } from "react"
import { ListVideo, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderGroup } from "@/components/folder-group"
import type { UploadFile } from "@/components/upload-item"

interface UploadQueueSectionProps {
  files: UploadFile[]
  hasFailed: boolean
  hasCompleted: boolean
  onRetryFailed: () => void
  onClearCompleted: () => void
  onCancelUpload: (id: string) => void
  getFolderName: (folderId: string) => string | undefined
}

export function UploadQueueSection({
  files,
  hasFailed,
  hasCompleted,
  onRetryFailed,
  onClearCompleted,
  onCancelUpload,
  getFolderName
}: UploadQueueSectionProps) {
  const groupedFiles = useMemo(() => {
    const groups = new Map<string | null, UploadFile[]>()
    files.forEach(file => {
      const existing = groups.get(file.folderId) || []
      groups.set(file.folderId, [...existing, file])
    })
    return Array.from(groups.entries()).map(([folderId, groupFiles]) => ({
      folderId,
      folderName: folderId ? getFolderName(folderId) || "Unknown" : null,
      files: groupFiles
    }))
  }, [files, getFolderName])
  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ListVideo className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground tracking-tight">
              Upload Queue
            </h2>
            <p className="text-sm text-muted-foreground">
              {files.length} {files.length === 1 ? "file" : "files"} in queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasFailed && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryFailed}
              className="gap-2 border-border/50 hover:bg-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Failed
            </Button>
          )}
          {hasCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCompleted}
              className="gap-2 border-border/50 hover:bg-secondary"
            >
              <Trash2 className="w-4 h-4" />
              Clear Done
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {groupedFiles.map(({ folderId, folderName, files }) => (
          <FolderGroup
            key={folderId || "unfiled"}
            folderName={folderName}
            files={files}
            onCancelUpload={onCancelUpload}
          />
        ))}
      </div>
    </section>
  )
}
