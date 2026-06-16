"use client"

import { useState } from "react"
import { Archive, Clock, Download, HardDrive, Search, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type RetrievalStatus = "archived" | "retrieving" | "ready"

interface ArchivedFile {
  id: string
  name: string
  folder: string
  size: string
  tags: string[]
  archivedAt: string
  status: RetrievalStatus
}

const MOCK_ARCHIVED_FILES: ArchivedFile[] = [
  {
    id: "1",
    name: "episode-42-raw-footage.mxf",
    folder: "/projects/episode-42",
    size: "48.2 GB",
    tags: ["episode-42", "pittsburgh", "raw"],
    archivedAt: "2026-05-10",
    status: "archived",
  },
  {
    id: "2",
    name: "interview-b-roll-4k.mxf",
    folder: "/projects/episode-40",
    size: "22.7 GB",
    tags: ["episode-40", "interview", "b-roll"],
    archivedAt: "2026-05-02",
    status: "retrieving",
  },
  {
    id: "3",
    name: "outdoor-shoot-day2.mxf",
    folder: "/projects/episode-38",
    size: "61.4 GB",
    tags: ["episode-38", "outdoor", "day2"],
    archivedAt: "2026-04-18",
    status: "ready",
  },
  {
    id: "4",
    name: "studio-session-master.mxf",
    folder: "/projects/episode-36",
    size: "33.1 GB",
    tags: ["episode-36", "studio"],
    archivedAt: "2026-04-01",
    status: "archived",
  },
  {
    id: "5",
    name: "drone-footage-4k.mxf",
    folder: "/projects/episode-35",
    size: "18.9 GB",
    tags: ["episode-35", "drone", "aerial"],
    archivedAt: "2026-03-22",
    status: "archived",
  },
]

function getStatusConfig(status: RetrievalStatus) {
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

  const allTags = Array.from(new Set(MOCK_ARCHIVED_FILES.flatMap(f => f.tags)))

  const filtered = MOCK_ARCHIVED_FILES.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase()) ||
      file.folder.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || file.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const totalSize = "184.3 GB"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Files</p>
          <p className="text-xl md:text-2xl font-bold text-foreground">{MOCK_ARCHIVED_FILES.length}</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Size</p>
          <p className="text-xl md:text-2xl font-bold text-foreground">{totalSize}</p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Retrieving</p>
          <p className="text-xl md:text-2xl font-bold text-orange-500">
            {MOCK_ARCHIVED_FILES.filter(f => f.status === "retrieving").length}
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
          return (
            <div key={file.id} className="bg-card/40 border border-border/50 rounded-xl p-4 hover:bg-card/60 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
                      <Badge variant="outline" className={cn("text-xs flex-shrink-0", statusConfig.className)}>
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">{file.folder}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {file.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Archived {file.archivedAt}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {file.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-secondary/60 text-muted-foreground text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {file.status === "archived" && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
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
