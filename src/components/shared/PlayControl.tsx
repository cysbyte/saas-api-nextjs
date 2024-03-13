'use client';

import { copyFileSync } from "fs";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { browserName, CustomView } from "react-device-detect";
import { MIMETYPE } from "./RecordControl";
import encodeWAV from "audiobuffer-to-wav";
import { convertWebmToMp3 } from "@/lib/util";

type Props = {
  audio: string;
  setAudio: React.Dispatch<React.SetStateAction<string>>;
  isDone: boolean;
  setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  audioBlob: Blob;
  setAudioBlob: Dispatch<SetStateAction<Blob>>;
  audioChunks: any;
  setAudioChunks: Dispatch<SetStateAction<any>>;
  file: string | Blob | File;
  setFile: Dispatch<React.SetStateAction<string | Blob | File>>;
  customVoiceId: string;
  setCustomVoiceId: Dispatch<React.SetStateAction<string>> | undefined;
  uploadStatus: string;
  setUploadStatus: Dispatch<React.SetStateAction<string>>;
};

const PlayControl: FC<Props> = (props) => {
  const audioRef = useRef<HTMLAudioElement>(null!);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressTime, setProgressTime] = useState<number>(0);

  const [isTrimming, setIsTrimming] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [percent, setPercent] = useState(0);
  const [enableDrag, setEnableDrag] = useState<boolean>(false);

  let interval: string | number | NodeJS.Timeout | undefined;

  const togglePlayPause = () => {
    //setIsPlaying((prev) => !prev);
    if (!props.audio) return;
    
    if (!isPlaying) {
      setIsPlaying(true);
      audioRef?.current?.play();
    } else {
      setIsPlaying(false);
      audioRef?.current?.pause();
    }
  };

  const skipForward = () => {
    audioRef.current.currentTime += 5;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 5;
  };

  const onLoadedMetadata = () => {
    const audioDuration = audioRef.current.duration;
    if (audioDuration === Infinity) {
      audioRef.current.currentTime = 1e101;
      audioRef.current.ontimeupdate = function () {
        this.ontimeupdate = () => {
          return;
        };
        audioRef.current.currentTime = 1e101;
        audioRef.current.currentTime = 0;
      };
    }
  };

  const onTrimClick = async () => {
    setIsTrimming(false);
    setStartX(0);
    setEndX(0);

    await trimAudio(startTime, endTime);

  };

  // useEffect(() => {
  //   if (isPlaying) {
  //     audioRef.current.play();
  //   } else {
  //     audioRef.current.pause();
  //   }
  // }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressTime(audioRef?.current?.currentTime);
        setDuration(audioRef?.current?.duration);

        if (audioRef?.current?.currentTime >= audioRef?.current?.duration) {
          setIsPlaying(false);
          audioRef.current.currentTime = 0;
          audioRef?.current?.pause();
          //setProgressTime(0);
        }
      }, 10);
    } 
    return () => clearInterval(interval);
  }, [isPlaying, progressTime]);

  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  const onEnableTrimClick = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    setIsTrimming(true);
    setStartX(0);
    setEndX(0);
    setEnableDrag(false);
    setProgressTime(audioRef.current.duration);
    //console.log('on enable trim click')
  };

  const onDropClick = () => {
    audioRef.current.pause();
    props.setIsRecording(false)
    props.setIsDone(false)
  }

  const onCancelTrimClick = () => {
    setIsTrimming(false);
    setProgressTime(audioRef.current.duration);
    setStartX(0);
    setEndX(0);
    //console.log('on cancel trim click')
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!isTrimming) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setEnableDrag(true);
    setStartX(x);
    //console.log('down',x)
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isTrimming || !enableDrag) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setEndX(x);
    // console.log(enableDrag);
    console.log("move", x);
  };

  const onMouseUp = (e: any) => {
    if (!isTrimming) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setEnableDrag(false);
    setEndX(x);
    //console.log('up',x)
  };

  let dragWidth_chrome = Math.floor(endX - startX) * 1.12;
  let left_chrome = startX + 40;

  let dragWidth = Math.floor(endX - startX);
  let left = startX;

  const onPlayBackRateSelect = (e: any) => {
    console.log(e.target.value);
    audioRef.current.playbackRate = e.target.value;
  };

  const onVolumeChange = (e: any) => {
    console.log(e.target.value);
    audioRef.current.volume = e.target.value / 20;
  };

  const minutes = Math.floor(progressTime / 60);
  const seconds = Math.floor(progressTime);
  // console.log(progressTime)
  // console.log(seconds)
  // console.log(minutes)

  useEffect(() => {
    if (audioRef.current) {
      let duration: number = audioRef.current.duration;
      let start = (startX + 40) / 600;
      let end = (endX + 40) / 600;

      console.log('duration', duration);
      // console.log('start', start * duration.toFixed(2));
      // console.log('end', end * duration.toFixed(2));
      let _startTime = Number((start * duration).toFixed(2));
      let _endTime = Number((end * duration).toFixed(2));
      if (_startTime < 0) _startTime = 0;
      if (_endTime > duration) _endTime = duration;
      setDuration(duration);
      setStartTime(_startTime);
      setEndTime(_endTime);
      const percent = (endTime - startTime) * 100 / duration;
      setPercent(percent);
    }
  }, [startX, endX]);
  

  let audioContext: any;
  function trimAudioBuffer(buffer: any, startTime: number, endTime: number) {
    const sampleRate = buffer.sampleRate;
    const startFrame = startTime * sampleRate;
    const endFrame = endTime * sampleRate;
    const duration = endTime - startTime;
    const channels = buffer.numberOfChannels;

    // Create a new AudioBuffer for the trimmed audio
    const trimmedBuffer = audioContext.createBuffer(
      channels,
      endFrame - startFrame,
      sampleRate
    );

    for (let channel = 0; channel < channels; channel++) {
      const sourceData = buffer
        .getChannelData(channel)
        .subarray(startFrame, endFrame);
      trimmedBuffer.getChannelData(channel).set(sourceData);
    }
    return trimmedBuffer;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full h-[70px] relative">
          <h2 className="text-base h-full p-5 text-center font-bold whitespace-pre-line leading-8 text-black">
            Audio
          </h2>
          {isTrimming && (
            <div className="absolute h-fit flex top-5 right-7 gap-x-3">
              <button
                type="button"
                className="btn-border w-[70px] text-sm"
                onClick={onTrimClick}
              >
                Trim
              </button>
              <button
                type="button"
                onClick={onCancelTrimClick}
                className="btn-border w-[70px] text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center w-fit mx-auto">
          <div
            className="relative w-fit h-auto mx-auto"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            {isTrimming && startX !== endX && <div>
              <p className="absolute left-0 -top-6 text-[14px] text-slate-600"
                style={{
                  left: `${browserName === "Chrome" ? left_chrome - 7 : left - 7}px `,
                }}
              >{isNaN(startTime) ? '' : startTime + 's'}</p>
              <p className="absolute left-0 -top-6 text-[14px] text-slate-600"
                style={{
                  left: `${browserName === "Chrome" ? left_chrome + dragWidth : left + dragWidth}px `,
                }}
              >{!isNaN(endTime) && percent > 6 ? endTime + 's' : ''}</p>
              <div
                className={`absolute h-full w-0 bg-[#f97316]/50 left-0 top-0 rounded-md border-2 border-opacity-50 border-indigo-700`}
                style={{
                  width: `${browserName === "Chrome" ? dragWidth_chrome : dragWidth
                    }px `,
                  left: `${browserName === "Chrome" ? left_chrome : left}px `,
                }}
              ></div>
            </div>
            }
            

            <div className="absolute w-fit mx-auto">
              <svg
                width="680"
                height="40"
                viewBox="0 0 680 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <rect x="2" y="18" width="4" height="4" rx="2" fill="#E2E8F0" />
                <rect
                  x="10"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="18"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="26"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="34"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="42"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="50"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="58"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="66"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="74"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="82"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="90"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="98"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="106"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="114"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="122"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="130"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="138"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="146"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="154"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="162"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="170"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="178"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="186"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="194"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="202"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="210"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="218"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="226"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="234"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="242"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="250"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="258"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="266"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="274"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="282"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="290"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="298"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="306"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="314"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="322"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="330"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="338"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="346"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="354"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="362"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="370"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="378"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="386"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="394"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="402"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="410"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="418"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="426"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="434"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="442"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="450"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="458"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="466"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="474"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="482"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="490"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="498"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="506"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="514"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="522"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="530"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="538"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="546"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="554"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="562"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="570"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="578"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="586"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="594"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="602"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="610"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="618"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="626"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="634"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="642"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="650"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="658"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="666"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
                <rect
                  x="674"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#E2E8F0"
                />
              </svg>
            </div>

            <div className="absolute mx-auto w-full opacity-30">
              <svg
                width="680"
                height="40"
                viewBox="0 0 680 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
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
 
            <div
              className="absolut w-full overflow-hidden left-0"
              style={{
                width: `${
                  audioRef.current &&
                  Math.floor((progressTime * 100) / audioRef.current.duration)
                }%`,
              }}
            >
              <div className="relative w-full mx-auto">
                {progressTime > 0 && !isTrimming && (
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
                )}
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
          </div>
        </div>

        <div className="w-full mx-auto flex justify-between py-4 px-11">
          <p className="text-[12px] text-slate-400">
            {`${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`}
          </p>
          <p className="text-[12px] text-slate-400">
            {formatTime(duration)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center px-6 py-5 border-t">
        <div className="flex flex-1 items-center justify-start">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="#94A3B8"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.54 8.45996C16.4774 9.3976 17.004 10.6691 17.004 11.995C17.004 13.3208 16.4774 14.5923 15.54 15.53"
              stroke="#94A3B8"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19.0699 4.92993C20.9447 6.80521 21.9978 9.34829 21.9978 11.9999C21.9978 14.6516 20.9447 17.1947 19.0699 19.0699"
              stroke="#94A3B8"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="20"
            className="w-[100px] h-[20px] cursor-pointer accent-indigo-600"
            onChange={onVolumeChange}
          />
          {/* <svg
            width="100"
            height="20"
            viewBox="0 0 100 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="6" width="100" height="8" rx="4" fill="#EEF2FF" />
            <rect y="6" width="67" height="8" rx="4" fill="#6366F1" />
            <circle
              cx="67"
              cy="10"
              r="9"
              fill="white"
              stroke="#6366F1"
              stroke-width="2"
            />
          </svg> */}
        </div>

        <div className="flex flex-1 items-center justify-center gap-x-3">
          <button type="button" onClick={skipBackward}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19L2 12L11 5V19Z"
                fill="#94A3B8"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22 19L13 12L22 5V19Z"
                fill="#94A3B8"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button type="button" className="" onClick={togglePlayPause}>
            {isPlaying && (
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_68_2722)">
                  <rect
                    x="2"
                    y="1"
                    width="40"
                    height="40"
                    rx="20"
                    fill="#6366F1"
                    shape-rendering="crispEdges"
                  />
                  <path
                    d="M20.6667 15.6667H18V26.3334H20.6667V15.6667Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.3333 15.6667C17.3333 15.2985 17.6318 15 18 15H20.6666C21.0348 15 21.3333 15.2985 21.3333 15.6667V26.3333C21.3333 26.7015 21.0348 27 20.6666 27H18C17.6318 27 17.3333 26.7015 17.3333 26.3333V15.6667ZM18.6666 16.3333V25.6667H20V16.3333H18.6666Z"
                    fill="white"
                  />
                  <path
                    d="M26 15.6667H23.3333V26.3334H26V15.6667Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.6667 15.6667C22.6667 15.2985 22.9652 15 23.3334 15H26C26.3682 15 26.6667 15.2985 26.6667 15.6667V26.3333C26.6667 26.7015 26.3682 27 26 27H23.3334C22.9652 27 22.6667 26.7015 22.6667 26.3333V15.6667ZM24 16.3333V25.6667H25.3334V16.3333H24Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_68_2722"
                    x="0"
                    y="0"
                    width="44"
                    height="44"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_68_2722"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_68_2722"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            )}
            {!isPlaying && (
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_68_2084)">
                  <rect
                    x="2"
                    y="1"
                    width="40"
                    height="40"
                    rx="20"
                    fill="#6366F1"
                    shape-rendering="crispEdges"
                  />
                  <path
                    d="M17.3333 15L26.6666 21L17.3333 27V15Z"
                    fill="white"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_68_2084"
                    x="0"
                    y="0"
                    width="44"
                    height="44"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_68_2084"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_68_2084"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            )}
          </button>

          <button type="button" onClick={skipForward}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 19L22 12L13 5V19Z"
                fill="#94A3B8"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 19L11 12L2 5V19Z"
                fill="#94A3B8"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-3">
          <button type="button" onClick={onDropClick}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H21"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          {!isTrimming && (
            <button onClick={onEnableTrimClick}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9C7.65685 9 9 7.65685 9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9Z"
                  stroke="#94A3B8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z"
                  stroke="#94A3B8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.0001 4L8.12012 15.88"
                  stroke="#94A3B8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.47 14.48L20 20"
                  stroke="#94A3B8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.12012 8.12012L12.0001 12.0001"
                  stroke="#94A3B8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
          <select
            id="speed"
            onChange={onPlayBackRateSelect}
            className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-500 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-fit"
          >
            <option value="0.5">0.5X</option>
            <option selected value="1">
              1X
            </option>
            <option value="1.5">1.5X</option>
            <option value="2">2X</option>
          </select>
        </div>
        <audio
          src={props.audio}
          ref={audioRef}
          onLoadedMetadata={onLoadedMetadata}
        />
      </div>
    </>
  );
};

export default PlayControl;
