"use client"

import { Film, X, CheckCircle, AlertCircle, Loader2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type UploadStatus = "waiting" | "uploading" | "processing" | "complete" | "error"

export interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: UploadStatus
  errorMessage?: string
  folderId: string | null
}

interface UploadItemProps {
  file: UploadFile
  onCancel: (id: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getStatusConfig(status: UploadStatus) {
  switch (status) {
    case "waiting":
      return { 
        label: "Queued", 
        className: "bg-secondary/80 text-muted-foreground border-transparent",
        icon: <Clock className="w-3 h-3" />
      }
    case "uploading":
      return { 
        label: "Uploading", 
        className: "bg-chart-2/20 text-chart-2 border-chart-2/30",
        icon: <Loader2 className="w-3 h-3 animate-spin" />
      }
    case "processing":
      return { 
        label: "Processing", 
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <Loader2 className="w-3 h-3 animate-spin" />
      }
    case "complete":
      return { 
        label: "Complete", 
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <CheckCircle className="w-3 h-3" />
      }
    case "error":
      return { 
        label: "Failed", 
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: <AlertCircle className="w-3 h-3" />
      }
  }
}

export function UploadItem({ file, onCancel }: UploadItemProps) {
  const statusConfig = getStatusConfig(file.status)
  const showProgress = file.status === "uploading" || file.status === "processing"
  const canCancel = file.status === "waiting" || file.status === "uploading"
  
  return (
    <div className={`
      relative group bg-card/40 border border-border/50 rounded-xl p-5 
      transition-all duration-200 hover:bg-card/60 hover:border-border
      ${file.status === "complete" ? "border-primary/20" : ""}
      ${file.status === "error" ? "border-destructive/20" : ""}
    `}>
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          {(file.status === "uploading" || file.status === "processing") && (
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-xl animate-pulse" />
          )}
          <div className={`
            relative w-14 h-14 rounded-xl flex items-center justify-center transition-colors
            ${file.status === "complete" ? "bg-primary/15" : ""}
            ${file.status === "error" ? "bg-destructive/15" : ""}
            ${file.status === "uploading" || file.status === "processing" ? "bg-secondary" : ""}
            ${file.status === "waiting" ? "bg-secondary/60" : ""}
          `}>
            <Film className={`
              w-6 h-6 transition-colors
              ${file.status === "complete" ? "text-primary" : ""}
              ${file.status === "error" ? "text-destructive" : ""}
              ${file.status !== "complete" && file.status !== "error" ? "text-muted-foreground" : ""}
            `} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate leading-tight">{file.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(file.size)}
                {showProgress && (
                  <span className="text-foreground font-medium ml-2">{file.progress}%</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                variant="outline"
                className={`gap-1.5 font-medium text-xs px-2.5 py-1 ${statusConfig.className}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
              {canCancel && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onCancel(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          {file.errorMessage && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {file.errorMessage}
            </p>
          )}
          
          {showProgress && (
            <div className="mt-4">
              <Progress 
                value={file.progress} 
                className="h-1.5 bg-secondary" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
