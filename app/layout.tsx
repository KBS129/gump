import React from "react";
import "./globals.css";
import { TanstackQueryProvider } from "@/tanstack-query/client";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
      <TanstackQueryProvider>
      {children}
      </TanstackQueryProvider>
      </body>
    </html>
  );
}
