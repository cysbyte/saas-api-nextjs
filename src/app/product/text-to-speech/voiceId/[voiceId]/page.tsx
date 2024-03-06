import { getUserFromDB } from "@/app/actions/actions";
import ProductSideBar from "@/components/layout/ProductSideBar";
import Case from "@/components/sections/product/text-to-speech";
import { authConfig, loginIsRequiredServer } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";

const TextToSpeech = async ({
  params,
}: {
  params: {
    voiceId: string;
  };
}) => {
  await loginIsRequiredServer();

  const user = await getUserFromDB();

  const voiceNames = await prisma.textToSpeech.findMany({
    where: {
      authorId: user?.id.toString(),
    },
    select: {
      voiceId: true,
      voiceName: true,
      mp3_url: true,
    },
  });

  return (
    <main className="flex flex-row">
      <ProductSideBar productName="TextToSpeech" />
      <Case
        voiceId={params.voiceId}
        voiceNames={[]}
        user={user}
      />
    </main>
  );
};

export default TextToSpeech;
