export type ContractorStatus = "active" | "expired" | "revoked"

export interface Contractor {
  id: string
  linkName: string
  contractorName: string
  dropboxFolder: string
  token: string
  expiresAt: string
  maxUploads: number
  uploadCount: number
  status: ContractorStatus
  tags: string[]
  createdBy: string
  uploadLink: string
}
