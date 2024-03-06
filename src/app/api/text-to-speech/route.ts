import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const maxDuration = 200;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();

  const voiceId = formData.get("voiceId") as string;
  const voiceName = formData.get("voiceName") as string;
  const description = formData.get("description") as string;
  const text = formData.get("text") as string;
  const userId = formData.get('userId') as string;

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
      signal: AbortSignal.timeout(200000),
    }
  );
  const { file_name } = await response.json();
  const mp3_url =
    "https://saas-minimax.s3.ap-northeast-1.amazonaws.com/" + file_name;
  
    await prisma.user.update({
      where: {
        id: userId
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
            id: userId
          },
        },
      },
    });

  return NextResponse.json({ mp3_url: mp3_url });
}
