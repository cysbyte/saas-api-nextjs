import Header from "@/components/layout/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    // const session = await getServerSession(authOptions)
    // if (session) {
    //     console.log('user is logged in!')
    // } else {
    //     redirect('/api/auth/signin')
    // }
  return (
    <div className="m-auto w-full">
      {children}
    </div>
  );
};

export default AuthLayout;