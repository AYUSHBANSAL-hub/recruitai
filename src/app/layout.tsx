// src/app/layout.tsx
  import { Inter } from "next/font/google";
  import "./globals.css";
import { Toaster } from "sonner";
  
  const inter = Inter({ subsets: ["latin"] });
  
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen bg-gray-50">
            {children}
            <Toaster/>
          </main>
        </body>
      </html>
    );
  }
  
