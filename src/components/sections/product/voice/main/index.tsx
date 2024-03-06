import Link from "next/link";
import React from "react";
import AddVoiceBox from "./AddVoiceBox";
import MyCreatedBox from "./MyCreatedBox";
import VoiceItemBox from "./VoiceItemBox";
import { PrismaClient } from "@prisma/client";
import { authConfig, loginIsRequiredServer } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { systemVoices } from "@/lib/systemVocieIds";
import { getUserFromDB } from "@/app/actions/actions";

const Case = async () => {
  await loginIsRequiredServer();

  const user = await getUserFromDB();
  // @ts-ignore
  const customVoices = await prisma.customVoiceId.findMany({
    // include: {
    //   author: true
    // }
    where: {
      authorId: user?.id,
    },
  });
  // console.log(customVoices)

  return (
    <aside className="flex-[5] w-full h-auto overflow-auto">
      <div className="w-[1100px] mt-14 ml-10">
        <div className="border-b py-4">
          <h1 className="text-4xl font-semibold">Voice Clone</h1>
          <p className="mt-3 text-base text-slate-600 leading-[30px]">
            Unlock the potential of our advanced technology to produce lifelike,
            <br />
            engaging speech across various languages.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-2 w-[1100px] overflow-auto">
          <Link href="/product/voice/add">
            <AddVoiceBox />
          </Link>
          {customVoices.map((item: any, index: number) => {
            return (
              <div key={index}>
                <MyCreatedBox
                  order={item.order}
                  voiceName={item.voiceName}
                  description={item.description}
                  id={item.id}
                  voiceId={item.voiceId}
                />
              </div>
            );
          })}

          {systemVoices.map((item: any, index: number) => {
            return (
              <div key={index}>
                <VoiceItemBox
                  order={index}
                  voiceId={item.voiceId}
                  voiceName={item.voiceId}
                  description="No description"
                  id={index.toString()}
                  audioUrl={item.audioUrl}
                />
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Case;
