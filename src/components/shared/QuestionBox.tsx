import React from "react";

interface IProps {
  question: string;
  answer?: string;
}

const QuestionBox: React.FC<IProps> = ({ question, answer }) => {
  return (
    <div className="px-2 py-2 border-b">
      <div className="flex justify-between items-center">
        <p className="mt-3 leading-8 text-black">{question}</p>
        {answer ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#0F172A"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
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
              d="M12 10L8 6L4 10"
              stroke="#0F172A"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
      </div>

      {answer && <p className="mt-2 text-slate-600">{answer}</p>}
    </div>
  );
};

export default QuestionBox;
