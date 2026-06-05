"use client"

import { useState, useCallback, useMemo } from "react"
import { MOCK_VIDEOS, type Video } from "@/types/folder"

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS)
  const [customTags, setCustomTags] = useState<string[]>([])

  // For bulk tagging - adds tags to existing ones
  const addTagsToVideos = useCallback((videoIds: string[], newTags: string[]) => {
    setVideos(prev => prev.map(video => {
      if (videoIds.includes(video.id)) {
        const existingTags = new Set(video.tags)
        newTags.forEach(tag => existingTags.add(tag))
        return { ...video, tags: Array.from(existingTags) }
      }
      return video
    }))
  }, [])

  // For single video - replaces tags entirely
  const setVideoTags = useCallback((videoId: string, tags: string[]) => {
    setVideos(prev => prev.map(video =>
      video.id === videoId ? { ...video, tags } : video
    ))
  }, [])

  const createCustomTag = useCallback((name: string) => {
    setCustomTags(prev => [...prev, name])
  }, [])

  const renameVideo = useCallback((videoId: string, newName: string) => {
    setVideos(prev => prev.map(video =>
      video.id === videoId ? { ...video, name: newName } : video
    ))
  }, [])

  const deleteVideo = useCallback((videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId))
  }, [])

  const getVideosForFolder = useCallback((folderId: string | null) => {
    if (!folderId) return []
    return videos.filter(v => v.folderId === folderId)
  }, [videos])

  return {
    videos,
    customTags,
    addTagsToVideos,
    setVideoTags,
    createCustomTag,
    renameVideo,
    deleteVideo,
    getVideosForFolder
  }
}
