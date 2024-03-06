import QuestionBox from "@/components/shared/QuestionBox";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const data = [
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

const MostAffordable = () => {
  return (
    <section>
      <Wrapper>
        <div className="mt-10 md:mt-20 flex flex-col items-center lg:items-start text-center md:text-start">
          <h1 className="max-w-xl text-4xl sm:text-5xl font-bold mt-4 lg:leading-[60px]">
            Most affordable
            <br />
            AI voice generator
          </h1>
          <p className="mt-6 text-lg px-5 md:px-0 text-left text-slate-600 max-w-xl leading-[30px]">
            Our proprietary AI enables us to deliver state-of-the-art quality at
            a cost 10x lower than other Generative AI competitors.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start h-auto mt-12 md:mt-24 text-center md:text-start">
          <div className="lg:flex-1 my-12 md:my-24 ">
            <h4 className="text-14 font-semibold text-lg mt-4">Videos</h4>
            <p className="mt-6 text-lg px-5 md:px-0 text-left text-slate-600 max-w-xl leading-[30px]">
              For content creators and short story writers alike, our AI voice
              generator enables you to craft engaging audio narratives.
            </p>
          </div>
          <div className="lg:flex-1 bg-[#d9d9d9] h-300 w-400  md:h-[400px] md:w-[600px]  rounded-md"></div>
        </div>
        
        <div className="my-24">
          <h3 className="text-2xl font-semibold text-start">
            Frequently asked questions
          </h3>
          <div className="mt-6 w-full">
            {data.map((item, index) => (
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

export default MostAffordable;
