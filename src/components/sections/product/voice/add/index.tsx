'use client'
import AudioRecorder from "@/components/shared/AudioRecorder";
import { FC, useState } from "react";
import AddVoiceForm from "./AddVoiceForm";

type Props = {
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
} | null
}

const Case:FC<Props> = (props) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [audio, setAudio] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob>(new Blob());
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [file, setFile] = useState<Blob | File | string>("");
  const [customVoiceId, setCustomVoiceId] = useState("");
  const [isDone, setIsDone] = useState(true);

  return (
    <aside className="flex-[5] w-full h-auto my-8">
      <div className="mt-5 ml-10 max-w-3xl">
        <div className="border-b py-4">
          <h1 className="text-4xl font-semibold">Voice</h1>
          <p className="mt-3 text-base text-slate-600 leading-[30px]">
            Unlock the potential of our advanced technology to produce lifelike,
            <br />
            engaging speech across various languages.
          </p>
        </div>
        <div className="py-3">
          <h1 className="text-2xl font-semibold">Add Voice</h1>
          <div className="ml-0 mt-3 text-md text-slate-600 leading-[30px]">
            The file upload requirements are as follows:
            <ul className="list-disc list-inside">
              <li>
                The audio files to be uploaded should be in one of the following
                formats: mp3, m4a, or wav.
              </li>
              <li>
                The duration of the uploaded audio files should be at least 30
                seconds and no more than 5 minutes.
              </li>
              <li>
                The size of the uploaded audio files must not exceed 20 MB.
              </li>
            </ul>
          </div>
        </div>
        <div>
          <AddVoiceForm
            audio={audio}
            setAudio={setAudio}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            isGenerated={isGenerated}
            setIsGenerated={setIsGenerated}
            customVoiceId={customVoiceId}
            setCustomVoiceId={setCustomVoiceId}
            file={file}
            setFile={setFile}
            audioBlob={audioBlob}
            setAudioBlob={setAudioBlob}
            user={props.user}
          />

          {isGenerated && (
            <div className="bg-white w-full max-w-3xl">
              <div className="pb-2">
                <div className="mb-6">
                  <h2 className="mt-4 font-semibold">Clone Voice</h2>
                  <p className="text-[13px] mt-2 text-slate-400">
                    *You can click the generate button again to get a different
                    voice.
                  </p>
                </div>
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
                  downloadTitle="Save Voice"
                  customVoiceId={customVoiceId}
                  setCustomVoiceId={setCustomVoiceId}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Case;
