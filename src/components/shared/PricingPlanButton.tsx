import React, { FC } from "react";

const PricingPlanButton: FC<{ text: string; isScale: boolean }> = (props) => {
  return (
    <button
      type="submit"
      className={`${
        props.isScale && "hover:scale-105"
      } hover:shadow-lg text-sm z-0 duration-300 active:scale-100 mx-auto px-5 py-2 bg-indigo-600 rounded-md text-white w-full`}
    >
      {props.text}
    </button>
  );
};

export default PricingPlanButton;
