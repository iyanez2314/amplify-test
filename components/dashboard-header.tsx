"use client";

import Link from "next/link";
import { Play, Bell, Settings, Users, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
  onSignOut?: () => void;
}

export function DashboardHeader({
  onMobileMenuToggle,
  showMobileMenu,
  onSignOut,
}: DashboardHeaderProps = {}) {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-4 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-heading font-semibold tracking-tight text-foreground">
                VideoFlow
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Upload and manage your content
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 md:gap-3">
            {onMobileMenuToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuToggle}
                className="text-muted-foreground hover:text-foreground h-8 w-8 md:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            <Link href="/contractors">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8 md:h-10 md:w-10"
              >
                <Users className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
            <div className="ml-1 md:ml-2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary/80 to-chart-2/80 flex items-center justify-center ring-2 ring-border">
              <span className="text-xs font-semibold text-white">JD</span>
            </div>
            {onSignOut && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSignOut}
                className="text-muted-foreground hover:text-foreground h-8 w-8 md:h-10 md:w-10"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
