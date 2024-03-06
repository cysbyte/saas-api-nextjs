import Image from "next/image";
import Link from "next/link";
import React from "react";
import Wrapper from "@/components/shared/Wrapper";
import logo from "public/logo.png";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Avatar from "./Avatar";

const Header = async () => {

  const session = await getServerSession(authConfig);

  return (
    <header className="h-auto z-20 sticky inset-0 backdrop-blur-md py-0 bg-white bg-opacity-90">
      <Wrapper>
        <div className="flex justify-between py-5 items-center">
          <Link className="hover:text-teal-700 duration-300" href={"/"}>
            <div>
              <Image className="w-[69]" src={logo} alt="Minimax AI Voice Generator" />
            </div>
          </Link>

          <div className="m-auto hidden lg:block">
            <ul className="flex h-full items-center duration-300 gap-x-4 sm:gap-x-8 text-16">
              <li className="group cursor-pointer hover:text-teal-700">
                <div className="group relative flex gap-x-2 items-center justify-center">
                  <p>Products</p>
                  <div className="relative ml-1 flex h-full items-center justify-center">
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute group-hover:invisible"
                    >
                      <path
                        d="M3.5 4.5L6.5 7.5L9.5 4.5"
                        stroke="#111827"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute invisible group-hover:visible"
                    >
                      <path
                        d="M9.5 7.5L6.5 4.5L3.5 7.5"
                        stroke="#0F172A"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="invisible absolute z-50 pt-4 flex w-[15%] flex-col bg-white py-1 px-4 rounded-md text-gray-800 shadow-xl group-hover:visible">
                  <Link href='/product/text-to-speech' className="y-2 block border-b border-gray-100 py-2 font-normal text-black hover:bg-gray-100 rounded-md md:mx-2">
                    Text to Speech
                  </Link>

                  <Link href='/product/voice/main/0'  className="my-2 block border-b border-gray-100 py-2 font-normal text-black hover:bg-gray-100 rounded-md md:mx-2">
                    Voice Clone
                  </Link>
                  <a className="my-2 block border-b border-gray-100 py-2 font-normal text-black hover:bg-gray-100 rounded-md md:mx-2">
                    API
                  </a>
                  <a className="my-2 block border-b border-gray-100 py-2 font-normal text-black hover:bg-gray-100 rounded-md md:mx-2">
                    Voice Chat Bot
                  </a>
                </div>
              </li>
              <Link className="hover:text-teal-700 duration-300" href={"/price"}>
                <li>Pricing</li>
              </Link>

              <Link className="hover:text-teal-700 duration-300" href={""}>
                <li>About</li>
              </Link>
            </ul>
          </div>

          {!session && <ul className="flex h-full items-center duration-300 gap-x-4 sm:gap-x-8 text-16">
            <Link
              className="hover:text-teal-700 duration-300"
              href='/signin'
            >
              <li>Sign in</li>
            </Link>

            <Link
              className="px-5 py-2 hover:shadow-lg hover:scale-105 hover:bg-black hover:text-white active:scale-100 duration-300 border-2 border-black rounded-md"
              href='/signup'
            >
              <li >Sign up</li>
            </Link>
          </ul>
          }
          {
            session && <Avatar name={session.user?.name} imageUrl={session.user?.image} />          
          }
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;

