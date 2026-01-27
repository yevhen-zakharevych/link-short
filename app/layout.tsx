import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Shorten your links with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="font-sans antialiased">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Link Shortener</h1>
              <nav className="flex gap-2">
                <SignedOut>
                  <div className="flex gap-2">
                    <SignInButton>
                      <Button variant="outline">Sign In</Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button>Sign Up</Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
