export interface Folder {
  id: string
  name: string
  parentId: string | null
}

export interface FolderState {
  folders: Folder[]
  selectedFolderId: string | null
  expandedFolderIds: Set<string>
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Video {
  id: string
  name: string
  folderId: string
  duration: number // seconds
  size: number // bytes
  thumbnailUrl: string
  tags: string[] // tag ids
}

export const PREDEFINED_TAGS: Tag[] = [
  { id: "draft", name: "Draft", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  { id: "review", name: "Review", color: "bg-orange-500/20 text-orange-500 border-orange-500/30" },
  { id: "approved", name: "Approved", color: "bg-green-500/20 text-green-500 border-green-500/30" },
  { id: "final", name: "Final", color: "bg-primary/20 text-primary border-primary/30" },
  { id: "archived", name: "Archived", color: "bg-muted text-muted-foreground border-border" },
]

export const MOCK_FOLDERS: Folder[] = [
  { id: "1", name: "Projects", parentId: null },
  { id: "2", name: "Client A", parentId: "1" },
  { id: "3", name: "Client B", parentId: "1" },
  { id: "4", name: "Archive", parentId: null },
  { id: "5", name: "2024", parentId: "4" },
]

export const MOCK_VIDEOS: Video[] = [
  { id: "v1", name: "Product Demo v2.mp4", folderId: "2", duration: 245, size: 156000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["approved", "final"] },
  { id: "v2", name: "Client Meeting Recording.mp4", folderId: "2", duration: 3620, size: 890000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["draft"] },
  { id: "v3", name: "Brand Guidelines Overview.mp4", folderId: "2", duration: 180, size: 95000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["review"] },
  { id: "v4", name: "Q4 Campaign Spot.mp4", folderId: "3", duration: 30, size: 45000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["final"] },
  { id: "v5", name: "Behind the Scenes.mp4", folderId: "3", duration: 420, size: 320000000, thumbnailUrl: "/api/placeholder/320/180", tags: [] },
  { id: "v6", name: "Annual Review 2024.mp4", folderId: "5", duration: 1800, size: 1200000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["archived"] },
  { id: "v7", name: "Team Highlights.mp4", folderId: "5", duration: 300, size: 180000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["approved"] },
  { id: "v8", name: "Conference Keynote.mp4", folderId: "5", duration: 2700, size: 1500000000, thumbnailUrl: "/api/placeholder/320/180", tags: ["final", "approved"] },
]
