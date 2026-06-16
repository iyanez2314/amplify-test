import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"
import type { ArchivedFile } from "@/types/archive"

const client = generateClient<Schema>()

export async function getArchivedFiles(): Promise<ArchivedFile[]> {
  const { data } = await client.models.ArchivedFile.list()
  return (data ?? []).filter(Boolean).map((item) => ({
    id: item.id,
    fileName: item.fileName,
    s3Key: item.s3Key,
    sizeMB: item.sizeMB,
    tags: (item.tags ?? []).filter((t): t is string => t !== null),
    dropboxPath: item.dropboxPath,
    archivedBy: item.archivedBy,
    status: (item.status ?? "archived") as ArchivedFile["status"],
    retrievalRequestedAt: item.retrievalRequestedAt ?? undefined,
    retrievalReadyAt: item.retrievalReadyAt ?? undefined,
    createdAt: item.createdAt,
  }))
}

export async function requestRetrieval(id: string) {
  return client.models.ArchivedFile.update({
    id,
    status: "retrieving",
    retrievalRequestedAt: new Date().toISOString(),
  })
}
