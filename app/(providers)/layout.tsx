import { TanstackQueryProvider } from "@/tanstack-query/client";
import React, { PropsWithChildren } from "react";

function ProvidersLayout({ children }: PropsWithChildren) {
  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
}

export default ProvidersLayout;
