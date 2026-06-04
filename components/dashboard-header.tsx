"use client"

import Link from "next/link"
import { Play, Bell, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-heading font-semibold tracking-tight text-foreground">
                VideoFlow
              </h1>
              <p className="text-sm text-muted-foreground">
                Upload and manage your content
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/contractors">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Users className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-chart-2/80 flex items-center justify-center ring-2 ring-border">
              <span className="text-xs font-semibold text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
