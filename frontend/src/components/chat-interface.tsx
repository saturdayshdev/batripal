"use client";

import { ChatMessages } from "@/components/chat-message";

export function ChatInterface(userName: object) {
  const { name } = userName as {
    name: string;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <ChatMessages />
    </div>
  );
}
