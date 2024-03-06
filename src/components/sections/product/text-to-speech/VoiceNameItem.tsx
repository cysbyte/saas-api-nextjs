"use client";

import React, { Ref, useRef, useState } from "react";

type Props = {
  voiceId: string;
  voiceName: string;
  mp3_url: string;
  voiceIdInputRef: React.MutableRefObject<HTMLInputElement>;
  voiceNameInputRef: React.MutableRefObject<HTMLInputElement>;
  isMenuShowing: boolean;
  setIsMenuShowing: React.Dispatch<React.SetStateAction<boolean>>;
};

const VoiceNameOption = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null!);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      setIsPlaying(true);
      audioRef.current?.play();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.setIsMenuShowing(false);
    props.voiceNameInputRef.current.value = props.voiceName;
    // console.log(props.voiceIdInputRef)
    props.voiceIdInputRef.current.value = props.voiceId;
  };

  return (
    <div
      onClick={handleClick}
      className="flex justify-start items-center hover:bg-slate-200 rounded-sm w-full my-1"
    >
      <div className="" onClick={handlePlay}>
        {!isPlaying && (
          <div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.33331 2L12.6666 8L3.33331 14V2Z" fill="#334155" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.01389 1.41487C3.22794 1.29801 3.48872 1.30735 3.69386 1.43923L13.0272 7.43923C13.218 7.56189 13.3334 7.77317 13.3334 8.00001C13.3334 8.22685 13.218 8.43813 13.0272 8.5608L3.69386 14.5608C3.48872 14.6927 3.22794 14.702 3.01389 14.5852C2.79985 14.4683 2.66669 14.2439 2.66669 14V2.00001C2.66669 1.75614 2.79985 1.53173 3.01389 1.41487ZM4.00002 3.22112V12.7789L11.4338 8.00001L4.00002 3.22112Z"
                fill="#334155"
              />
            </svg>
          </div>
        )}
        {isPlaying && (
          <div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.66667 2.66669H4V13.3334H6.66667V2.66669Z"
                fill="#334155"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.33331 2.66667C3.33331 2.29848 3.63179 2 3.99998 2H6.66665C7.03484 2 7.33331 2.29848 7.33331 2.66667V13.3333C7.33331 13.7015 7.03484 14 6.66665 14H3.99998C3.63179 14 3.33331 13.7015 3.33331 13.3333V2.66667ZM4.66665 3.33333V12.6667H5.99998V3.33333H4.66665Z"
                fill="#334155"
              />
              <path
                d="M12 2.66669H9.33331V13.3334H12V2.66669Z"
                fill="#334155"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.66669 2.66667C8.66669 2.29848 8.96516 2 9.33335 2H12C12.3682 2 12.6667 2.29848 12.6667 2.66667V13.3333C12.6667 13.7015 12.3682 14 12 14H9.33335C8.96516 14 8.66669 13.7015 8.66669 13.3333V2.66667ZM10 3.33333V12.6667H11.3334V3.33333H10Z"
                fill="#334155"
              />
            </svg>
          </div>
        )}
      </div>
      <audio ref={audioRef} src={props.mp3_url} className="hidden" />
      <h3 className="my-2 ml-3">
        {props.voiceName ? props.voiceName : "Unnamed"}
      </h3>
    </div>
  );
};

export default VoiceNameOption;
