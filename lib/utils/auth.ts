import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Hook to protect routes
export function useProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the intended destination to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/auth/login");
    }
  }, [isAuthenticated, router, pathname]);

  return isAuthenticated;
}

// Hook to redirect authenticated users away from auth pages
export function useRedirectAuthenticated(redirectTo = "/") {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, router, redirectTo]);

  return !isAuthenticated;
}
