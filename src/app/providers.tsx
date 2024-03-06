"use client";

import { SessionProvider } from "next-auth/react";
import Providers from "./store/Provider";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>
    <Providers>
    {children}      
    </Providers>
  </SessionProvider>;
};