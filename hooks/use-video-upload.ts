"use client"

import { useCallback, useRef, useState } from "react"
import type { UploadFile, UploadStatus } from "@/components/upload-item"

interface UseVideoUploadOptions {
  maxConcurrentUploads?: number
  simulateErrors?: boolean
}

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
  const { maxConcurrentUploads = 2, simulateErrors = true } = options
  const [files, setFiles] = useState<UploadFile[]>([])
  const uploadQueue = useRef<string[]>([])
  const activeUploads = useRef(new Set<string>())

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const updateFile = useCallback((id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }, [])

  const simulateUpload = useCallback(async (file: UploadFile) => {
    activeUploads.current.add(file.id)
    
    // Start uploading
    updateFile(file.id, { status: "uploading", progress: 0 })
    
    // Simulate upload progress
    const uploadDuration = 3000 + Math.random() * 4000 // 3-7 seconds
    const steps = 20
    const stepDuration = uploadDuration / steps
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, stepDuration))
      const progress = Math.min(Math.round((i / steps) * 85), 85)
      updateFile(file.id, { progress })
    }
    
    // Simulate error randomly (10% chance)
    if (simulateErrors && Math.random() < 0.1) {
      updateFile(file.id, { 
        status: "error", 
        progress: 0,
        errorMessage: "Upload failed. Please try again." 
      })
      activeUploads.current.delete(file.id)
      processQueue()
      return
    }
    
    // Start processing
    updateFile(file.id, { status: "processing", progress: 85 })
    
    // Simulate processing progress
    const processingDuration = 1000 + Math.random() * 2000
    const processingSteps = 10
    const processingStepDuration = processingDuration / processingSteps
    
    for (let i = 1; i <= processingSteps; i++) {
      await new Promise(r => setTimeout(r, processingStepDuration))
      const progress = Math.round(85 + (i / processingSteps) * 15)
      updateFile(file.id, { progress })
    }
    
    // Complete
    updateFile(file.id, { status: "complete", progress: 100 })
    activeUploads.current.delete(file.id)
    
    // Process next in queue
    processQueue()
  }, [updateFile, simulateErrors])

  const processQueue = useCallback(() => {
    while (
      uploadQueue.current.length > 0 && 
      activeUploads.current.size < maxConcurrentUploads
    ) {
      const nextId = uploadQueue.current.shift()
      if (nextId) {
        setFiles(prev => {
          const file = prev.find(f => f.id === nextId)
          if (file && file.status === "waiting") {
            simulateUpload(file)
          }
          return prev
        })
      }
    }
  }, [maxConcurrentUploads, simulateUpload])

  const addFiles = useCallback((newFiles: File[], folderId: string | null = null) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "waiting" as UploadStatus,
      folderId
    }))
    
    setFiles(prev => [...prev, ...uploadFiles])
    
    // Add to queue
    uploadFiles.forEach(f => uploadQueue.current.push(f.id))
    
    // Start processing queue
    setTimeout(processQueue, 100)
  }, [processQueue])

  const cancelUpload = useCallback((id: string) => {
    // Remove from queue if waiting
    uploadQueue.current = uploadQueue.current.filter(qId => qId !== id)
    
    // Remove from files
    setFiles(prev => prev.filter(f => f.id !== id))
    
    // If it was active, process next
    if (activeUploads.current.has(id)) {
      activeUploads.current.delete(id)
      processQueue()
    }
  }, [processQueue])

  const clearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(f => f.status !== "complete"))
  }, [])

  const retryFailed = useCallback(() => {
    setFiles(prev => {
      const failedFiles = prev.filter(f => f.status === "error")
      failedFiles.forEach(f => {
        uploadQueue.current.push(f.id)
      })
      setTimeout(processQueue, 100)
      return prev.map(f => 
        f.status === "error" 
          ? { ...f, status: "waiting" as UploadStatus, progress: 0, errorMessage: undefined }
          : f
      )
    })
  }, [processQueue])

  const getFilesByFolder = useCallback((folderId: string | null) => {
    return files.filter(f => f.folderId === folderId)
  }, [files])

  const groupFilesByFolder = useCallback(() => {
    const groups = new Map<string | null, UploadFile[]>()
    files.forEach(file => {
      const existing = groups.get(file.folderId) || []
      groups.set(file.folderId, [...existing, file])
    })
    return groups
  }, [files])

  return {
    files,
    addFiles,
    cancelUpload,
    clearCompleted,
    retryFailed,
    getFilesByFolder,
    groupFilesByFolder,
    hasCompleted: files.some(f => f.status === "complete"),
    hasFailed: files.some(f => f.status === "error"),
    isUploading: files.some(f => f.status === "uploading" || f.status === "processing")
  }
}
