import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "./dashboard-header";
import { LinkCard } from "./link-card";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getUserLinks(userId);

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader />

      <div className="space-y-4">
        {userLinks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No links yet. Create your first shortened link!
              </p>
            </CardContent>
          </Card>
        ) : (
          userLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              formattedDate={new Date(link.createdAt).toLocaleDateString()}
            />
          ))
        )}
      </div>
    </div>
  );
}
