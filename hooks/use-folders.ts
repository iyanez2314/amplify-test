"use client"

import { useCallback, useState } from "react"
import type { Folder } from "@/types/folder"
import { MOCK_FOLDERS } from "@/types/folder"

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(["1", "4"])
  )

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const selectFolder = useCallback((id: string | null) => {
    setSelectedFolderId(id)
  }, [])

  const toggleExpand = useCallback((id: string) => {
    setExpandedFolderIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const createFolder = useCallback((name: string, parentId: string | null) => {
    const newFolder: Folder = {
      id: generateId(),
      name,
      parentId
    }
    setFolders(prev => [...prev, newFolder])
    return newFolder
  }, [])

  const deleteFolder = useCallback((id: string) => {
    setFolders(prev => {
      const idsToDelete = new Set<string>()

      const collectDescendants = (folderId: string) => {
        idsToDelete.add(folderId)
        prev
          .filter(f => f.parentId === folderId)
          .forEach(f => collectDescendants(f.id))
      }

      collectDescendants(id)
      return prev.filter(f => !idsToDelete.has(f.id))
    })

    if (selectedFolderId === id) {
      setSelectedFolderId(null)
    }
  }, [selectedFolderId])

  const renameFolder = useCallback((id: string, newName: string) => {
    setFolders(prev =>
      prev.map(f => f.id === id ? { ...f, name: newName } : f)
    )
  }, [])

  const getFolderPath = useCallback((id: string): Folder[] => {
    const path: Folder[] = []
    let currentId: string | null = id

    while (currentId) {
      const folder = folders.find(f => f.id === currentId)
      if (folder) {
        path.unshift(folder)
        currentId = folder.parentId
      } else {
        break
      }
    }

    return path
  }, [folders])

  const getChildFolders = useCallback((parentId: string | null): Folder[] => {
    return folders.filter(f => f.parentId === parentId)
  }, [folders])

  const getFolderById = useCallback((id: string): Folder | undefined => {
    return folders.find(f => f.id === id)
  }, [folders])

  const hasChildren = useCallback((id: string): boolean => {
    return folders.some(f => f.parentId === id)
  }, [folders])

  return {
    folders,
    selectedFolderId,
    expandedFolderIds,
    selectFolder,
    toggleExpand,
    createFolder,
    deleteFolder,
    renameFolder,
    getFolderPath,
    getChildFolders,
    getFolderById,
    hasChildren
  }
}
