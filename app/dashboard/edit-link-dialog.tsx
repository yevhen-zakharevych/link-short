"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLink } from "./actions";
import type { Link } from "@/db/schema";

export function EditLinkDialog({
  link,
  onLinkUpdated,
}: {
  link: Link;
  onLinkUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    originalUrl: link.originalUrl,
    shortCode: link.shortCode,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await updateLink({
        linkId: link.id,
        originalUrl: formData.originalUrl,
        shortCode: formData.shortCode,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        // Success - close dialog
        setOpen(false);
        onLinkUpdated?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form and error when closing
        setFormData({
          originalUrl: link.originalUrl,
          shortCode: link.shortCode,
        });
        setError(null);
      } else {
        // Refresh form data when opening
        setFormData({
          originalUrl: link.originalUrl,
          shortCode: link.shortCode,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the original URL or short code for this link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="originalUrl">
                Original URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.originalUrl}
                onChange={(e) =>
                  setFormData({ ...formData, originalUrl: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortCode">
                Short Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shortCode"
                type="text"
                placeholder="my-link"
                value={formData.shortCode}
                onChange={(e) =>
                  setFormData({ ...formData, shortCode: e.target.value })
                }
                required
                disabled={loading}
                minLength={3}
                maxLength={20}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
