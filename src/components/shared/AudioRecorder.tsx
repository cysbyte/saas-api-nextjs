"use client";
import { setupDevBundler } from "next/dist/server/lib/router-utils/setup-dev-bundler";
import Link from "next/link";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import PlayControl from "./PlayControl";
import PricingPlanButton from "./PricingPlanButton";
import RecordControl from "./RecordControl";

type Props = {
  isDone: boolean;
  setIsDone: Dispatch<React.SetStateAction<boolean>>;
  hasDownload: boolean;
  audio: string;
  setAudio: Dispatch<React.SetStateAction<string>>;
  isRecording: boolean;
  setIsRecording: Dispatch<React.SetStateAction<boolean>>;
  audioBlob: Blob;
  setAudioBlob: Dispatch<React.SetStateAction<Blob>>;
  file: string | Blob | File;
  setFile: Dispatch<React.SetStateAction<string | Blob | File>>;
  downloadTitle?: string;
  customVoiceId?: string;
  setCustomVoiceId?: Dispatch<React.SetStateAction<string>> | undefined;
}
const AudioRecorder: FC<Props> = (props) => {
  //const [audio, setAudio] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(props.isDone);
  const [audioChunks, setAudioChunks] = useState<any>([]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  return (
    <div className="max-w-3xl">
      <div className="border rounded-md bg-white shadow-xl w-full h-[250px] justify-start flex flex-col">

        <div className="">
          {!isDone && (
            <div className="">
              <RecordControl
                audioBlob={props.audioBlob}
                setAudioBlob={props.setAudioBlob}
                audioChunks={audioChunks}
                setAudioChunks={setAudioChunks}
                audio={props.audio}
                setAudio={props.setAudio}
                isDone={isDone}
                setIsDone={setIsDone}
                isRecording={props.isRecording}
                setIsRecording={props.setIsRecording}
                file={props.file}
                setFile={props.setFile}
                customVoiceId={props.customVoiceId||''}
                setCustomVoiceId={props.setCustomVoiceId}
                uploadStatus={uploadStatus}
                setUploadStatus={setUploadStatus}
              />
            </div>
          )}

          {isDone && (
            <div className="">
              <PlayControl
                audioBlob={props.audioBlob}
                setAudioBlob={props.setAudioBlob}
                audioChunks={audioChunks}
                setAudioChunks={setAudioChunks}
                audio={props.audio}
                setAudio={props.setAudio}
                isDone={isDone}
                setIsDone={setIsDone}
                isRecording={props.isRecording}
                setIsRecording={props.setIsRecording}
                file={props.file}
                setFile={props.setFile}
                customVoiceId={props.customVoiceId||''}
                setCustomVoiceId={props.setCustomVoiceId}
                uploadStatus={uploadStatus}
                setUploadStatus={setUploadStatus}
              />
            </div>
          )}
        </div>
      </div>
      {props.hasDownload && <Link href={props.audio} target="_blank" download>
        <div className="my-5">
          <PricingPlanButton text={props.downloadTitle ? props.downloadTitle : "Download"} isScale={false} />
        </div>
      </Link>
      }
    </div>
  );
};

export default AudioRecorder;
