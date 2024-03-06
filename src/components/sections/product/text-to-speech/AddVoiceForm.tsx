"use client";

import { generateTextToSpeech } from "@/app/actions/actions";
import GenerateButton from "@/components/shared/GenerateButtonOnSubmit";
import { revalidatePath } from "next/cache";
import React, { Dispatch, FC, FormEvent, InputHTMLAttributes, useRef, useState } from "react";
import VoiceNameOption from "./VoiceNameItem";

type Props = {
  audio: string
  setAudio: Dispatch<React.SetStateAction<string>>;
  isMenuShowing: boolean;
  setIsMenuShowing: Dispatch<React.SetStateAction<boolean>>;
  isGenerated: boolean;
  setIsGenerated: Dispatch<React.SetStateAction<boolean>>;
  voiceId: string;
  voiceNames: {
    voiceId: string;
    voiceName: string;
    mp3_url: string;
  }[],
  user: {
    id: string;
    username: string;
    email: string;
    currentVoiceId: string | null;
    currentVoiceName: string | null;
    currentDescription: string | null;
    currentText: string | null;
    stripeCustomerId: string | null;
    apiKey: string | null;
    stripSubscriptionItem: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null,
}

const AddVoiceForm: FC<Props> = (props) => {

  const ref = useRef<HTMLFormElement>(null);
  const voiceNameInputRef = useRef<HTMLInputElement>(null!);
  const voiceIdInputRef = useRef<HTMLInputElement>(null!);
  const [tokenCount, setTokenCount] = useState(0);
  const [generateStatus, setGenerateStatus] = useState('Generate');

  const handleTextareaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setTokenCount(e.target.value.trim().length)
  }
  
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (generateStatus === 'Generating') return;
    
    try {
      // const mp3_url = await generateTextToSpeech(
      //   formData,
      //   false,
      //   props.user,
      //   props.speechCount
      // );
      event.preventDefault()

      setGenerateStatus('Generating');
 
      const formData = new FormData(event.currentTarget)
      formData.set('userId', props.user?.id as string);
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        body: formData
      });

      const { mp3_url } = await response.json()
      if (mp3_url) {
        props.setAudio(mp3_url);
        props.setIsGenerated(true);
        console.log(mp3_url)
      }
      setGenerateStatus('Generate')
      // revalidatePath('/product/voice/main/0')
      // revalidatePath('/product/text-to-speech')
    } catch (error) {
      setGenerateStatus('Regenerate')
      alert(error)
      console.log(error)
    }
    
    //ref?.current?.reset();
  }

  const handleShowingMenu = (e:React.MouseEvent) => {
    e.stopPropagation();
    console.log('click')
    if (props.isMenuShowing) {
      props.setIsMenuShowing(false)
    } else {
      props.setIsMenuShowing(true);
    }

  }

  return (
    <form ref={ref} onSubmit={onSubmit} className="bg-white w-full">
      <div className="pb-3 border-b">
        <div className="mt-3 w-full">
          <label className="block text-black text-sm mb-2" htmlFor="voiceId">
            Voice ID
          </label>
          <input
            ref={voiceIdInputRef}
            className="input-border focus:outline-none focus:shadow-outline"
            id="voiceId"
            name="voiceId"
            type="text"
            defaultValue={props.voiceId}
            placeholder="Enter voice ID"
          />
        </div>

        <div className="mt-3 w-full">
          <label className="block text-black text-sm mb-2" htmlFor="voiceName">
            Voice Names
          </label>

          
          <div onClick={handleShowingMenu}
            className="cursor-pointer hover:text-teal-700 w-full">
            <div className="group relative flex gap-x-2 items-center justify-between w-full">
              <div className="w-full">
                {
                  (<input
                    ref={voiceNameInputRef}
                  className="input-border focus:outline-none focus:shadow-outline"
                  id="voiceName"
                  name="voiceName"
                    type="text"
                    autoComplete='off'
                    //defaultValue={props.voice ? props.voice.voiceName : ''}
                  placeholder="Enter voice Name"
                />)
              }
              </div>
              
              <div className="absolute right-5 top-0 flex h-full items-center justify-center">
                  <div className="relative ml-1 flex py-3 items-center justify-center w-fit">
                  {!props.isMenuShowing
                    &&
                    <svg
                    width="13"
                    height="12"
                    viewBox="0 0 13 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 4.5L6.5 7.5L9.5 4.5"
                      stroke="#111827"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  }
                  {props.isMenuShowing &&
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.5 7.5L6.5 4.5L3.5 7.5"
                        stroke="#0F172A"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                  </div>
                </div>
              </div>


            {props.isMenuShowing && props.voiceNames && props.voiceNames.length > 0
              && <div className="absolute z-50 pt-4 flex w-[769px] max-h-[300px] overflow-auto flex-col bg-white py-1 px-4 rounded-md text-gray-800 shadow-xl">
              {props.voiceNames && props.voiceNames.length > 0 && props.voiceNames.map((item: any, index: number) => (
                <div key={index}><VoiceNameOption
                  voiceName={item.voiceName}
                  voiceId={item.voiceId}
                  mp3_url={item.mp3_url}
                  voiceIdInputRef={voiceIdInputRef}
                  voiceNameInputRef={voiceNameInputRef}
                  isMenuShowing={props.isMenuShowing}
                  setIsMenuShowing={props.setIsMenuShowing}
                />
                </div>
                
              ))}             
 
            </div>
            }
            </div>
          
        </div>

        <div className="mt-3 w-full">
          <label
            className="block text-black text-sm mb-2"
            htmlFor="description"
          >
            Voice Description
          </label>
          <textarea
            className="input-border focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            rows={2}
            //defaultValue={props.voice?props.voice.description:''}
            placeholder="Enter description here..."
          />
        </div>
      </div>

      <div>
        <h2 className="mt-3 font-semibold">Test Text</h2>
        <div className="mt-3 w-full">
          <label className="block text-black text-sm mb-2" htmlFor="text">
            Text
          </label>
          <textarea
            className="input-border focus:outline-none focus:shadow-outline"
            id="text"
            name="text"
            //defaultValue={props.voice?props.voice.text:''}
            rows={8}
            placeholder="Type or paste text here..."
            onChange={()=>handleTextareaInput}
          />
        </div>
        <div className="mt-1 flex justify-between">
          <p className="text-[12px] text-slate-400">{tokenCount}/2500</p>
          <p className="text-[12px] text-slate-400">Token remaining 9500</p>
        </div>
      </div>
      <GenerateButton text={ generateStatus} />
    </form>
  );
};

export default AddVoiceForm;
