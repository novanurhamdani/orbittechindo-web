"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRedirectAuthenticated } from "@/lib/utils/auth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  // Redirect authenticated users away from auth pages
  useRedirectAuthenticated();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            MovieDB
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 md:p-8">
          {children}
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MovieDB. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
