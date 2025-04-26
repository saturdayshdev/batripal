"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  isUser: boolean;
  text: string;
  agent?: string;
  avatarUrl?: string;
}

export function ChatMessage({ isUser, text, agent, avatarUrl }: ChatMessageProps) {
  // Wybieramy odpowiedni kolor awatara w zależności od agenta
  const getAvatarColorClass = () => {
    if (agent === "triage") return "bg-blue-100";
    if (agent === "dietetic") return "bg-green-100";
    if (agent === "psychotherapy") return "bg-purple-100";
    return "bg-gray-100";
  };

  // Wybieramy odpowiedni skrót w zależności od agenta
  const getAvatarInitials = () => {
    if (agent === "triage") return "TR";
    if (agent === "dietetic") return "DI";
    if (agent === "psychotherapy") return "PS";
    return "AI";
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 gap-2`}
    >
      {!isUser && (
        <Avatar className={`h-10 w-10 ${getAvatarColorClass()}`}>
          <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
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
  const [messages, setMessages] = useState<Array<{ isUser: boolean; text: string; agent?: string }>>([
    { 
      isUser: false, 
      text: "Hello! I'm Batripal, your bariatric support assistant. How can I help with your post-surgery journey today?",
      agent: "triage" 
    }
  ]);

  // This would normally come from props or context
  const addMessage = (text: string, isUser: boolean, agent?: string) => {
    setMessages((prev) => [...prev, { isUser, text, agent }]);
  };

  // Listen for socket messages
  useEffect(() => {
    const handleChatResponse = (response: { 
      text: string; 
      audioBase64?: string;
      agent?: string; 
    }) => {
      console.log("Adding assistant message:", response);
      
      // Parsuj response.text żeby sprawdzić czy zawiera informacje o agencie
      try {
        // Sprawdź czy to jest format JSON
        if (response.text.includes('"agent"') && response.text.includes('"content"')) {
          const jsonStart = response.text.indexOf('{');
          const jsonEnd = response.text.lastIndexOf('}') + 1;
          
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            const jsonStr = response.text.substring(jsonStart, jsonEnd);
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.agent && parsed.content) {
              // Dodaj wiadomość z agentem i treścią
              addMessage(parsed.content, false, parsed.agent);
              return;
            }
          }
        }
      } catch (e) {
        console.log("Not a valid JSON in response text");
      }
      
      // Dodaj oryginalną wiadomość, jeśli nie wykryto formatu JSON
      addMessage(response.text, false, response.agent || "triage");
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
        .filter(message => !message.isUser && (!message.agent || message.agent === "triage")) // Pokazujemy tylko wiadomości od triageAgent
        .map((message, index) => (
          <ChatMessage
            key={index}
            isUser={message.isUser}
            text={message.text}
            agent={message.agent}
          />
        ))}
    </div>
  );
} 