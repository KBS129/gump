import React from "react";
import "./globals.css";
import { TanstackQueryProvider } from "@/tanstack-query/client";
import { ModalProvider } from "./(providers)/(_providers)/ModalProvider";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <head></head>
      <body>
        <TanstackQueryProvider>
          <ModalProvider>{children}</ModalProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
