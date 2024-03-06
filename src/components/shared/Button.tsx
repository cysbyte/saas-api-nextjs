import Link from "next/link";
import React, { FC } from "react";

const Button: FC<{ text: string }> = (props) => {
  return (
    <Link href='/product/text-to-speech' className="hover:shadow-lg text-lg font-normal z-0 hover:scale-105 duration-300 active:scale-100 mx-auto w-fit px-5 py-2 bg-indigo-600 rounded-md text-white">
      {props.text}
    </Link>
  );
};

export default Button;
