import PricingPlanBox from "@/components/sections/price/PriceingPlanBox";
import QuestionBox from "@/components/shared/QuestionBox";
import Wrapper from "@/components/shared/Wrapper";
import { createCheckoutLink, createCustomerIfNull, hasSubscription } from "@/lib/stripe";
import React from "react";

const priceingPlanData = [
  {
    title: "Free",
    type: 'free',
    price: "0",
    startLabel: "Get Started For Free",
    description: [
      "Speech Synthesis - No Commercial License",
      "10,000 characters per month",
      "Create up to 3 custom voices",
      "Create random voices using Voice Design",
      "Access shared voices in the Voice Library",
      "Generate compelling speech in 29 languages",
      "Dubbing - translate your videos from 57 languages into 29 languages. Charged at 2000 characters per minute",
      "API access",
      "High quality 128kbps audio outputs",
      "Attribution to useHigi is required.",
    ],
  },
  {
    title: "Starter",
    type: 'starter',
    price: "9.9",
    startLabel: "Start Now",
    description: [
      "Everything in Free",
      "Unlimited Voice Clones",
      "Up to 200,000 characters (~ 5 hours) per month",
      "Commercial use",
      "Prices are tax-exclusive.",
    ],
  },
  {
    title: "Creator",
    type: 'creator',
    price: "79.00",
    startLabel: "Start Now",
    description: [
      "Everything in Starter",
      "Unlimited Voice Clones",
      "Up to 2,000,000 characters (~ 50 hours) per month",
      "Commercial use",
      "Faster generation",
      "Unlimited regenerations",
      "API access",
      "High quality 128kbps audio outputs",
      "Prices are tax-exclusive.",
    ],
  },
];

const questionData = [
  {
    question: "Is it accessible",
  },
  {
    question: "is it styled",
  },
  {
    question: "Is it anymated",
    answer:
      "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

const PriceingPlan = async () => {
  
  return (
    <section className=" bg-[#f9fafb]">
      <Wrapper>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl font-bold mt-16 lg:leading-[60px]">
            Pricing Plans
          </h1>
        </div>
        <div className="flex flex-col mt-16 justify-center md:flex-row gap-y-4 items-stretch gap-x-4 max-w-screen-xl mx-auto">
          {priceingPlanData.map((item, index) => (
            <PricingPlanBox
              key={index}
              type={item.type}
              title={item.title}
              price={item.price}
              startLabel={item.startLabel}
              description={item.description}
            />
          ))}
        </div>
        <div className="my-24">
          <h3 className="text-2xl font-semibold text-start">
            Pricing FAQ
          </h3>
          <div className="mt-6 w-full">
            {questionData.map((item, index) => (
              <QuestionBox
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default PriceingPlan;
