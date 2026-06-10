"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ContractorList } from "@/components/contractor-list"
import { CreateContractorDialog } from "@/components/create-contractor-dialog"
import { CredentialsDialog } from "@/components/credentials-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchAuthSession } from "aws-amplify/auth"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"
import type { Contractor } from "@/types/contractor"
import { useAuth } from "@/hooks/use-auth"

const client = generateClient<Schema>()

export default function ContractorsPage() {
  const { isAdmin, isLoading, isAuthenticated, handleSignOut } = useAuth()
  const router = useRouter()
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newCredentials, setNewCredentials] = useState<{ name: string; link: string } | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login")
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadContractors()
  }, [isAuthenticated])

  const loadContractors = async () => {
    try {
      const { data } = await client.models.UploadLink.list()
      const mapped: Contractor[] = (data ?? []).filter(Boolean).map((item) => ({
        id: item.id,
        contractorName: item.contractorName,
        dropboxFolder: item.dropboxFolder,
        token: item.token,
        expiresAt: item.expiresAt,
        maxUploads: item.maxUploads,
        uploadCount: item.uploadCount,
        status: (item.status ?? "active") as Contractor["status"],
        uploadLink: `${process.env.NEXT_PUBLIC_APP_URL}/upload?token=${item.token}`,
      }))
      setContractors(mapped)
    } catch (err) {
      console.error("Failed to load contractors", err)
    }
  }

  const handleCreateContractor = useCallback(async (data: {
    contractorName: string
    dropboxFolder: string
    expiresInHours: number
    maxUploads: number
  }) => {
    setCreating(true)
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setCreateDialogOpen(false)
      setNewCredentials({ name: data.contractorName, link: result.link })
      await loadContractors()
    } catch (err: any) {
      console.error("Failed to create contractor link", err)
    } finally {
      setCreating(false)
    }
  }, [])

  const handleRevokeAccess = useCallback(async (id: string) => {
    try {
      await client.models.UploadLink.update({ id, status: "revoked" })
      setContractors(prev => prev.map(c => c.id === id ? { ...c, status: "revoked" } : c))
    } catch (err) {
      console.error("Failed to revoke access", err)
    }
  }, [])

  const handleDeleteContractor = useCallback(async (id: string) => {
    try {
      await client.models.UploadLink.delete({ id })
      setContractors(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error("Failed to delete contractor", err)
    }
  }, [])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuthenticated) return null

  const activeCount = contractors.filter(c => c.status === "active").length
  const expiredCount = contractors.filter(c => c.status === "expired").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onSignOut={handleSignOut} />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Contractor Access</h1>
                <p className="text-sm md:text-base text-muted-foreground">Manage temporary upload links</p>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4" />
                Add Contractor
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-xl md:text-2xl font-bold text-foreground">{contractors.length}</p>
          </div>
          <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-xl md:text-2xl font-bold text-primary">{activeCount}</p>
          </div>
          <div className="bg-card/40 border border-border/50 rounded-xl p-3 md:p-4">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Expired</p>
            <p className="text-xl md:text-2xl font-bold text-orange-500">{expiredCount}</p>
          </div>
        </div>

        <ContractorList
          contractors={contractors}
          isAdmin={isAdmin}
          onRevoke={handleRevokeAccess}
          onDelete={handleDeleteContractor}
        />
      </main>

      <CreateContractorDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateContractor}
        loading={creating}
      />

      <CredentialsDialog
        isOpen={newCredentials !== null}
        credentials={newCredentials}
        onClose={() => setNewCredentials(null)}
      />
    </div>
  )
}
