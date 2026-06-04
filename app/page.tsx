"use client"

import { useState, useCallback, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { VideoUploadZone } from "@/components/video-upload-zone"
import { UploadStats } from "@/components/upload-stats"
import { FolderTreeSidebar } from "@/components/folder-tree-sidebar"
import { FolderBreadcrumb } from "@/components/folder-breadcrumb"
import { FolderGroup } from "@/components/folder-group"
import { CreateFolderDialog } from "@/components/create-folder-dialog"
import { FolderContentsView } from "@/components/folder-contents-view"
import { useVideoUpload } from "@/hooks/use-video-upload"
import { useFolders } from "@/hooks/use-folders"
import { Button } from "@/components/ui/button"
import { Trash2, RotateCcw, ListVideo, Upload, Film } from "lucide-react"
import { MOCK_VIDEOS, type Video } from "@/types/folder"
import { cn } from "@/lib/utils"

type ViewMode = "videos" | "upload"

export default function VideoUploadDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("videos")
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS)
  const [customTags, setCustomTags] = useState<string[]>([])

  const {
    files,
    addFiles,
    cancelUpload,
    clearCompleted,
    retryFailed,
    hasCompleted,
    hasFailed,
  } = useVideoUpload()

  const {
    folders,
    selectedFolderId,
    expandedFolderIds,
    selectFolder,
    toggleExpand,
    createFolder,
    getFolderPath,
    getChildFolders,
    getFolderById,
    hasChildren
  } = useFolders()

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    addFiles(newFiles, selectedFolderId)
    setViewMode("upload")
  }, [addFiles, selectedFolderId])

  const handleCreateFolder = useCallback((name: string) => {
    createFolder(name, selectedFolderId)
  }, [createFolder, selectedFolderId])

  const handleSelectFolder = useCallback((id: string | null) => {
    selectFolder(id)
    setViewMode("videos")
  }, [selectFolder])

  // For bulk tagging - adds tags to existing ones
  const handleUpdateVideoTags = useCallback((videoIds: string[], newTags: string[]) => {
    setVideos(prev => prev.map(video => {
      if (videoIds.includes(video.id)) {
        const existingTags = new Set(video.tags)
        newTags.forEach(tag => existingTags.add(tag))
        return { ...video, tags: Array.from(existingTags) }
      }
      return video
    }))
  }, [])

  // For single video - replaces tags entirely
  const handleSetVideoTags = useCallback((videoId: string, tags: string[]) => {
    setVideos(prev => prev.map(video =>
      video.id === videoId ? { ...video, tags } : video
    ))
  }, [])

  const handleCreateCustomTag = useCallback((name: string) => {
    setCustomTags(prev => [...prev, name])
  }, [])

  const handleRenameVideo = useCallback((videoId: string, newName: string) => {
    setVideos(prev => prev.map(video =>
      video.id === videoId ? { ...video, name: newName } : video
    ))
  }, [])

  const handleDeleteVideo = useCallback((videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId))
  }, [])

  const selectedFolderPath = selectedFolderId
    ? getFolderPath(selectedFolderId)
    : []

  const selectedFolder = selectedFolderId
    ? getFolderById(selectedFolderId)
    : null

  const folderVideos = useMemo(() => {
    if (!selectedFolderId) return []
    return videos.filter(v => v.folderId === selectedFolderId)
  }, [selectedFolderId, videos])

  const groupedFiles = useMemo(() => {
    const groups = new Map<string | null, typeof files>()

    files.forEach(file => {
      const existing = groups.get(file.folderId) || []
      groups.set(file.folderId, [...existing, file])
    })

    return Array.from(groups.entries()).map(([folderId, groupFiles]) => ({
      folderId,
      folderName: folderId ? getFolderById(folderId)?.name || "Unknown" : null,
      files: groupFiles
    }))
  }, [files, getFolderById])

  const showFolderContents = selectedFolderId && viewMode === "videos"
  const showUploadView = !selectedFolderId || viewMode === "upload"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <FolderTreeSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          expandedFolderIds={expandedFolderIds}
          files={files}
          isCollapsed={sidebarCollapsed}
          onSelectFolder={handleSelectFolder}
          onToggleExpand={toggleExpand}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onCreateFolder={() => setCreateFolderOpen(true)}
          hasChildren={hasChildren}
          getChildFolders={getChildFolders}
        />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <FolderBreadcrumb
                path={selectedFolderPath}
                onNavigate={handleSelectFolder}
              />

              {selectedFolderId && (
                <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("videos")}
                    className={cn(
                      "gap-2 text-muted-foreground",
                      viewMode === "videos" && "bg-background text-foreground shadow-sm"
                    )}
                  >
                    <Film className="w-4 h-4" />
                    Videos
                    {folderVideos.length > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                        {folderVideos.length}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("upload")}
                    className={cn(
                      "gap-2 text-muted-foreground",
                      viewMode === "upload" && "bg-background text-foreground shadow-sm"
                    )}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                    {files.length > 0 && (
                      <span className="text-xs bg-chart-2/20 text-chart-2 px-1.5 py-0.5 rounded">
                        {files.length}
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {showFolderContents && selectedFolder && (
              <FolderContentsView
                folder={selectedFolder}
                videos={folderVideos}
                onUpdateVideoTags={handleUpdateVideoTags}
                onSetVideoTags={handleSetVideoTags}
                customTags={customTags}
                onCreateCustomTag={handleCreateCustomTag}
                onRenameVideo={handleRenameVideo}
                onDeleteVideo={handleDeleteVideo}
              />
            )}

            {showUploadView && (
              <>
                <VideoUploadZone
                  onFilesSelected={handleFilesSelected}
                  disabled={false}
                />

                <UploadStats files={files} />

                {files.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
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
                            onClick={retryFailed}
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
                            onClick={clearCompleted}
                            className="gap-2 border-border/50 hover:bg-secondary"
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear Done
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {groupedFiles.map(({ folderId, folderName, files: groupFiles }) => (
                        <FolderGroup
                          key={folderId || "unfiled"}
                          folderName={folderName}
                          files={groupFiles}
                          onCancelUpload={cancelUpload}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {files.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-5">
                      <ListVideo className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      No videos uploaded yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      {selectedFolder
                        ? `Drag and drop video files to upload to "${selectedFolder.name}"`
                        : "Select a folder from the sidebar, then drag and drop your video files"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <CreateFolderDialog
        isOpen={createFolderOpen}
        parentFolderName={selectedFolder?.name}
        onClose={() => setCreateFolderOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  )
}
