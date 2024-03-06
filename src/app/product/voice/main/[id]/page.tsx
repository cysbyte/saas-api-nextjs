import { deleteCustomVoiceId } from "@/app/actions/actions";
import ProductSideBar from "@/components/layout/ProductSideBar";
import Case from "@/components/sections/product/voice/main";
import DeleteModal from "@/components/shared/DeleteModal";
import { loginIsRequiredServer } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect, useSearchParams } from "next/navigation";

const Voice = async ({ params }: {
  params:
  {
    id: string
  }
}) => {
  await loginIsRequiredServer();

  // const searchParams = useSearchParams();
  // const id = searchParams?.get("id");

  async function onClose() {
    'use server'
    console.log("Modal has closed");
    redirect("/product/voice/main/0");
  }

  async function onOk() {
    'use server'
    console.log("Ok was clicked");
    await deleteCustomVoiceId(params.id);
    console.log(params)
    revalidatePath("/product/voice/main/0");
    redirect("/product/voice/main/0");
  }

  return (
    <main className="flex flex-row">
      <DeleteModal title={params.id} onClose={onClose} onOk={onOk} />

      <ProductSideBar productName="Voice" />

      <Case />
    </main>
  );
};

export default Voice;
