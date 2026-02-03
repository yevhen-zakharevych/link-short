"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";
import type { Link } from "@/db/schema";

export function LinkCard({
  link,
  formattedDate,
}: {
  link: Link;
  formattedDate: string;
}) {
  const router = useRouter();

  const handleLinkChanged = () => {
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {link.originalUrl}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Short code: <Badge variant="secondary">{link.shortCode}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <EditLinkDialog link={link} onLinkUpdated={handleLinkChanged} />
            <DeleteLinkDialog link={link} onLinkDeleted={handleLinkChanged} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Created: {formattedDate}
        </div>
      </CardContent>
    </Card>
  );
}
