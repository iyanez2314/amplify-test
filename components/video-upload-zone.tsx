"use client"

import { useCallback, useState } from "react"
import { Upload, Film, CloudUpload } from "lucide-react"

interface VideoUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function VideoUploadZone({ onFilesSelected, disabled }: VideoUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith("video/")
    )
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }, [disabled, onFilesSelected])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0) {
      onFilesSelected(files)
    }
    e.target.value = ""
  }, [onFilesSelected])

  return (
    <div className="relative">
      {isDragOver && (
        <div className="absolute -inset-2 bg-primary/10 blur-2xl rounded-3xl pointer-events-none" />
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer
          bg-gradient-to-b from-card/50 to-card
          ${isDragOver 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-border/70 hover:border-primary/40 hover:bg-card/80"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {isDragOver && (
              <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse" />
            )}
            <div className={`
              relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragOver 
                ? "bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30" 
                : "bg-secondary/80"
              }
            `}>
              {isDragOver ? (
                <Film className="w-9 h-9 text-primary-foreground" />
              ) : (
                <CloudUpload className="w-9 h-9 text-muted-foreground" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-heading font-semibold text-foreground tracking-tight">
              {isDragOver ? "Drop your videos here" : "Drag and drop video files"}
            </p>
            <p className="text-muted-foreground">
              or <span className="text-primary font-medium hover:underline">browse</span> from your computer
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-muted-foreground/80">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              MP4, MOV, AVI, WebM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Up to 2GB per file
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
