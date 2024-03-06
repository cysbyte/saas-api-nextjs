import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 299;
export const dynamic = "force-dynamic";

const group_id = "1697534675713802";
const api_key =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJoZWV5byIsIlVzZXJOYW1lIjoiaGVleW8iLCJBY2NvdW50IjoiIiwiU3ViamVjdElEIjoiMTY5NzUzNDY3NTQ4MDI3MyIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE2OTc1MzQ2NzU3MTM4MDIiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiJkZXZAaGVleW8ubGlmZSIsIkNyZWF0ZVRpbWUiOiIyMDI0LTAyLTExIDEwOjQ3OjA4IiwiaXNzIjoibWluaW1heCJ9.rlxFHGoLAgMgx4wgsNHoxhOL2k37PEQpsr_RxKh0pZgEAL_VuPI5bIo10l97PcV9SvkX5XxBL2koS9Jt1HMp-Ig2y8NSWo0dTyddV0QZ02KtRvsdGmpEGZGpkKJY9_Cp0j35CSvdf1OEGvF3TWusThAyvNtaCJk4Ti1yD_OrBt977PWKdFfmQ4xWjTPjTZY-i6FvCMOJbqn47CeVWBgJkqy9-cdaajciI4dq9n4ZATcgxGtVDKloO98eZiVQhMP3eM8HDp8N1LU7uERmQSRHXHrCuwoGyRg99Q3l2LeOGUfI9v2xUdtqD2ld9-1Y-PVJyMrY--tERstauCFwDxwKxw";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();

  const voiceId = formData.get("voiceId") as string;
  const voiceName = formData.get("voiceName") as string;
  const description = formData.get("description") as string;
  const text = formData.get("text") as string;
  const userId = formData.get("userId") as string;

  // let result = await uploadAudio(formData);
  // const fileId = result.file.file_id;
  // const customVoiceId = "Voice_id_" + uuidv4();
  // result = await cloneAudio(fileId, customVoiceId);
  // if (result.base_resp.status_code !== 0) {
  //   throw new Error(result.base_resp.status_msg);
  // }
  // console.log(customVoiceId);
  // formData.set("voiceId", customVoiceId);
  // console.log("saveCustomVoiceId");
  // const user = await saveCustomVoiceId(formData);
  // console.log(user);
  // formData.set("text", user?.currentText as string);
  // console.log(user?.currentText as string);
  // console.log("generateTextToSpeech");

  // Upload Audio
  console.log("upload audio -----------------------------");
  let url = `https://api.minimax.chat/v1/files/upload?GroupId=${group_id}`;
  formData.set("purpose", "voice_clone");

  let result = await fetch(url, {
    method: "POST",
    headers: {
      authority: "api.minimax.chat",
      authorization: `Bearer ${api_key}`,
    },
    body: formData,
  });

  let data = await result.json();
  if (data.base_resp.status_code !== 0) {
    return NextResponse.json({
      message: data.base_resp.status_msg,
      status: 500,
    });
  }
  const fileId = data.file.file_id;

  // Clone Voice
  console.log("clone audio -----------------------------");
  const customVoiceId = "Voice_id_" + uuidv4();
  url = `https://api.minimax.chat/v1/voice_clone?GroupId=${group_id}`;
  console.log("voiceId", customVoiceId);
  result = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      file_id: fileId,
      voice_id: customVoiceId,
    }),
  });

  data = await result.json();
  console.log("data", data);
  if (data.base_resp.status_code !== 0) {
    return NextResponse.json({
      message: data.base_resp.status_msg,
      status: 500,
    });
  }

  // Save CustomVoiceId
  console.log("Save customVoiceId ----------------");
  const count = await prisma.customVoiceId.count();
  const new_custom_voice = await prisma.customVoiceId.create({
    data: {
      voiceId: customVoiceId,
      voiceName,
      description: description ? description : "",
      order: count + 1,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });

  // Generate TextToSpeech
  console.log("generateTextToSpeech------------------");
    console.log(text);
  const response = await fetch(
    `http://saas-api-lb-1226519020.ap-northeast-1.elb.amazonaws.com/api/text-to-speech`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice_id: customVoiceId,
        text: text,
      }),
    }
  );
  const { file_name } = await response.json();
  const mp3_url =
    "https://saas-minimax.s3.ap-northeast-1.amazonaws.com/" + file_name;

  return NextResponse.json({ mp3_url: mp3_url, status: 200 });
}
