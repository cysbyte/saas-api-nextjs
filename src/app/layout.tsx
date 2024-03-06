import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RecordModal from "@/components/shared/RecordModal";
import { useEffect } from "react";
import favicon from "./favicon.ico";
import { NextAuthProvider } from "./providers";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { authConfig } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Minimax AI Voice Generator",
  description: "Minimax AI Voice Generator",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  // console.log(session)
  if (session && session.user) {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email?.toString(),
      },
    });
    if (!user) {
      const new_user = await prisma.user.create({
        data: {
          username:
            session?.user?.name?.toString() == null
              ? ""
              : session?.user?.name?.toString(),
          email:
            session?.user?.email?.toString() == null
              ? ""
              : session?.user?.email?.toString(),
        },
      });
      console.log(user)
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
