"use client"

import { ListVideo } from "lucide-react"

interface EmptyUploadStateProps {
  folderName?: string | null
}

export function EmptyUploadState({ folderName }: EmptyUploadStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-5">
        <ListVideo className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
        No videos uploaded yet
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {folderName
          ? `Drag and drop video files to upload to "${folderName}"`
          : "Select a folder from the sidebar, then drag and drop your video files"}
      </p>
    </div>
  )
}
