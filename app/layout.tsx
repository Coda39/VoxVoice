// app/layout.tsx
import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes"; // Assuming ThemeProvider is used here or imported

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VOX Voice Research Project",
  description:
    "Help contribute to an open voice database for a student machine learning project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {/* Ensure ThemeProvider wraps the children that need theme context */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem // Recommended to respect system preference
          // disableTransitionOnChange // Can sometimes help with theme flashes
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
