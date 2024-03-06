import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

// Run a Python script and return output
// export function runPythonScript(scriptPath: string, args: any) {
//   // Use child_process.spawn method from
//   // child_process module and assign it to variable
//   const pyProg = spawn("python", [scriptPath].concat(args));

//   // Collect data from script and print to console
//   let data = "";
//   pyProg.stdout.on("data", (stdout: any) => {
//     data += stdout.toString();
//   });

//   // Print errors to console, if any
//   pyProg.stderr.on("data", (stderr: any) => {
//     console.log(`stderr: ${stderr}`);
//   });

//   // When script is finished, print collected data
//   pyProg.on("close", (code: string) => {
//     console.log(`child process exited with code ${code}`);
//     console.log(data);
//   });
// }

// Run the Python file
// runPythonScript('/path/to/python_file.py', [arg1, arg2]);

export async function convertWebmToMp3(blobUrl: string) {
  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  // toBlobURL is used to bypass CORS issue, urls with the same
  // domain can be used directly.
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  try {
    await ffmpeg.writeFile("input.webm", await fetchFile(blobUrl));
    await ffmpeg.exec(["-i", "input.webm", "output.mp3"]);
    const data = await ffmpeg.readFile("output.mp3");

    const suggestedName = "microphone-recording.mp3";
    const handle = await window.showSaveFilePicker({ suggestedName });
    const writable = await handle.createWritable();
    //@ts-ignore
    await writable.write(data.buffer);
    await writable.close();

    return handle.getFile();
  } catch (error) {
    return '';
    console.log(error)
  }
  // @ts-ignore
  // const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));
  // const fileName = uuidv4() + '.mp3';
  // downloadBlob(url, fileName);
  // return fileName;
}

function downloadBlob(blobUrl: string, name = 'file.txt') {

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}
