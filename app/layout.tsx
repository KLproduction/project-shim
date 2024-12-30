import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "@/react-query/provider";
import { ReduxProvider } from "@/redux/provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <ReactQueryProvider>
          <body className={cn("min-h-screen antialiased")}>{children}</body>
        </ReactQueryProvider>
      </ReduxProvider>
    </html>
  );
}
