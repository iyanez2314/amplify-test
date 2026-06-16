import { fetchAuthSession } from "aws-amplify/auth"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"
import type { Contractor } from "@/types/contractor"
import outputs from "@/amplify_outputs.json"

const client = generateClient<Schema>()
const apiUrl = (outputs as any).custom?.apiUrl

export async function getContractors(): Promise<Contractor[]> {
  const { data } = await client.models.UploadLink.list()
  return (data ?? []).filter(Boolean).map((item) => ({
    id: item.id,
    contractorName: item.contractorName,
    dropboxFolder: item.dropboxFolder,
    token: item.token,
    expiresAt: item.expiresAt,
    maxUploads: item.maxUploads,
    uploadCount: item.uploadCount,
    status: (item.status ?? "active") as Contractor["status"],
    uploadLink: `${window.location.origin}/upload?token=${item.token}`,
  }))
}

export async function createContractorLink(data: {
  contractorName: string
  dropboxFolder: string
  expiresInHours: number
  maxUploads: number
}) {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()

  const res = await fetch(`${apiUrl}links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ?? "",
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()
  if (!res.ok) throw new Error(result.error ?? "Failed to generate link")
  return result
}

export async function revokeContractorLink(id: string) {
  return client.models.UploadLink.update({ id, status: "revoked" })
}

export async function deleteContractorLink(id: string) {
  return client.models.UploadLink.delete({ id })
}
