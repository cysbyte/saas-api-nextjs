"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import AudioRecorder from "./AudioRecorder";

type Props = {
  title: string;
  onClose: () => void;
  onOk: () => void;
};

export default function RecordModal() {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const modal = searchParams?.get("modal");

  const [audio, setAudio] = useState('');

  useEffect(() => {
    if (modal === "true") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [modal]);

  // const closeDialog = () => {
  //   dialogRef.current?.close();
  //   onClose();
  // };

  // const clickOk = () => {
  //   onOk();
  //   closeDialog();
  // };

  const dialog: JSX.Element | null =
    modal === "true" ? (
      <dialog
        ref={dialogRef}
        className="fixed w-[720px] top-50 left-50 -translate-x-50 -translate-y-50 z-10 rounded-xl backdrop:bg-gray-800/80 overflow-hidden"
      >
        <div className="w-full">
          {/* <AudioRecorder audio={audio} setAudio={setAudio} isDone={false} hasDownload={false} /> */}
        </div>
      </dialog>
    ) : null;

  return dialog;
}
