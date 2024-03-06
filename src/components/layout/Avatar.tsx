"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  name: string | undefined | null;
  imageUrl: string | undefined | null;
};

const Avatar = (props: Props) => {
    const [isShowingSignout, setIsShowingSignout] = useState(false);
    
    const handleSignout = () => {
        signOut();
    }

  return (
    <div className="relative">
      <div
        onClick={() => setIsShowingSignout(!isShowingSignout)}
        className="group relative cursor-pointer flex justify-center items-center gap-x-2"
      >
        <h3 className="max-w-[100px] truncate ..">{props.name?.split(" ")[0]}</h3>
        <img
          className=" w-[35px] h-[35px] rounded-full"
          src={props.imageUrl?.toString()}
          alt="avatar"
        />
      </div>
          {isShowingSignout&&<div
              className={`visible absolute z-50 pt-4 text-center flex w-full flex-col bg-white py-1 rounded-md text-gray-800 shadow-xl`}
          >
              <button onClick={handleSignout}
                  className="my-2 block border-b border-gray-100 py-2 font-normal text-black hover:bg-gray-100 rounded-md md:mx-2"
              >
                  Sign Out
              </button>
          </div>
          }
    </div>
  );
};

export default Avatar;
