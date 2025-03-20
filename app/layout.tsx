import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movie Web App",
  description: "Browse and search for movies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`min-h-screen bg-[#030711] text-white ${rubik.className} antialiased`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(55, 6, 23, 0.3) 0%, rgba(3, 7, 17, 0.5) 90%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-[#030711]/90 via-[#370617]/70 to-[#6A040F]/60 pointer-events-none z-[-5]"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
