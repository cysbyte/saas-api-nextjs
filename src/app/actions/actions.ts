"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";
import { exec, spawn } from "child_process";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { createCheckoutLink, createCustomerIfNull, hasSubscription, priceIds } from "@/lib/stripe";

const group_id = "1697534675713802";
const api_key =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJoZWV5byIsIlVzZXJOYW1lIjoiaGVleW8iLCJBY2NvdW50IjoiIiwiU3ViamVjdElEIjoiMTY5NzUzNDY3NTQ4MDI3MyIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE2OTc1MzQ2NzU3MTM4MDIiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiJkZXZAaGVleW8ubGlmZSIsIkNyZWF0ZVRpbWUiOiIyMDI0LTAyLTExIDEwOjQ3OjA4IiwiaXNzIjoibWluaW1heCJ9.rlxFHGoLAgMgx4wgsNHoxhOL2k37PEQpsr_RxKh0pZgEAL_VuPI5bIo10l97PcV9SvkX5XxBL2koS9Jt1HMp-Ig2y8NSWo0dTyddV0QZ02KtRvsdGmpEGZGpkKJY9_Cp0j35CSvdf1OEGvF3TWusThAyvNtaCJk4Ti1yD_OrBt977PWKdFfmQ4xWjTPjTZY-i6FvCMOJbqn47CeVWBgJkqy9-cdaajciI4dq9n4ZATcgxGtVDKloO98eZiVQhMP3eM8HDp8N1LU7uERmQSRHXHrCuwoGyRg99Q3l2LeOGUfI9v2xUdtqD2ld9-1Y-PVJyMrY--tERstauCFwDxwKxw";
const maxDuration = 299;
  
export const generateTextToSpeech = async (
  formData: FormData,
  forClone: boolean,
  userId: string,
) => {
  const voiceId = formData.get("voiceId") as string;
  const voiceName = formData.get("voiceName") as string;
  const description = formData.get("description") as string;
  const text = formData.get("text") as string;

  const response = await fetch(
    `http://saas-api-lb-1226519020.ap-northeast-1.elb.amazonaws.com/api/text-to-speech`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice_id: voiceId,
        text: text,
      }),
      signal: AbortSignal.timeout(maxDuration),
    }
  );
  const { file_name } = await response.json();
  const mp3_url =
    "https://saas-minimax.s3.ap-northeast-1.amazonaws.com/" + file_name;

  if (forClone) {
    return { mp3_url };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      currentVoiceId: voiceId,
      currentVoiceName: voiceName,
      currentDescription: description,
      currentText: text,
    },
  });

  const speechCount = await prisma.textToSpeech.count();

  const new_voice = await prisma.textToSpeech.create({
    data: {
      voiceId,
      voiceName,
      description: description ? description : "",
      text,
      mp3_url,
      order: speechCount + 1,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
  //console.log(new_voice)
  return { mp3_url };

  // const translatedTextPromise = new Promise((resolve, reject) => {
  //     const pyprog = spawn('python3', ["text-to-speech.py", voiceId, text]);
  //     pyprog.stdout.on('data', function (data) {
  //         resolve(data.toString());
  //     });
  //     pyprog.stderr.on('data', (data) => {
  //         reject(data.toString());
  //     });
  // });
  // const src = await translatedTextPromise;
  // console.log(src)
  // return src;
};

export const getUserFromDB = async () => {
  const session = await getServerSession(authConfig);
  if (!session) return null;

  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email as string,
    },
    // cacheStrategy: {
    //   ttl: 60,
    // },
  });
  return user;
};

export const deleteCustomVoiceId = async (id: string) => {
  await prisma.customVoiceId.delete({
    where: {
      id: id?.toString(),
    },
  });
};

export const mp3ToText = async (formData: FormData) => {
  const url = "http://www.localhost:8000/mp3-to-text";

  try {
    const result = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await result.json();

    //console.log("data", data);
    return data;
  } catch (error) {
    console.error(error);
  }

  return { success: true };
};



export const saveCustomVoiceId = async (formData: FormData) => {
  const voiceId = formData.get("voiceId") as string;
  if (!voiceId || voiceId === "") return;
  const voiceName = formData.get("voiceName") as string;
  const description = formData.get("description") as string;

  const session = await getServerSession(authConfig);
  if (!session) return;
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email?.toString(),
    },
  });

  const count = await prisma.customVoiceId.count();
  // @ts-ignore
  const new_custom_voice = await prisma.customVoiceId.create({
    data: {
      voiceId,
      voiceName,
      description: description ? description : "",
      order: count + 1,
      author: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  return user;
};

export const uploadAudio = async (formData: FormData) => {
  // const file: File | Blob | null = formData.get('file') as unknown as File | Blob
  // if (!file) {
  //   throw new Error('No file uploaded')
  // }

  const url = `https://api.minimax.chat/v1/files/upload?GroupId=${group_id}`;
  formData.set("purpose", "voice_clone");

  const result = await fetch(url, {
    method: "POST",
    headers: {
      authority: "api.minimax.chat",
      authorization: `Bearer ${api_key}`,
    },
    body: formData,
    signal: AbortSignal.timeout(maxDuration),
  });

  const data = await result.json();
  if (data.base_resp.status_code !== 0) {
    throw new Error(data.base_resp.status_msg);
  }
  console.log("data", data);
  return data;
};

export const cloneAudio = async (
  fileId: string,
  voiceId: string | null = ""
) => {
  const url = `https://api.minimax.chat/v1/voice_clone?GroupId=${group_id}`;

  console.log("voiceId", voiceId);

  const result = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      file_id: fileId,
      voice_id: voiceId?.trim(),
    }),
    signal: AbortSignal.timeout(maxDuration),
  });

  const data = await result.json();
  console.log("data", data);
  if (data.base_resp.status_code !== 0) {
    throw new Error(data.base_resp.status_msg);
  }

  return data;
};

export const deleteUploadedAudio = async (fileId: string) => {
  const url = `https://api.minimax.chat/v1/files/delete?GroupId=${group_id}`;

  const result = await fetch(url, {
    method: "POST",
    headers: {
      authority: "api.minimax.chat",
      "content-type": "application/json",
      authorization: `Bearer ${api_key}`,
      purpose: "voice_clone",
    },
    body: JSON.stringify({
      file_id: fileId,
    }),
  });

  const data = await result.json();
  console.log("data", data);
  if (data.base_resp.status_code !== 0) {
    throw new Error(data.base_resp.status_msg);
  }

  return data;
};

export const getCheckoutLink = async (type: string) => {
  const customer = await createCustomerIfNull();
  const hasSub = await hasSubscription();
  console.log(hasSub);
  console.log(customer);
  const priceId = priceIds.filter((item) => item.type === type)[0].priceId;
  const checkoutLink = await createCheckoutLink(String(customer), priceId);
  return checkoutLink
}
