export type ArchivalStatus = "archived" | "retrieving" | "ready"

export interface ArchivedFile {
  id: string
  fileName: string
  s3Key: string
  sizeMB: number
  tags: string[]
  dropboxPath: string
  archivedBy: string
  status: ArchivalStatus
  retrievalRequestedAt?: string
  retrievalReadyAt?: string
  createdAt: string
}
