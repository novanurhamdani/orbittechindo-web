"use client";

import { ReactNode } from "react";
import { useRedirectAuthenticated } from "@/lib/utils/auth";
import { MainLayout } from "@/components/layout";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  // Redirect authenticated users away from auth pages
  useRedirectAuthenticated();

  return (
    <MainLayout>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 md:p-8">
          {children}
        </div>
      </main>
    </MainLayout>
  );
}
