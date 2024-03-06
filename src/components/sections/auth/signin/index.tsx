import AppleAuthButton from "@/components/sections/auth/AppleAuthButton";
import GoogleAuthButton from "@/components/sections/auth/GoogleAuthButton";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react"; 

const Case = () => {

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <div className="-mt-20 w-[350px]">
        <GoogleAuthButton />
      </div>
      <div className="mt-7 w-[350px]">
        <AppleAuthButton />
      </div>
      <p className="mt-8"> <span className="text-slate-600 "> Don’t have an account? </span><span className="ml-1 underline"><Link href=''>Create an account</Link></span></p>
    </section>
  );
};

export default Case;
