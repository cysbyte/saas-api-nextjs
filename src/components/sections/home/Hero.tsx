import Button from "@/components/shared/Button";
import Image from "next/image";
import React from "react";
import Wrapper from "../../shared/Wrapper";
import usecase from '/public/usecase.png';

const Hero = () => {
  return (
    <section className="bg-hero-pattern bg-cover h-auto">
      <Wrapper>
        <div className="flex flex-col items-center justify-center">
          <div className="mt-12 md:mt-24 flex flex-col justify-center text-center">
            <h1 className="mx-auto max-w-fit text-4xl sm:text-5xl font-bold mt-4 lg:leading-[60px]">
              AI Voice Generator
            </h1>
            <p className="mx-auto px-5 md:px-0 text-center mt-6 text-lg text-slate-600 max-w-2xl leading-[30px] md:leading-[35px]">
              Use our AI voice generator to transform text into speech online
              within a few clicks. Instantly produce natural-sounding AI voices,
              ideal for video creators, developers, and businesses. <br />
              More than 1 Billion people have heard our voices worldwide.
            </p>
            <div className="mx-auto mt-7">
              <Button text={"Get Started For Free"}/>
            </div>
            
          </div>
                  
          <Image
            className="my-10 md:mb-20 w-[98%] md:w-[80%]"
            src={usecase}
            quality={100}
            alt='Minimax Use Case' />
        </div>
      </Wrapper>
    </section>
  );
};

export default Hero;
