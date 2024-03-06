import React, { FC } from "react";

const AddVoiceBox: FC = () => {
  return (
    <div>
      <div className="border rounded-md bg-white shadow-xl basis-4/12 w-full md:w-[360px] md:h-[200px] h-auto flex flex-col justify-center items-center hover:bg-gray-100 hover:scale-[1.02] active:scale-100 duration-300">
        <div className="my-5 mx-auto">
          <div className="flex">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.64 3.64005L20.36 2.36004C20.2475 2.24636 20.1135 2.15612 19.9659 2.09452C19.8183 2.03293 19.6599 2.00122 19.5 2.00122C19.34 2.00122 19.1817 2.03293 19.0341 2.09452C18.8864 2.15612 18.7525 2.24636 18.64 2.36004L2.35998 18.64C2.2463 18.7526 2.15605 18.8865 2.09446 19.0341C2.03287 19.1817 2.00116 19.3401 2.00116 19.5C2.00116 19.66 2.03287 19.8184 2.09446 19.966C2.15605 20.1136 2.2463 20.2475 2.35998 20.36L3.63998 21.64C3.7518 21.755 3.88552 21.8463 4.03323 21.9087C4.18094 21.971 4.33965 22.0031 4.49998 22.0031C4.66032 22.0031 4.81903 21.971 4.96674 21.9087C5.11445 21.8463 5.24816 21.755 5.35998 21.64L21.64 5.36005C21.7549 5.24822 21.8462 5.11451 21.9086 4.9668C21.971 4.81909 22.0031 4.66038 22.0031 4.50005C22.0031 4.33971 21.971 4.181 21.9086 4.03329C21.8462 3.88558 21.7549 3.75187 21.64 3.64005Z"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 7L17 10"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 6V10"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 14V18"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 2V4"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 8H3"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 16H17"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 3H9"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <h4 className="ml-2 font-normal text-base text-black">
              Add Clone Voice
            </h4>
          </div>

          <p className="text-[13px] mx-auto mt-2 text-center text-slate-400">2/1000</p>
          <div className="mt-6 w-full cursor-pointer">
            <svg
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-auto"
            >
              <rect
                x="1"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                fill="white"
              />
              <rect
                x="1"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                stroke="#E2E8F0"
              />
              <path
                d="M20.5 15.3333V24.6666"
                stroke="#0F172A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8333 20H25.1666"
                stroke="#0F172A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVoiceBox;
