"use client"

import { Suspense, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ContractorList } from "@/components/contractor-list"
import { CreateContractorDialog } from "@/components/create-contractor-dialog"
import { CredentialsDialog } from "@/components/credentials-dialog"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/auth/use-auth"
import { useContractors, useContractorMutations } from "@/hooks/contractors/use-contractors"

function ContractorListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-secondary/40 rounded-xl" />)}
      </div>
      {[1, 2, 3].map(i => <div key={i} className="h-28 bg-secondary/30 rounded-xl" />)}
    </div>
  )
}

function ContractorData({
  isAdmin,
  onNewCredentials,
  createDialogOpen,
  setCreateDialogOpen,
}: {
  isAdmin: boolean
  onNewCredentials: (creds: { name: string; link: string }) => void
  createDialogOpen: boolean
  setCreateDialogOpen: (open: boolean) => void
}) {
  const { data: contractors = [] } = useContractors()
  const { createMutation, revokeMutation, deleteMutation } = useContractorMutations()

  const activeCount = contractors.filter(c => c.status === "active").length
  const expiredCount = contractors.filter(c => c.status === "expired").length

  return (
    <>
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
        onRevoke={(id) => revokeMutation.mutate(id)}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <CreateContractorDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={(data) => createMutation.mutate(data, {
          onSuccess: (result) => onNewCredentials({ name: data.contractorName, link: result.link })
        })}
        loading={createMutation.isPending}
      />
    </>
  )
}

function ContractorsContent() {
  const { isAdmin, handleSignOut } = useAuth()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCredentials, setNewCredentials] = useState<{ name: string; link: string } | null>(null)

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

        <Suspense fallback={<ContractorListSkeleton />}>
          <ContractorData
            isAdmin={isAdmin}
            onNewCredentials={setNewCredentials}
            createDialogOpen={createDialogOpen}
            setCreateDialogOpen={setCreateDialogOpen}
          />
        </Suspense>
      </main>

      <CredentialsDialog
        isOpen={newCredentials !== null}
        credentials={newCredentials}
        onClose={() => setNewCredentials(null)}
      />
    </div>
  )
}

export default function ContractorsPage() {
  return (
    <AuthGuard>
      <ContractorsContent />
    </AuthGuard>
  )
}
