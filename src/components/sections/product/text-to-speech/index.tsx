"use client";

import AudioRecorder from "@/components/shared/AudioRecorder";
import PricingPlanButton from "@/components/shared/PricingPlanButton";
import React, { useState, Dispatch, useEffect, FC } from "react";
import AddVoiceForm from "./AddVoiceForm";

type Props = {
  voiceId: string,
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

const Case:FC<Props> = (props) => {

  const [audio, setAudio] = useState('');
  const [audioBlob, setAudioBlob] = useState(new Blob());
  const [file, setFile] = useState<Blob | File | string>(new Blob());
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isRecording, setIsRecording] = useState(false)
  const [isDone, setIsDone] = useState(true);
  //console.log('index', voice)

  // useEffect(() => {
  //   if (voice) {
  //     setAudio(voice.mp3_url);
  //   }
  // });

  return (
    
    <section
      onClick={()=>setIsMenuShowing(false)}
      className="flex-[5] h-full w-full overflow-auto">
      <div className="max-w-3xl mt-14 mb-10 ml-10">
        <div className="border-b py-2">
          <h1 className="text-4xl font-semibold">Text to Speech</h1>
          <p className="mt-3 text-base text-slate-600 leading-[30px] max max-w-screen-sm">
            Unlock the potential of our advanced technology to produce lifelike,
            engaging speech across various languages.
          </p>
        </div>

        <div className="mt-4">
          <h2 className=" font-semibold">Settings</h2>

          <div className="w-full pb-5">
            <AddVoiceForm
              audio={audio}
              setAudio={setAudio}
              voiceId={props.voiceId}
              voiceNames={props.voiceNames}
              isMenuShowing={isMenuShowing}
              setIsMenuShowing={setIsMenuShowing}
              isGenerated={isGenerated}
              setIsGenerated={setIsGenerated}
              user={props.user}
            />
          </div>

          {isGenerated && <div className="border-t w-full">
            <div className="mb-6">
              <h2 className="mt-3 font-semibold">Voice Audio</h2>
              <p className="text-[13px] mt-2 text-slate-400">
                *You can click the generate button again to get a different voice.
              </p>
            </div>
            <div className="mt-4">
              <div>
                <AudioRecorder
                  audio={audio}
                  setAudio={setAudio}
                  isDone={isDone}
                  setIsDone={setIsDone}
                  hasDownload={true}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                  audioBlob={audioBlob}
                  setAudioBlob={setAudioBlob}
                  file={file}
                  setFile={setFile}
                />
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </section>
  );
};

export default Case;
