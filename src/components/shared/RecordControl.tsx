
'use client';

import { convertWebmToMp3 } from "@/lib/util";
import { redirect, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { cloneAudio, uploadAudio } from "@/app/actions/actions";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export const MIMETYPE = "audio/webm";

type Props = {
  isDone: boolean;
  setIsDone: Dispatch<SetStateAction<boolean>>;
  audio: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audioBlob: Blob;
  setAudioBlob: Dispatch<SetStateAction<Blob>>;
  audioChunks: any;
  setAudioChunks: Dispatch<SetStateAction<any>>;
  isRecording: boolean;
  setIsRecording: Dispatch<React.SetStateAction<boolean>> ;
  file: string | Blob | File;
  setFile:  Dispatch<React.SetStateAction<string | Blob | File>>
  customVoiceId: string;
  setCustomVoiceId: Dispatch<React.SetStateAction<string>> | undefined;
  uploadStatus: string;
  setUploadStatus: Dispatch<React.SetStateAction<string>>;
};

const RecordControl: FC<Props> = (props) => {
  const mimeType: MediaRecorderOptions = { mimeType: MIMETYPE };

  const [permission, setPermission] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder>(null!);
  const [recordingStatus, setRecordingStatus] = useState<string>("inactive");
  const [stream, setStream] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  let interval: string | number | NodeJS.Timeout | undefined;

  const router = useRouter();

  const startRecording = async () => {

    if ("MediaRecorder" in window) {
      try {
        const streamData: any = await navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: false,
          })
          .then((stream) => {
            setRecordingStatus("recording");
            //create new Media recorder instance using the stream
            const media = new MediaRecorder(stream, mimeType);
            //set the MediaRecorder instance to the mediaRecorder ref
            mediaRecorder.current = media;
            //invokes the start method to start the recording process
            mediaRecorder.current.start();
            let localAudioChunks:any = [];
            mediaRecorder.current.ondataavailable = (event: any) => {
              if (typeof event.data === "undefined") return;
              if (event.data.size === 0) return;
              localAudioChunks.push(event.data);
            };
            props.setAudioChunks(localAudioChunks);
          })
          .catch((error) => {
            console.error("Error accessing microphone:", error);
          });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  // Cleanup effect when the component unmounts
  // useEffect(() => {
  //   return () => {
  //     // Stop the speech recognition if it's active
  //     if (mediaRecorder.current) {
  //       mediaRecorder.current.stop();
  //     }
  //   };
  // }, []);

  const stopRecording = () => {
    if (!mediaRecorder || !mediaRecorder.current) return;
    setRecordingStatus("inactive");
    setElapsedTime(0);
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(props.audioChunks, { type: MIMETYPE });
      props.setAudioBlob(audioBlob);
      // creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      // console.log(audioUrl);
      props.setAudio(audioUrl);

      const file = await convertWebmToMp3(audioUrl)
      console.log(file)
      props.setFile(file);

      // try {
      //   props.setUploadStatus('File is uploading...');
      //   const formData = new FormData();
      //   formData.set('file', file)
      //   console.log('uploading');
      //   let result = await uploadAudio(formData);
      //   const fileId = result.file.file_id;
      //   const customVoiceId = "Voice_id_" + uuidv4();
      //   console.log('customVoiceId')
      //   result = await cloneAudio(fileId, customVoiceId);
      //   if (props.setCustomVoiceId) {
      //     props.setCustomVoiceId(customVoiceId);
      //   }
      //   props.setUploadStatus('File is uploaded');
      // } catch (error) {
      //   props.setUploadStatus('Failed to upload file');
      //   console.log(error)
      //   alert(error)
      // }

      props.setAudioChunks([]);
    };
  };

  const pauseRecording = () => {
    if (!mediaRecorder || !mediaRecorder.current) return;
    clearInterval(interval);
    setRecordingStatus("pause");
    mediaRecorder.current.pause();
  };

  const resumeRecording = () => {
    if (!mediaRecorder || !mediaRecorder.current) return;
    if (recordingStatus === "pause") {
      setRecordingStatus("recording");
      mediaRecorder.current.resume();
      //interval = setInterval(() => setElapsedTime(elapsedTime + 1), 10);
    }
  };

  const handleDone = () => {
    if (!mediaRecorder || !mediaRecorder.current) return;
    stopRecording();
    props.setIsDone(true);
  };

  const handleCancel = () => {
    stopRecording();
    if (props.setIsRecording){
        props.setIsRecording(false);  
    }
    // router.push('/product/voice/add');
  }

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData: any = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  useEffect(() => {
    if (recordingStatus === "recording") {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      interval = setInterval(() => {
        setElapsedTime(elapsedTime + 1);
        //console.log(elapsedTime)
        if (elapsedTime >= 3000) {
          stopRecording();
        }
      }, 10);
    }
    return () => clearInterval(interval);
  }, [recordingStatus, elapsedTime]);

  const hours = Math.floor(elapsedTime / 360000);
  const minutes = Math.floor((elapsedTime % 360000) / 6000);
  const seconds = Math.floor((elapsedTime % 6000) / 100);
  const milliseconds = elapsedTime * 10;

  if (milliseconds === 30000) {
    handleDone();
  }

  return (
    <>
      <div className="flex flex-col">
      <div className="w-full h-auto">
          <h2 className="text-base text-center font-bold whitespace-pre-line leading-8 text-black py-5">
            Record Audio
          </h2>
        </div>
      <div className="flex justify-center items-center w-full mx-auto">
        <div className="relative w-fit h-auto mx-auto">
          <div className=" w-fit ">
            <svg
              width="680"
              height="40"
              viewBox="0 0 680 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <rect x="2" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="10" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="18" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="26" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="34" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="42" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="50" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="58" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="66" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="74" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="82" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="90" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="98" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="106" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="114" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="122" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="130" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="138" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="146" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="154" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="162" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="170" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="178" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="186" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="194" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="202" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="210" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="218" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="226" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="234" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="242" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="250" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="258" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="266" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="274" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="282" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="290" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="298" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="306" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="314" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="322" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="330" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="338" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="346" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="354" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="362" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="370" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="378" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="386" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="394" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="402" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="410" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="418" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="426" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="434" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="442" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="450" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="458" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="466" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="474" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="482" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="490" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="498" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="506" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="514" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="522" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="530" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="538" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="546" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="554" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="562" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="570" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="578" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="586" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="594" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="602" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="610" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="618" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="626" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="634" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="642" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="650" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="658" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="666" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
              <rect x="674" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
            </svg>
          </div>

            <div
              className={`absolute overflow-hidden mx-auto left-0 top-0`}
              style={{
                width: `${Math.floor((milliseconds * 100) / 30000)}%`,
              }}
            >
              <div className="relative w-full mx-auto">
                <svg
                    width="4"
                    height="40"
                    viewBox="0 0 4 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-0 top-0"
                  >
                    <rect width="4" height="40" rx="2" fill="#6366F1" />
                  </svg>
              <svg
                width="680"
                height="40"
                viewBox="0 0 680 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <rect
                  x="6"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="14"
                  y="7"
                  width="4"
                  height="26"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="22"
                  y="7"
                  width="4"
                  height="26"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="30"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="38"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="46"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="54"
                  y="7"
                  width="4"
                  height="26"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="62"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="70"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="78"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="86"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="94"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="102"
                  y="7"
                  width="4"
                  height="26"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="110"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="118"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="126"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="134"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="142"
                  y="16"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="150"
                  y="16"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="158"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="166"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="174"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="182"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="190"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="198"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="206"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="214"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="222"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="230"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="238"
                  y="16"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="246"
                  y="16"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="254"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="262"
                  y="6.5"
                  width="4"
                  height="27"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="270"
                  y="16"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="278"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="286"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="294"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="302"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="310"
                  y="6.5"
                  width="4"
                  height="27"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="318"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="326"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="334"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="342"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="350"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="358"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="366"
                  y="6.5"
                  width="4"
                  height="27"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="374"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="382"
                  y="6.5"
                  width="4"
                  height="27"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="390"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="398"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="406"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="414"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="422"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="430"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="438"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="446"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="454"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="462"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="470"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="478"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="486"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="494"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="502"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="510"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="518"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="526"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="534"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="542"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="550"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="558"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="566"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="574"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="582"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="590"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="598"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="606"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="614"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="622"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="630"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="638"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="646"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="654"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="662"
                  y="5"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#34D399"
                />
                <rect
                  x="670"
                  y="12"
                  width="4"
                  height="16"
                  rx="2"
                  fill="#34D399"
                />
                </svg>
                </div>
            </div>

          <div
            className="absolut w-0 overflow-hidden"

          >
            <svg
              width="680"
              height="40"
              viewBox="0 0 680 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <rect x="6" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="14" y="7" width="4" height="26" rx="2" fill="#34D399" />
              <rect x="22" y="7" width="4" height="26" rx="2" fill="#34D399" />
              <rect x="30" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="38" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="46" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="54" y="7" width="4" height="26" rx="2" fill="#34D399" />
              <rect x="62" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="70" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="78" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="86" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="94" y="12" width="4" height="16" rx="2" fill="#34D399" />
              <rect x="102" y="7" width="4" height="26" rx="2" fill="#34D399" />
              <rect x="110" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="118" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="126"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="134"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="142" y="16" width="4" height="8" rx="2" fill="#34D399" />
              <rect x="150" y="16" width="4" height="8" rx="2" fill="#34D399" />
              <rect
                x="158"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="166" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="174"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="182"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="190"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="198"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="206" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="214"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="222"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="230" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="238" y="16" width="4" height="8" rx="2" fill="#34D399" />
              <rect x="246" y="16" width="4" height="8" rx="2" fill="#34D399" />
              <rect
                x="254"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="262"
                y="6.5"
                width="4"
                height="27"
                rx="2"
                fill="#34D399"
              />
              <rect x="270" y="16" width="4" height="8" rx="2" fill="#34D399" />
              <rect
                x="278"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="286" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="294"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="302"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="310"
                y="6.5"
                width="4"
                height="27"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="318"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="326"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="334"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="342" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="350"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="358"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="366"
                y="6.5"
                width="4"
                height="27"
                rx="2"
                fill="#34D399"
              />
              <rect x="374" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="382"
                y="6.5"
                width="4"
                height="27"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="390"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="398"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="406"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="414" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="422"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="430"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="438"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="446"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="454" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="462"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="470" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="478"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="486" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="494" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="502"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="510" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="518"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="526"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect
                x="534"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="542" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="550" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="558" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="566"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="574" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="582" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="590" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="598" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="606" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="614" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="622"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="630" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="638" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="646"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
              <rect x="654" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect x="662" y="5" width="4" height="30" rx="2" fill="#34D399" />
              <rect
                x="670"
                y="12"
                width="4"
                height="16"
                rx="2"
                fill="#34D399"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto flex justify-between pb-4 px-11 -mt-5">
      <p className="text-[12px] text-slate-400">
          {recordingStatus === "inactive"
            ? "00:00"
            : `${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`}
        </p>
        <p className="text-[12px] text-slate-400">0:30</p>
      </div>

      
    </div>
    <div className="w-full flex items-center justify-between px-4 py-5 border-t">
        <div className="flex gap-x-4">
          {recordingStatus !== "inactive" ? (
            <button
              type="button"
              className="btn-border flex justify-center items-center flex-1"
              onClick={handleDone}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_572)">
                  <path
                    d="M10.3333 4.66675H5.66663C5.11434 4.66675 4.66663 5.11446 4.66663 5.66675V10.3334C4.66663 10.8857 5.11434 11.3334 5.66662 11.3334H10.3333C10.8856 11.3334 11.3333 10.8857 11.3333 10.3334V5.66675C11.3333 5.11446 10.8856 4.66675 10.3333 4.66675Z"
                    fill="#EF4444"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.99996 2.00008C4.68625 2.00008 1.99996 4.68637 1.99996 8.00008C1.99996 11.3138 4.68625 14.0001 7.99996 14.0001C11.3137 14.0001 14 11.3138 14 8.00008C14 4.68637 11.3137 2.00008 7.99996 2.00008ZM0.666626 8.00008C0.666626 3.94999 3.94987 0.666748 7.99996 0.666748C12.05 0.666748 15.3333 3.94999 15.3333 8.00008C15.3333 12.0502 12.05 15.3334 7.99996 15.3334C3.94987 15.3334 0.666626 12.0502 0.666626 8.00008Z"
                    fill="#EF4444"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_572">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <p className="ml-2 text-sm">Done</p>
            </button>
          ) : (
              <button
              type="button"
              className="btn-border flex justify-center items-center flex-1"
              onClick={startRecording}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_1325)">
                  <path
                    d="M8.00004 12.6666C10.5774 12.6666 12.6667 10.5772 12.6667 7.99992C12.6667 5.42259 10.5774 3.33325 8.00004 3.33325C5.42271 3.33325 3.33337 5.42259 3.33337 7.99992C3.33337 10.5772 5.42271 12.6666 8.00004 12.6666Z"
                    fill="#EF4444"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.99996 2.00008C4.68625 2.00008 1.99996 4.68637 1.99996 8.00008C1.99996 11.3138 4.68625 14.0001 7.99996 14.0001C11.3137 14.0001 14 11.3138 14 8.00008C14 4.68637 11.3137 2.00008 7.99996 2.00008ZM0.666626 8.00008C0.666626 3.94999 3.94987 0.666748 7.99996 0.666748C12.05 0.666748 15.3333 3.94999 15.3333 8.00008C15.3333 12.0502 12.05 15.3334 7.99996 15.3334C3.94987 15.3334 0.666626 12.0502 0.666626 8.00008Z"
                    fill="#EF4444"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_1325">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p className="ml-2 text-sm">Record</p>
            </button>
          )}

          {recordingStatus !== "inactive" &&
            (recordingStatus === "pause" ? (
            <button
            type="button"
                className="btn-border flex justify-center items-center flex-1"
                onClick={resumeRecording}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.33325 2L12.6666 8L3.33325 14V2Z" fill="#3B82F6" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.01396 1.41478C3.228 1.29792 3.48878 1.30726 3.69392 1.43913L13.0273 7.43913C13.2181 7.5618 13.3334 7.77308 13.3334 7.99992C13.3334 8.22676 13.2181 8.43804 13.0273 8.5607L3.69392 14.5607C3.48878 14.6926 3.228 14.7019 3.01396 14.5851C2.79991 14.4682 2.66675 14.2438 2.66675 13.9999V1.99992C2.66675 1.75605 2.79991 1.53164 3.01396 1.41478ZM4.00008 3.22103V12.7788L11.4339 7.99992L4.00008 3.22103Z"
                    fill="#3B82F6"
                  />
                </svg>

                <p className="ml-2 text-sm">Resume</p>
              </button>
            ) : (
              <button
              type="button"
                className="btn-border flex justify-center items-center flex-1"
                onClick={pauseRecording}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.66667 2.66675H4V13.3334H6.66667V2.66675Z"
                    fill="#3B82F6"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.33325 2.66667C3.33325 2.29848 3.63173 2 3.99992 2H6.66659C7.03478 2 7.33325 2.29848 7.33325 2.66667V13.3333C7.33325 13.7015 7.03478 14 6.66659 14H3.99992C3.63173 14 3.33325 13.7015 3.33325 13.3333V2.66667ZM4.66659 3.33333V12.6667H5.99992V3.33333H4.66659Z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M11.9999 2.66675H9.33325V13.3334H11.9999V2.66675Z"
                    fill="#3B82F6"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.66675 2.66667C8.66675 2.29848 8.96522 2 9.33341 2H12.0001C12.3683 2 12.6667 2.29848 12.6667 2.66667V13.3333C12.6667 13.7015 12.3683 14 12.0001 14H9.33341C8.96522 14 8.66675 13.7015 8.66675 13.3333V2.66667ZM10.0001 3.33333V12.6667H11.3334V3.33333H10.0001Z"
                    fill="#3B82F6"
                  />
                </svg>
                <p className="ml-2 text-sm">Pause </p>
              </button>
            ))}

          <button
            type="button"
            className="btn-border flex justify-center items-center flex-1"
            onClick={handleCancel}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 4L12 12"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="ml-2 text-sm">Cancel</p>
          </button>
        </div>
        <div>
          <select
            id="microphone"
            className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-fit"
          >
            <option selected value="microphone">
              Build-in Microphone
            </option>
            <option value="speaker">Speaker</option>
          </select>
        </div>
      </div>
    </>

  );
};

export default RecordControl;
