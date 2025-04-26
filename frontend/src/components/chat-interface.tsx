import type { Message } from "@/types/chat";
import { ChatList } from "@/components/chat-list";

export function ChatInterface(userName: object) {
  const { name } = userName as {
    name: string;
  };
  const messages: Message[] = [
    {
      text: `Hello${
        userName ? ` ${name}` : ""
      }! I'm Baripal, your bariatric support assistant. How can I help with your post-surgery journey today?`,
      sender: "ai",
    },
    {
      text: `Hello${
        userName ? ` ${name}` : ""
      }! I'm Baripal, your bariatric support assistant. How can I help with your post-surgery journey today?`,
      sender: "user",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <ChatList messages={messages} />
    </div>
  );
}
