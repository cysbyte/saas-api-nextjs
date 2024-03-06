import { loginIsRequiredServer } from "@/lib/auth";
import React from "react";

const Case = () => {

  return (
    <section className="flex-[5] h-full w-full overflow-auto">
      <div className="max-w-3xl mt-10 ml-10">
        <div className="border-b py-2">
          <h1 className="text-4xl font-semibold">API Access</h1>
          <p className="mt-3 text-base text-slate-600 leading-[30px] max max-w-screen-sm">
            Unlock the potential of our advanced technology to produce lifelike,
            engaging speech across various languages.
          </p>
        </div>

        <div className="mt-6">
          <h6 className="text-base">API Key</h6>
          <div>
            <div className="relative w-[40%] h-full">
              <div className="absolute right-0 h-full mr-4 flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.33331 8.00016C1.33331 8.00016 3.33331 3.3335 7.99998 3.3335C12.6666 3.3335 14.6666 8.00016 14.6666 8.00016C14.6666 8.00016 12.6666 12.6668 7.99998 12.6668C3.33331 12.6668 1.33331 8.00016 1.33331 8.00016Z"
                    stroke="#94A3B8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                    stroke="#94A3B8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <input
                className="w-full appearance-none border rounded-md  py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:pl-2"
                id="voiceId"
                type="text"
                placeholder="*******************"
              />
            </div>
          </div>
        </div>

        <div className="mt-7">
          <button className="underline text-base">Documentation</button>
        </div>
      </div>
    </section>
  );
};

export default Case;
