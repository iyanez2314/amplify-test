"use client"

import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getArchivedFiles, requestRetrieval } from "@/lib/api/archive"

export function useArchivedFiles() {
  return useSuspenseQuery({
    queryKey: ["archived-files"],
    queryFn: getArchivedFiles,
  })
}

export function useArchiveMutations() {
  const queryClient = useQueryClient()

  const retrievalMutation = useMutation({
    mutationFn: requestRetrieval,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["archived-files"] }),
  })

  return { retrievalMutation }
}
