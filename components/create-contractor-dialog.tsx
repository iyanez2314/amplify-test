"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateContractorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    linkName: string;
    contractorName: string;
    dropboxFolder: string;
    expiresInHours: number;
    maxUploads: number;
    tags: string[];
  }) => void;
  loading?: boolean;
}

export function CreateContractorDialog({
  isOpen,
  onClose,
  onCreate,
  loading = false,
}: CreateContractorDialogProps) {
  const [linkName, setLinkName] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [dropboxFolder, setDropboxFolder] = useState("");
  const [expiryDays, setExpiryDays] = useState(2);
  const [maxUploads, setMaxUploads] = useState(10);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLinkName("");
      setContractorName("");
      setDropboxFolder("");
      setExpiryDays(2);
      setMaxUploads(10);
      setTagInput("");
      setTags([]);
    }
  }, [isOpen]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      linkName: linkName.trim(),
      contractorName: contractorName.trim(),
      dropboxFolder: dropboxFolder.trim(),
      expiresInHours: expiryDays * 24,
      maxUploads,
      tags,
    });
  };

  if (!isOpen) return null;

  const dialog = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Add Contractor
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Link Name
            </label>
            <input
              type="text"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder="John-episode-58-pittsburgh"
              className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">A label to identify this link</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contractor Name
            </label>
            <input
              type="text"
              value={contractorName}
              onChange={(e) => setContractorName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dropbox Folder
            </label>
            <input
              type="text"
              value={dropboxFolder}
              onChange={(e) => setDropboxFolder(e.target.value)}
              placeholder="/projects/shoot-june"
              className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              The Dropbox folder path files will be uploaded to
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Access Duration
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Uploads
              </label>
              <input
                type="number"
                value={maxUploads}
                onChange={(e) => setMaxUploads(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
              className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/15 text-primary text-xs rounded-full"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary/70">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={
                loading || !linkName.trim() || !contractorName.trim() || !dropboxFolder.trim()
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Generating..." : "Generate Link"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(dialog, document.body)
    : null;
}
