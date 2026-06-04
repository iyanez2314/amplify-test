"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Upload, CheckCircle, Loader, AlertTriangle } from "lucide-react"
import type { UploadFile } from "./upload-item"

interface UploadStatsProps {
  files: UploadFile[]
}

export function UploadStats({ files }: UploadStatsProps) {
  const totalFiles = files.length
  const uploading = files.filter(f => f.status === "uploading" || f.status === "processing").length
  const completed = files.filter(f => f.status === "complete").length
  const errors = files.filter(f => f.status === "error").length

  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: Upload,
      gradient: "from-secondary to-secondary/70",
      iconColor: "text-foreground"
    },
    {
      label: "In Progress",
      value: uploading,
      icon: Loader,
      gradient: "from-chart-2/20 to-chart-2/10",
      iconColor: "text-chart-2",
      animate: uploading > 0
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      gradient: "from-primary/20 to-primary/10",
      iconColor: "text-primary"
    },
    {
      label: "Failed",
      value: errors,
      icon: AlertTriangle,
      gradient: "from-destructive/20 to-destructive/10",
      iconColor: "text-destructive"
    }
  ]

  if (totalFiles === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/60 border-border/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={`
                relative w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} 
                flex items-center justify-center
              `}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor} ${stat.animate ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <p className="text-3xl font-heading font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
