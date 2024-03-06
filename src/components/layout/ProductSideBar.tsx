import Image from "next/image";
import React from "react";
import logo from "public/logo.png";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

interface Props{
  productName: string;
}

const ProductSideBar = async ({ productName }: Props) => {

  const session = await getServerSession(authConfig);

  return (
    <div className="flex flex-col justify-between h-screen flex-[1] border-r sticky top-0">
      <div className="mt-6 mx-3">
        <Link className="hover:text-teal-700 duration-300" href={"/"}>
          <div>
            <Image
              className="w-[69] ml-4"
              src={logo}
              alt="Minimax AI Voice Generator"
            />
          </div>
        </Link>

        <div className="mt-6 w-full rounded-md">
          <div className={`${productName === 'TextToSpeech'?'bg-gray-100':'bg-white'} flex justify-start items-center hover:bg-gray-100 p-3`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.33331C7.46957 1.33331 6.96086 1.54403 6.58579 1.9191C6.21071 2.29417 6 2.80288 6 3.33331V7.99998C6 8.53041 6.21071 9.03912 6.58579 9.41419C6.96086 9.78927 7.46957 9.99998 8 9.99998C8.53043 9.99998 9.03914 9.78927 9.41421 9.41419C9.78929 9.03912 10 8.53041 10 7.99998V3.33331C10 2.80288 9.78929 2.29417 9.41421 1.9191C9.03914 1.54403 8.53043 1.33331 8 1.33331Z"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.6667 6.66669V8.00002C12.6667 9.2377 12.175 10.4247 11.2999 11.2999C10.4247 12.175 9.23772 12.6667 8.00004 12.6667C6.76236 12.6667 5.57538 12.175 4.70021 11.2999C3.82504 10.4247 3.33337 9.2377 3.33337 8.00002V6.66669"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 12.6667V14.6667"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <Link href='/product/text-to-speech' className="ml-2 w-full h-full">Text to Speech</Link>
          </div>
        </div>

        <div className="mt-2 w-full rounded-md">
        <div className={`${productName === 'Voice'?'bg-gray-100':'bg-white'} flex justify-start items-center hover:bg-gray-100 p-3`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_297_1487)">
                <path
                  d="M14.4267 2.42666L13.5733 1.57332C13.4983 1.49753 13.409 1.43737 13.3106 1.39631C13.2122 1.35525 13.1066 1.33411 13 1.33411C12.8934 1.33411 12.7878 1.35525 12.6894 1.39631C12.591 1.43737 12.5017 1.49753 12.4267 1.57332L1.57332 12.4267C1.49753 12.5017 1.43737 12.591 1.39631 12.6894C1.35525 12.7878 1.33411 12.8934 1.33411 13C1.33411 13.1066 1.35525 13.2122 1.39631 13.3106C1.43737 13.409 1.49753 13.4983 1.57332 13.5733L2.42666 14.4267C2.5012 14.5033 2.59035 14.5642 2.68882 14.6057C2.78729 14.6473 2.8931 14.6687 2.99999 14.6687C3.10688 14.6687 3.21269 14.6473 3.31116 14.6057C3.40963 14.5642 3.49878 14.5033 3.57332 14.4267L14.4267 3.57332C14.5033 3.49878 14.5642 3.40963 14.6057 3.31116C14.6473 3.21269 14.6687 3.10688 14.6687 2.99999C14.6687 2.8931 14.6473 2.78729 14.6057 2.68882C14.5642 2.59035 14.5033 2.5012 14.4267 2.42666Z"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.33337 4.66669L11.3334 6.66669"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33337 4V6.66667"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6666 9.33331V12"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.66663 1.33331V2.66665"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.66667 5.33331H2"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 10.6667H11.3334"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.33333 2H6"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_297_1487">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <Link href='/product/voice/main/0' className="ml-2 w-full h-full">Voice</Link>
          </div>
        </div>

        <div className="mt-2 w-full rounded-md">
        <div className={`${productName === 'APIAccess'?'bg-gray-100':'bg-white'} flex justify-start items-center hover:bg-gray-100 p-3`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_297_1502)">
                <path
                  d="M14.0001 1.33331L12.6667 2.66665M12.6667 2.66665L14.6667 4.66665L12.3334 6.99998L10.3334 4.99998M12.6667 2.66665L10.3334 4.99998M7.59339 7.73998C7.93762 8.07962 8.21126 8.48401 8.39856 8.92984C8.58587 9.37568 8.68313 9.85416 8.68475 10.3377C8.68637 10.8213 8.59231 11.3004 8.408 11.7475C8.22369 12.1946 7.95277 12.6008 7.61082 12.9427C7.26888 13.2847 6.86268 13.5556 6.4156 13.7399C5.96852 13.9242 5.48939 14.0183 5.00582 14.0167C4.52224 14.015 4.04376 13.9178 3.59792 13.7305C3.15209 13.5432 2.74771 13.2695 2.40806 12.9253C1.74015 12.2338 1.37057 11.3076 1.37892 10.3462C1.38728 9.38479 1.7729 8.46514 2.45273 7.78531C3.13256 7.10548 4.0522 6.71986 5.01359 6.71151C5.97498 6.70315 6.90119 7.07273 7.59273 7.74065L7.59339 7.73998ZM7.59339 7.73998L10.3334 4.99998"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_297_1502">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <Link href='/product/api-access' className="ml-2 w-full h-full">API Access</Link>
          </div>
        </div>

        <div className="mt-2 w-full rounded-md">
        <div className={`${productName === 'Subscription'?'bg-gray-100':'bg-white'} flex justify-start items-center hover:bg-gray-100 p-3`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3334 3.33331H2.66671C1.93033 3.33331 1.33337 3.93027 1.33337 4.66665V11.3333C1.33337 12.0697 1.93033 12.6666 2.66671 12.6666H13.3334C14.0698 12.6666 14.6667 12.0697 14.6667 11.3333V4.66665C14.6667 3.93027 14.0698 3.33331 13.3334 3.33331Z"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.33337 6.66669H14.6667"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <Link href='/product/subscription' className="ml-2 w-full h-full">Subscription</Link>
          </div>
        </div>

        <div className="mt-2 w-full rounded-md">
        <div className={`${productName === 'Support'?'bg-gray-100':'bg-white'} flex justify-start items-center hover:bg-gray-100 p-3`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3334 2.66669H2.66671C1.93033 2.66669 1.33337 3.26364 1.33337 4.00002V12C1.33337 12.7364 1.93033 13.3334 2.66671 13.3334H13.3334C14.0698 13.3334 14.6667 12.7364 14.6667 12V4.00002C14.6667 3.26364 14.0698 2.66669 13.3334 2.66669Z"
                stroke="#0F172A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6667 4.66669L8.68671 8.46669C8.48089 8.59564 8.24292 8.66403 8.00004 8.66403C7.75716 8.66403 7.51919 8.59564 7.31337 8.46669L1.33337 4.66669"
                stroke="#0F172A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <p className="ml-2 w-full h-full">Support</p>
          </div>
        </div>
      </div>

      <div className="my-4 px-2">
        <div className="border-b py-3">
          <h6 className="text-sm font-semibold">Plan name</h6>
          <div className="w-full bg-gray-200 rounded-full mt-2">
            <div className="w-1/3 h-2 bg-indigo-400 rounded-full"></div>
          </div>
          <p className="text-[12px] mt-1 text-slate-500">
            500 of 10000 token used
          </p>
        </div>
        <div className="flex items-center my-5">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="20" fill="#E0E7FF" />
            <path
              d="M18.7727 18H17.3636C17.2803 17.5947 17.1345 17.2386 16.9261 16.9318C16.7216 16.625 16.4716 16.3674 16.1761 16.1591C15.8845 15.947 15.5606 15.7879 15.2045 15.6818C14.8485 15.5758 14.4773 15.5227 14.0909 15.5227C13.3864 15.5227 12.7481 15.7008 12.1761 16.0568C11.608 16.4129 11.1553 16.9375 10.8182 17.6307C10.4848 18.3239 10.3182 19.1742 10.3182 20.1818C10.3182 21.1894 10.4848 22.0398 10.8182 22.733C11.1553 23.4261 11.608 23.9508 12.1761 24.3068C12.7481 24.6629 13.3864 24.8409 14.0909 24.8409C14.4773 24.8409 14.8485 24.7879 15.2045 24.6818C15.5606 24.5758 15.8845 24.4186 16.1761 24.2102C16.4716 23.9981 16.7216 23.7386 16.9261 23.4318C17.1345 23.1212 17.2803 22.7652 17.3636 22.3636H18.7727C18.6667 22.9583 18.4735 23.4905 18.1932 23.9602C17.9129 24.4299 17.5644 24.8295 17.1477 25.1591C16.7311 25.4848 16.2633 25.733 15.7443 25.9034C15.2292 26.0739 14.678 26.1591 14.0909 26.1591C13.0985 26.1591 12.2159 25.9167 11.4432 25.4318C10.6705 24.947 10.0625 24.2576 9.61932 23.3636C9.17614 22.4697 8.95455 21.4091 8.95455 20.1818C8.95455 18.9545 9.17614 17.8939 9.61932 17C10.0625 16.1061 10.6705 15.4167 11.4432 14.9318C12.2159 14.447 13.0985 14.2045 14.0909 14.2045C14.678 14.2045 15.2292 14.2898 15.7443 14.4602C16.2633 14.6307 16.7311 14.8807 17.1477 15.2102C17.5644 15.536 17.9129 15.9337 18.1932 16.4034C18.4735 16.8693 18.6667 17.4015 18.7727 18ZM30.277 14.3636V26H28.9134L22.5724 16.8636H22.4588V26H21.0497V14.3636H22.4134L28.777 23.5227H28.8906V14.3636H30.277Z"
              fill="#0F172A"
            />
          </svg>
          <p className="ml-2 font-semibold text-black text-[13px]">{session?.user?.name?.split(' ')[0]}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSideBar;
