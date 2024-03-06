import Link from "next/link";
import React, { FC } from "react";

type Props = {
  id: string,
  voiceId: string,
  voiceName: string,
  order: number,
  description: string,
}

const MyCreatedBox: FC<Props> = (props) => {
  return (
    <div>
      <div className="border rounded-md bg-white shadow-xl basis-4/12 w-full md:w-[360px] md:h-[200px] px-4 justify-center items-center flex flex-col  hover:bg-gray-100 hover:scale-[1.02] active:scale-100 duration-300">
        <div className=" mx-auto w-full">
          <div className="flex items-center justify-between px-2">
            <div className="flex ">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.64 3.64005L20.36 2.36004C20.2475 2.24636 20.1135 2.15612 19.9659 2.09452C19.8183 2.03293 19.6599 2.00122 19.5 2.00122C19.34 2.00122 19.1817 2.03293 19.0341 2.09452C18.8864 2.15612 18.7525 2.24636 18.64 2.36004L2.35998 18.64C2.2463 18.7526 2.15605 18.8865 2.09446 19.0341C2.03287 19.1817 2.00116 19.3401 2.00116 19.5C2.00116 19.66 2.03287 19.8184 2.09446 19.966C2.15605 20.1136 2.2463 20.2475 2.35998 20.36L3.63998 21.64C3.7518 21.755 3.88552 21.8463 4.03323 21.9087C4.18094 21.971 4.33965 22.0031 4.49998 22.0031C4.66032 22.0031 4.81903 21.971 4.96674 21.9087C5.11445 21.8463 5.24816 21.755 5.35998 21.64L21.64 5.36005C21.7549 5.24822 21.8462 5.11451 21.9086 4.9668C21.971 4.81909 22.0031 4.66038 22.0031 4.50005C22.0031 4.33971 21.971 4.181 21.9086 4.03329C21.8462 3.88558 21.7549 3.75187 21.64 3.64005Z"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 7L17 10"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 6V10"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19 14V18"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 2V4"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 8H3"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 16H17"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11 3H9"
                  stroke="#6366F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <h4 className="ml-2 font-normal text-base text-black truncate ..">
                {props.voiceName?props.voiceName:'Unnamed'}
              </h4>
            </div>
            <div className="border-[2px] rounded-md px-1 py-1 text-sm text-slate-400">
              {'ID'+props.order.toString().padStart(3, '0')}
            </div>
          </div>

          <p className="text-[13px] mx-auto mt-2 text-start px-2 text-slate-400 line-clamp-1">
            {props.description?props.description:'No description'}
          </p>
          <input hidden value={props.voiceId}/>
        </div>

        <div className="flex justify-between mt-6 w-full gap-x-3">
          <Link href={`/product/text-to-speech/voiceId/${props.voiceId}`} className="btn-border flex-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.33325C7.46957 1.33325 6.96086 1.54397 6.58579 1.91904C6.21071 2.29411 6 2.80282 6 3.33325V7.99992C6 8.53035 6.21071 9.03906 6.58579 9.41413C6.96086 9.78921 7.46957 9.99992 8 9.99992C8.53043 9.99992 9.03914 9.78921 9.41421 9.41413C9.78929 9.03906 10 8.53035 10 7.99992V3.33325C10 2.80282 9.78929 2.29411 9.41421 1.91904C9.03914 1.54397 8.53043 1.33325 8 1.33325Z"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.6667 6.66675V8.00008C12.6667 9.23776 12.175 10.4247 11.2998 11.2999C10.4247 12.1751 9.23769 12.6667 8.00001 12.6667C6.76233 12.6667 5.57535 12.1751 4.70018 11.2999C3.82501 10.4247 3.33334 9.23776 3.33334 8.00008V6.66675"
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

            <p className="ml-1">Use</p>
          </Link>
          
          <Link href={`/product/text-to-speech/voiceId/${props.id}`} className="btn-border flex-1">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1543_464)">
                <path
                  d="M11.8333 2.00004C12.0084 1.82494 12.2163 1.68605 12.4451 1.59129C12.6739 1.49653 12.9191 1.44775 13.1667 1.44775C13.4143 1.44775 13.6595 1.49653 13.8883 1.59129C14.117 1.68605 14.3249 1.82494 14.5 2.00004C14.6751 2.17513 14.814 2.383 14.9088 2.61178C15.0035 2.84055 15.0523 3.08575 15.0523 3.33337C15.0523 3.58099 15.0035 3.82619 14.9088 4.05497C14.814 4.28374 14.6751 4.49161 14.5 4.66671L5.50001 13.6667L1.83334 14.6667L2.83334 11L11.8333 2.00004Z"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1543_464">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <p className="ml-1">Edit</p>
          </Link>
          <Link href={`/product/voice/main/${props.id}?modal=true&voiceName=${props.voiceName}`} className="btn-border flex-1">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4H14.5"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.1667 4V13.3333C13.1667 14 12.5 14.6667 11.8333 14.6667H5.16668C4.50001 14.6667 3.83334 14 3.83334 13.3333V4"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83334 3.99992V2.66659C5.83334 1.99992 6.50001 1.33325 7.16668 1.33325H9.83334C10.5 1.33325 11.1667 1.99992 11.1667 2.66659V3.99992"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <p className="ml-1">Delete</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCreatedBox;
