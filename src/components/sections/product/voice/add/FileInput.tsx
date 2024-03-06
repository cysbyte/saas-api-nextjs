'use client'

import React, { FC, useRef, useState } from "react";

type Props = {
  audio: string;
  setAudio: React.Dispatch<React.SetStateAction<string>>;
    customVoiceId: string;
    setCustomVoiceId: React.Dispatch<React.SetStateAction<string>>;
    fileName: string;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    isUploading: boolean;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    isFileSelected: boolean;
    setIsFileSelected: React.Dispatch<React.SetStateAction<boolean>>;
    isRecording: boolean;
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
    file: string | Blob | File;
    setFile: React.Dispatch<React.SetStateAction<string | Blob | File>>;
}

const FileInput:FC<Props> = (props) => {
    const fileInput: any = useRef(); /* create a ref*/
    const [value, setValue] = useState('');

    const handleSubmit = async (event: any) => {
    event.preventDefault();
      /* get current files using ref */
      try {
          // props.setIsUploading(true);
        const file = fileInput.current.files[0];
          props.setFile(file)
        props.setFileName(file.name);
        props.setIsRecording(true);
        props.setIsFileSelected(true);
        const audioUrl = URL.createObjectURL(file);
        props.setAudio(audioUrl)
        props.setIsRecording(false);
          // const formData = new FormData();
          // formData.set('file', fileInput.current.files[0])
          // let result = await uploadAudio(formData);
          // const fileId = result.file.file_id;
          // const customVoiceId = "Voice_id_" + uuidv4();
          // result = await cloneAudio(fileId, customVoiceId);
          // props.setCustomVoiceId(customVoiceId);
          // props.setIsUploading(false);
          //setValue('')
      } catch (error) {
          props.setIsUploading(false)
          console.log(error)
          alert(error)
      }
  };

  return (
    <input
      type="file"
      id="file"
      name="file"
      ref={fileInput} /* add ref*/
      onChange={handleSubmit}
      hidden
    />
  );
};

export default FileInput;
