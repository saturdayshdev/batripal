import Image from "next/image";
import { selectNamebyId } from "@/app/_lib/query";
import { ChatInterface } from "@/components/chat-interface";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const name = await selectNamebyId(id);
  console.log("Name from DB:", name);
  if (!name) {
    return <div className="text-center">No data found</div>;
  }
  return (
    <main className="flex flex-1 flex-col gap-4">
      <header className="w-full h-14 border-b px-4 border-gray-200 overflow-hidden flex">
        <Image src={"/logo.svg"} alt="logo" width={74} height={74} />
      </header>
      <section>
        <div className="p-4">
          <ChatInterface {...name} />
        </div>
      </section>
    </main>
  );
}
