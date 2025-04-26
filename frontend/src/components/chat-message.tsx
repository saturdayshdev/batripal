"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  isUser: boolean;
  text: string;
  avatarUrl?: string;
}

export function ChatMessage({ isUser, text, avatarUrl }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 gap-2`}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 bg-blue-100">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          isUser
            ? "bg-black text-white rounded-tr-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm">{text}</p>
      </div>
      {isUser && (
        <Avatar className="h-10 w-10 bg-gray-100">
          <AvatarFallback>YOU</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export function ChatMessages() {
  const [messages, setMessages] = useState<Array<{ isUser: boolean; text: string }>>([
    { isUser: false, text: "Hello! I'm Batripal, your bariatric support assistant. How can I help with your post-surgery journey today?" }
  ]);

  // This would normally come from props or context
  const addMessage = (text: string, isUser: boolean) => {
    setMessages((prev) => [...prev, { isUser, text }]);
  };

  // Listen for socket messages
  useEffect(() => {
    const handleChatResponse = (response: { text: string; audioBase64?: string }) => {
      console.log("Adding assistant message:", response.text);
      addMessage(response.text, false);
    };

    const handleUserMessage = () => {
      console.log("User message received, but not displaying it");
      // Nie dodajemy wiadomości użytkownika do UI
    };

    // Słuchamy zdarzenia odpowiedzi asystenta
    const responseHandler = (e: CustomEvent) => handleChatResponse(e.detail);
    window.addEventListener("chat_response", responseHandler as EventListener);
    
    // Słuchamy zdarzenia wiadomości użytkownika, ale ich nie wyświetlamy
    window.addEventListener("user_message", handleUserMessage);

    return () => {
      window.removeEventListener("chat_response", responseHandler as EventListener);
      window.removeEventListener("user_message", handleUserMessage);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages
        .filter(message => !message.isUser) // Filtrujemy, aby pokazywać tylko wiadomości asystenta
        .map((message, index) => (
          <ChatMessage
            key={index}
            isUser={message.isUser}
            text={message.text}
          />
        ))}
    </div>
  );
} 