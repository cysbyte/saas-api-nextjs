import Header from "@/components/layout/Header";
import PriceingPlan from "@/components/sections/price/PriceingPlan";
import ProductSideBar from "@/components/layout/ProductSideBar";
import React from "react";
import Case from "@/components/sections/product/text-to-speech";
import { authConfig, loginIsRequiredServer } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { getUserFromDB } from "@/app/actions/actions";

const TextToSpeech = async () => {
  await loginIsRequiredServer();

  const user = await getUserFromDB();

  const voiceNames = await prisma.textToSpeech.findMany({
    where: {
      authorId: user?.id.toString()
    },
    select: {
      voiceId: true,
      voiceName: true,
      mp3_url: true,
    }
  });
  console.log('voiceNames', voiceNames);

  return (
    <main className="flex flex-row">
      <ProductSideBar productName="TextToSpeech" />
      <Case
        voiceId=""
        voiceNames={voiceNames}
        user={user}
      />
    </main>
  );
};

export default TextToSpeech;
