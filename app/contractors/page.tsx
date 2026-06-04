"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ContractorList } from "@/components/contractor-list"
import { CreateContractorDialog } from "@/components/create-contractor-dialog"
import { CredentialsDialog } from "@/components/credentials-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  MOCK_CONTRACTORS,
  type Contractor,
  generateId,
  generateUsername,
  generatePassword
} from "@/types/contractor"
import { MOCK_FOLDERS } from "@/types/folder"

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>(MOCK_CONTRACTORS)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCredentials, setNewCredentials] = useState<{
    name: string
    username: string
    password: string
  } | null>(null)

  const handleCreateContractor = useCallback((data: {
    name: string
    email: string
    folderIds: string[]
    expiresAt: Date
  }) => {
    const username = generateUsername(data.name)
    const password = generatePassword()

    const newContractor: Contractor = {
      id: generateId(),
      name: data.name,
      email: data.email,
      username,
      password,
      assignedFolderIds: data.folderIds,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
      status: "active"
    }

    setContractors(prev => [newContractor, ...prev])
    setCreateDialogOpen(false)
    setNewCredentials({
      name: data.name,
      username,
      password
    })
  }, [])

  const handleRevokeAccess = useCallback((id: string) => {
    setContractors(prev => prev.map(c =>
      c.id === id ? { ...c, status: "revoked" as const } : c
    ))
  }, [])

  const handleExtendAccess = useCallback((id: string, newExpiry: Date) => {
    setContractors(prev => prev.map(c =>
      c.id === id ? { ...c, expiresAt: newExpiry, status: "active" as const } : c
    ))
  }, [])

  const handleDeleteContractor = useCallback((id: string) => {
    setContractors(prev => prev.filter(c => c.id !== id))
  }, [])

  const activeCount = contractors.filter(c => c.status === "active").length
  const expiredCount = contractors.filter(c => c.status === "expired").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Contractor Access
                </h1>
                <p className="text-muted-foreground">
                  Manage temporary accounts for external contractors
                </p>
              </div>
            </div>

            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4" />
              Add Contractor
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card/40 border border-border/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Contractors</p>
            <p className="text-2xl font-bold text-foreground">{contractors.length}</p>
          </div>
          <div className="bg-card/40 border border-border/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-primary">{activeCount}</p>
          </div>
          <div className="bg-card/40 border border-border/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Expired</p>
            <p className="text-2xl font-bold text-orange-500">{expiredCount}</p>
          </div>
        </div>

        <ContractorList
          contractors={contractors}
          folders={MOCK_FOLDERS}
          onRevoke={handleRevokeAccess}
          onExtend={handleExtendAccess}
          onDelete={handleDeleteContractor}
        />
      </main>

      <CreateContractorDialog
        isOpen={createDialogOpen}
        folders={MOCK_FOLDERS}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateContractor}
      />

      <CredentialsDialog
        isOpen={newCredentials !== null}
        credentials={newCredentials}
        onClose={() => setNewCredentials(null)}
      />
    </div>
  )
}
