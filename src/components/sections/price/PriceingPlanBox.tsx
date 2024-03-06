'use client'
import { getCheckoutLink } from "@/app/actions/actions";
import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
  priceIds,
} from "@/lib/stripe";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import PricingPlanButton from "../../shared/PricingPlanButton";

interface IProps {
  title: string;
  type: string;
  price: string;
  startLabel: string;
  description: string[];
}

const PricingPlanBox: FC<IProps> = ({
  title,
  type,
  price,
  startLabel,
  description,
}) => {

  const handleSubscription = async () => {
    if (type === 'free') {
      redirect('/product/text-to-speech');
    }
    const checkoutLink = await getCheckoutLink(type);
    if (checkoutLink) {
      redirect(checkoutLink);
    }
  };

  return (
    <form action={handleSubscription}>
      <div className="border rounded-md bg-white shadow-xl basis-4/12 w-full md:w-[360px] h-full justify-start px-6 py-6 flex flex-col hover:bg-gray-100 hover:scale-[1.02] active:scale-100 duration-300 hover:border-gray-700">
        <div className="border-b pb-10">
          <h4 className="font-semibold text-lg text-slate-600">{title}</h4>
          <p className="pt-2">
            <span className="font-bold text-2xl text-black">${price}</span>
            <span className="text-slate-600 ml-2">/month</span>
          </p>
          <div className="w-full mt-7" >
            <PricingPlanButton text={startLabel} isScale={true} />
          </div>
        </div>

        <div className="mt-4">
          {description.map((item, index) => (
            <div key={index} className="flex my-2">
              <div className="w-[16px] h-full">
                {index === description.length - 1 ? (
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_297_1562)">
                      <path
                        d="M8.33342 14.6666C12.0153 14.6666 15.0001 11.6818 15.0001 7.99992C15.0001 4.31802 12.0153 1.33325 8.33342 1.33325C4.65152 1.33325 1.66675 4.31802 1.66675 7.99992C1.66675 11.6818 4.65152 14.6666 8.33342 14.6666Z"
                        stroke="#6366F1"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.3335 10.6667V8"
                        stroke="#6366F1"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.3335 5.33325H8.34016"
                        stroke="#6366F1"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_297_1562">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0.333496)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3334 4L6.00008 11.3333L2.66675 8"
                      stroke="#10B981"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </div>

              <p className="text-sm text-slate-500 ml-2">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default PricingPlanBox;
