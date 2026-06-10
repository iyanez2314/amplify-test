export type ContractorStatus = "active" | "expired" | "revoked"

export interface Contractor {
  id: string
  contractorName: string
  dropboxFolder: string
  token: string
  expiresAt: string
  maxUploads: number
  uploadCount: number
  status: ContractorStatus
  uploadLink: string
}
