import Image from "next/image";
import { selectNamebyId } from "@/app/_lib/query";
import { ChatInterface } from "@/components/chat-interface";
import { ChatVoiceInput } from "@/components/chat-voice-input";
import MealButton from "@/components/meal-button";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const name = await selectNamebyId(id);
  console.log("Name from DB:", name);
  if (!name) {
    return <div className="text-center">No data found</div>;
  }
  return (
    <main className="flex flex-1 flex-col min-h-screen">
      <header className="w-full h-14 border-b px-4 border-gray-200 overflow-hidden flex justify-between items-center">
        <Image src={"/logo.svg"} alt="logo" width={74} height={74} />
        <MealButton />
      </header>
      <section className="flex-1">
        <div className="p-4">
          <ChatInterface {...name} />
        </div>
      </section>
      <footer className="w-full border-t px-4 py-2 bg-white">
        <ChatVoiceInput />
      </footer>
    </main>
  );
}
