export type ContractorStatus = "active" | "expired" | "revoked"

export interface Contractor {
  id: string
  name: string
  email: string
  username: string
  password: string
  assignedFolderIds: string[]
  createdAt: Date
  expiresAt: Date
  status: ContractorStatus
}

export const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@contractor.com",
    username: "john.smith.temp",
    password: "Xk9#mP2$vL",
    assignedFolderIds: ["2"],
    createdAt: new Date("2026-05-15"),
    expiresAt: new Date("2026-07-15"),
    status: "active"
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.j@freelance.io",
    username: "sarah.j.temp",
    password: "Qw3$nR8@yT",
    assignedFolderIds: ["2", "3"],
    createdAt: new Date("2026-05-01"),
    expiresAt: new Date("2026-06-01"),
    status: "expired"
  },
  {
    id: "c3",
    name: "Mike Chen",
    email: "mike.chen@studio.com",
    username: "mike.c.temp",
    password: "Bz7!kH4#pM",
    assignedFolderIds: ["5"],
    createdAt: new Date("2026-06-01"),
    expiresAt: new Date("2026-08-01"),
    status: "active"
  }
]

export function generateUsername(name: string): string {
  const base = name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "")
  return `${base}.temp`
}

export function generatePassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%"
  let password = ""
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function generateId(): string {
  return "c" + Math.random().toString(36).substring(2, 9)
}
