"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import { createLink } from "./actions";

export function CreateLinkDialog({
  onLinkCreated,
}: {
  onLinkCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    originalUrl: "",
    shortCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await createLink({
        originalUrl: formData.originalUrl,
        shortCode: formData.shortCode || undefined,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        // Success - close dialog and reset form
        setOpen(false);
        setFormData({ originalUrl: "", shortCode: "" });
        onLinkCreated?.();
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
        setFormData({ originalUrl: "", shortCode: "" });
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Shortened Link</DialogTitle>
            <DialogDescription>
              Enter a URL to shorten. Optionally provide a custom short code.
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
                Custom Short Code{" "}
                <span className="text-muted-foreground text-sm">
                  (optional)
                </span>
              </Label>
              <Input
                id="shortCode"
                type="text"
                placeholder="my-link"
                value={formData.shortCode}
                onChange={(e) =>
                  setFormData({ ...formData, shortCode: e.target.value })
                }
                disabled={loading}
                minLength={3}
                maxLength={20}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to auto-generate a random code
              </p>
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
              Create Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
