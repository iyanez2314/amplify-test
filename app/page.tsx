"use client"

import { useState, useCallback, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { VideoUploadZone } from "@/components/video-upload-zone"
import { UploadStats } from "@/components/upload-stats"
import { FolderTreeSidebar } from "@/components/folder-tree-sidebar"
import { FolderBreadcrumb } from "@/components/folder-breadcrumb"
import { CreateFolderDialog } from "@/components/create-folder-dialog"
import { FolderContentsView } from "@/components/folder-contents-view"
import { MobileFolderDrawer } from "@/components/mobile-folder-drawer"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { UploadQueueSection } from "@/components/upload-queue-section"
import { EmptyUploadState } from "@/components/empty-upload-state"
import { useVideoUpload } from "@/hooks/use-video-upload"
import { useFolders } from "@/hooks/use-folders"
import { useVideos } from "@/hooks/use-videos"
import { useAuth } from "@/hooks/auth/use-auth"
import { GlacierArchiveView } from "@/components/glacier-archive-view"
import { AuthGuard } from "@/components/auth-guard"
import { Database, HardDrive, ChevronDown } from "lucide-react"

type ViewMode = "videos" | "upload"
type StorageMode = "dropbox" | "glacier"

function DashboardContent() {
  const { isAdmin, handleSignOut } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("videos")
  const [storageMode, setStorageMode] = useState<StorageMode>("dropbox")
  const [storageDropdownOpen, setStorageDropdownOpen] = useState(false)

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

  const {
    customTags,
    addTagsToVideos,
    setVideoTags,
    createCustomTag,
    renameVideo,
    deleteVideo,
    getVideosForFolder
  } = useVideos()

  const selectedFolder = selectedFolderId ? getFolderById(selectedFolderId) : null
  const selectedFolderPath = selectedFolderId ? getFolderPath(selectedFolderId) : []
  const folderVideos = useMemo(() => getVideosForFolder(selectedFolderId), [getVideosForFolder, selectedFolderId])

  const getFolderName = useCallback((folderId: string) => {
    return getFolderById(folderId)?.name
  }, [getFolderById])

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

  const showFolderContents = selectedFolderId && viewMode === "videos"
  const showUploadView = !selectedFolderId || viewMode === "upload"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader
        onMobileMenuToggle={() => setMobileMenuOpen(true)}
        showMobileMenu={mobileMenuOpen}
        onSignOut={handleSignOut}
      />

      <MobileFolderDrawer
        isOpen={mobileMenuOpen}
        folders={folders}
        selectedFolderId={selectedFolderId}
        expandedFolderIds={expandedFolderIds}
        files={files}
        onClose={() => setMobileMenuOpen(false)}
        onSelectFolder={handleSelectFolder}
        onToggleExpand={toggleExpand}
        onCreateFolder={() => setCreateFolderOpen(true)}
        hasChildren={hasChildren}
        getChildFolders={getChildFolders}
      />

      <div className="flex flex-1">
        {storageMode === "dropbox" && <FolderTreeSidebar
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
        />}

        <main className="flex-1 px-4 md:px-8 py-4 md:py-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative">
                <button
                  onClick={() => setStorageDropdownOpen(!storageDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-card/40 border border-border/50 rounded-lg hover:bg-card/60 transition-colors"
                >
                  {storageMode === "dropbox"
                    ? <><Database className="w-4 h-4 text-primary" /> Dropbox Files</>
                    : <><HardDrive className="w-4 h-4 text-primary" /> Glacier Archive</>
                  }
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>

                {storageDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStorageDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                      <button
                        onClick={() => { setStorageMode("dropbox"); setStorageDropdownOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/60 transition-colors"
                      >
                        <Database className="w-4 h-4 text-primary" />
                        Dropbox Files
                      </button>
                      <button
                        onClick={() => { setStorageMode("glacier"); setStorageDropdownOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/60 transition-colors"
                      >
                        <HardDrive className="w-4 h-4 text-primary" />
                        Glacier Archive
                      </button>
                    </div>
                  </>
                )}
              </div>

              <FolderBreadcrumb
                path={selectedFolderPath}
                onNavigate={handleSelectFolder}
              />

              {storageMode === "dropbox" && selectedFolderId && (
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  videoCount={folderVideos.length}
                  uploadCount={files.length}
                />
              )}
            </div>

            {storageMode === "glacier" && <GlacierArchiveView />}

            {storageMode === "dropbox" && showFolderContents && selectedFolder && (
              <FolderContentsView
                folder={selectedFolder}
                videos={folderVideos}
                onUpdateVideoTags={addTagsToVideos}
                onSetVideoTags={setVideoTags}
                customTags={customTags}
                onCreateCustomTag={createCustomTag}
                onRenameVideo={renameVideo}
                onDeleteVideo={deleteVideo}
              />
            )}

            {storageMode === "dropbox" && showUploadView && (
              <>
                <VideoUploadZone
                  onFilesSelected={handleFilesSelected}
                  disabled={false}
                />

                <UploadStats files={files} />

                {files.length > 0 && (
                  <UploadQueueSection
                    files={files}
                    hasFailed={hasFailed}
                    hasCompleted={hasCompleted}
                    onRetryFailed={retryFailed}
                    onClearCompleted={clearCompleted}
                    onCancelUpload={cancelUpload}
                    getFolderName={getFolderName}
                  />
                )}

                {files.length === 0 && (
                  <EmptyUploadState folderName={selectedFolder?.name} />
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

export default function VideoUploadDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
