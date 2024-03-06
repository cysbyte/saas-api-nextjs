"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";

type Props = {
  title: string;
  onClose: () => void;
  onOk: () => void;
};

export default function DeleteModal(props:Props) {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const modal = searchParams?.get("modal");
  const id = searchParams?.get("id");
  const voiceName = searchParams?.get('voiceName') || 'Unnamed';
  console.log(id);
  console.log(modal);

  useEffect(() => {
    if (modal === "true") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [modal]);

  const closeDialog = () => {
    dialogRef.current?.close();
    props.onClose();
  };

  const clickOk = () => {
    props.onOk();
    closeDialog();
  };

  const dialog: JSX.Element | null =
    modal === "true" ? (
      <dialog
        ref={dialogRef}
        className="fixed w-[520px] top-50 left-50 -translate-x-50 -translate-y-50 z-10 rounded-xl backdrop:bg-gray-800/80 overflow-hidden"
      >
        <div className="w-full">
          <div className="border rounded-md bg-white shadow-xl w-full h-auto justify-start flex flex-col">
            <div className="mx-8">
              <h3 className=" text-xl font-semibold mt-4 truncate ..">Delete Voice {voiceName}</h3>
              <p className="text-sm text-slate-600 mt-4">
                Are you sure want to delete the voice?
              </p>
              <div className="w-full flex justify-end my-6">
                <div className="flex gap-x-3">
                  <button
                    onClick={closeDialog}
                    className="btn-border flex-1 w-[100px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={clickOk}
                    className="btn-border flex-1 bg-indigo-600 text-white"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    ) : null;

  return dialog;
}
