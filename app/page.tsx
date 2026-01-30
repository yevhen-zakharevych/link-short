import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, BarChart3, Lock, Zap, Shield, Globe } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 py-16">
          <Badge variant="secondary" className="text-sm">
            Fast • Secure • Analytics
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            Shorten Links,
            <span className="text-primary"> Amplify</span> Your Reach
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl">
            Transform long, complex URLs into short, memorable links. Track
            engagement, boost conversions, and take control of your digital
            presence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </SignUpButton>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage and optimize your
              links effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Instant Link Shortening</CardTitle>
                <CardDescription>
                  Transform any URL into a clean, branded short link in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Custom branded domains</li>
                  <li>• Bulk link creation</li>
                  <li>• QR code generation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Track clicks, analyze traffic sources, and understand your
                  audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time click tracking</li>
                  <li>• Geographic insights</li>
                  <li>• Device & browser data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Enterprise-grade security to protect your links and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Password protection</li>
                  <li>• Link expiration</li>
                  <li>• Private link management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized infrastructure for instant redirects worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Global CDN delivery</li>
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Sub-second redirects</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Link Management</CardTitle>
                <CardDescription>
                  Organize, edit, and control all your shortened links in one
                  place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dashboard overview</li>
                  <li>• Link editing & updates</li>
                  <li>• Archive & restore</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Share your links anywhere, anytime, with anyone around the
                  world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Social media integration</li>
                  <li>• API access for developers</li>
                  <li>• Export & share reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <Card className="max-w-3xl mx-auto border-primary/20">
            <CardContent className="pt-12 pb-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Join thousands of users who trust our platform for their link
                management needs. Start shortening your links today!
              </p>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8">
                  Create Your Free Account
                </Button>
              </SignUpButton>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
