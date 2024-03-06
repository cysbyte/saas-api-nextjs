"use client";

import { signIn } from "next-auth/react";
import React from "react";

const GoogleAuthButton = () => {

  const handleClick = () => {
    signIn('google', {
      callbackUrl: '/'
     });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex w-full bg-white group cursor-pointer py-2 rounded-md justify-center items-center"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_68_3027"
            maskUnits="userSpaceOnUse"
            x="4"
            y="4"
            width="40"
            height="40"
          >
            <path d="M44 4H4V44H44V4Z" fill="white" />
          </mask>
          <g mask="url(#mask0_68_3027)">
            <path
              d="M43.2 24.4539C43.2 23.0357 43.0728 21.6721 42.8364 20.3629H24V28.0993H34.7636C34.3 30.5993 32.891 32.7175 30.7728 34.1357V39.1539H37.2364C41.0182 35.6721 43.2 30.5447 43.2 24.4539Z"
              fill="#4285F4"
            />
            <path
              d="M24.0002 43.9999C29.4002 43.9999 33.9274 42.2089 37.2366 39.1545L30.7728 34.1363C28.982 35.3363 26.691 36.0453 24.0002 36.0453C18.791 36.0453 14.382 32.5271 12.8092 27.7999H6.12744V32.9817C9.41844 39.5181 16.182 43.9999 24.0002 43.9999Z"
              fill="#34A853"
            />
            <path
              d="M12.809 27.8018C12.409 26.6018 12.1818 25.32 12.1818 24.0018C12.1818 22.6836 12.409 21.4018 12.809 20.2018V15.02H6.1272C4.7728 17.72 4 20.7746 4 24.0018C4 27.229 4.7728 30.2836 6.1272 32.9836L12.809 27.8018Z"
              fill="#FBBC04"
            />
            <path
              d="M24.0002 11.9546C26.9366 11.9546 29.5728 12.9636 31.6456 14.9454L37.382 9.209C33.9184 5.9818 29.391 4 24.0002 4C16.182 4 9.41844 8.4818 6.12744 15.0182L12.8092 20.2C14.382 15.4728 18.791 11.9546 24.0002 11.9546Z"
              fill="#E94235"
            />
          </g>
        </svg>
        <p className=" ml-2">Sign in with Google</p>
      </button>
    </div>
  );
};

export default GoogleAuthButton;
