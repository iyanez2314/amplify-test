"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getContractors,
  createContractorLink,
  revokeContractorLink,
  deleteContractorLink,
} from "@/lib/api/contractors"

export function useContractors(enabled: boolean) {
  return useQuery({
    queryKey: ["contractors"],
    queryFn: getContractors,
    enabled,
  })
}

export function useContractorMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createContractorLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contractors"] }),
  })

  const revokeMutation = useMutation({
    mutationFn: revokeContractorLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contractors"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContractorLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contractors"] }),
  })

  return { createMutation, revokeMutation, deleteMutation }
}
