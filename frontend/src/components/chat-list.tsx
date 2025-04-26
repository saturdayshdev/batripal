import Image from "next/image";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
}

export function ChatList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 ${
            message.sender === "user" ? "justify-end" : ""
          }`}
        >
          {message.sender === "ai" && (
            <Image
              src="/logo.png"
              alt=""
              className="rounded-md"
              width={24}
              height={24}
            />
          )}
          <div
            className={`rounded-md p-3 max-w-[80%] ${
              message.sender === "ai"
                ? "bg-gray-100 text-black"
                : "bg-black text-white ml-auto"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
          {message.sender === "user" && (
            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-800 text-white text-xs font-bold">
              YOU
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
