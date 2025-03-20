import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          MovieDB
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/movies/favorites" className="text-foreground hover:text-primary transition-colors">
                Favorites
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Button onClick={() => router.push("/auth/register")}>
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
