"use client"

import { useState } from "react"
import { Archive, Clock, Download, HardDrive, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useArchivedFiles, useArchiveMutations } from "@/hooks/archive/use-archive"
import type { ArchivalStatus } from "@/types/archive"

function getStatusConfig(status: ArchivalStatus) {
  switch (status) {
    case "archived":
      return { label: "Archived", className: "bg-secondary/60 text-muted-foreground border-border/50" }
    case "retrieving":
      return { label: "Retrieving (12-48h)", className: "bg-orange-500/20 text-orange-500 border-orange-500/30" }
    case "ready":
      return { label: "Ready", className: "bg-primary/20 text-primary border-primary/30" }
  }
}

export function GlacierArchiveView() {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { data: files = [] } = useArchivedFiles()
  const { retrievalMutation } = useArchiveMutations()

  const allTags = Array.from(new Set(files.flatMap(f => f.tags)))

  const filtered = files.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(search.toLowerCase()) ||
      file.dropboxPath.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || file.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const totalSizeMB = files.reduce((acc, f) => acc + f.sizeMB, 0)
  const totalSize = totalSizeMB > 1024
    ? `${(totalSizeMB / 1024).toFixed(1)} GB`
    : `${totalSizeMB.toFixed(1)} MB`

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Files</p>
          <p className="text-xl md:text-2xl font-bold text-foreground">{files.length}</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Size</p>
          <p className="text-xl md:text-2xl font-bold text-foreground">{totalSize}</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Retrieving</p>
          <p className="text-xl md:text-2xl font-bold text-orange-500">
            {files.filter(f => f.status === "retrieving").length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files or folders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedTag(null)}
          className={cn(
            "px-2.5 py-1 text-xs rounded-full border transition-colors",
            !selectedTag
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/50"
          )}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-full border transition-colors",
              selectedTag === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/50"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-card/20 border border-border/50 rounded-xl">
            <Archive className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No archived files match your search</p>
          </div>
        )}

        {filtered.map(file => {
          const statusConfig = getStatusConfig(file.status)
          const sizeLabel = file.sizeMB > 1024
            ? `${(file.sizeMB / 1024).toFixed(1)} GB`
            : `${file.sizeMB.toFixed(1)} MB`

          return (
            <div key={file.id} className="bg-card/40 border border-border/50 rounded-xl p-4 hover:bg-card/60 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm text-foreground truncate">{file.fileName}</p>
                      <Badge variant="outline" className={cn("text-xs flex-shrink-0", statusConfig.className)}>
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">{file.dropboxPath}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {sizeLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Archived {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(file.tags ?? []).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-secondary/60 text-muted-foreground text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {file.status === "archived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => retrievalMutation.mutate(file.id)}
                      disabled={retrievalMutation.isPending}
                    >
                      <Download className="w-3 h-3" />
                      Request Retrieval
                    </Button>
                  )}
                  {file.status === "ready" && (
                    <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
