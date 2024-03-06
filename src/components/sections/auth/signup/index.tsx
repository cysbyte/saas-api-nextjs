"use client";
import AppleAuthButton from "@/components/sections/auth/AppleAuthButton";
import GoogleAuthButton from "@/components/sections/auth/GoogleAuthButton";
import Link from "next/link";
import React from "react"; //]

const Case = () => {
  return (
    <section className="flex flex-col justify-center items-center h-screen">
<div className="-mt-20 w-[350px]">
        <GoogleAuthButton />
      </div>
      <div className="mt-7 w-[350px]">
        <AppleAuthButton />
      </div>

      <p className="mt-8 max-w-[78%] md:max-w-full text-center">
        <span className="text-slate-600 ">
          {" "}
          By signing up, you agree to our{" "}
        </span>
        <span className="ml-1 underline">
          <Link href="">Terms of Service</Link>
        </span>
        <span className="text-slate-600 "> and </span>
        <span className="ml-1 underline">
          <Link href="">Privacy Policy</Link>
        </span>
      </p>
    </section>
  );
};

export default Case;
