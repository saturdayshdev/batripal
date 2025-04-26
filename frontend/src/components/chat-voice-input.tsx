"use client";

import { AudioWaveformIcon as Waveform, Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";

let socket: Socket | null = null;

export function ChatVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    // Initialize socket connection on component mount
    if (!socket) {
      console.log("Connecting to socket server at:", process.env.NEXT_PUBLIC_SOCKET_API_URL);
      socket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL as string);
      
      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });
      
      socket.on("error", (data) => {
        console.error("Socket error:", data);
      });
      
      socket.on("chat_response", (response) => {
        console.log("Received chat response:", response);
        
        // Odtwarzanie audio, jeśli jest dostępne
        if (response.audioBase64) {
          try {
            console.log("Playing audio response");
            const audio = new Audio(`data:audio/mpeg;base64,${response.audioBase64}`);
            audio.play().catch(err => console.error("Error playing audio:", err));
          } catch (error) {
            console.error("Error creating audio from base64:", error);
          }
        }
        
        // Dispatch custom event that ChatMessages can listen for
        window.dispatchEvent(
          new CustomEvent("chat_response", { detail: response })
        );
      });
    }
    
    return () => {
      // Cleanup on component unmount
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const handleMicClick = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          try {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            
            if (socket && socket.connected) {
              const arrayBuffer = await audioBlob.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              console.log("Sending chat message to server for user:", userId);
              
              // Dodaj wiadomość użytkownika
              window.dispatchEvent(new Event("user_message"));
              
              // Match the expected format in the backend's ChatMessage type
              socket.emit("chat", {
                userId: userId,
                audio: buffer
              });
            } else {
              console.error("Socket not connected");
            }
          } catch (error) {
            console.error("Error sending audio:", error);
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-24 w-24 ${
            isRecording ? "bg-black text-white border-black" : "border-gray-300"
          }`}
          onClick={handleMicClick}
        >
          {isRecording ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </div>
      {isRecording ? (
        <div className="flex justify-center items-center h-8 mb-4">
          <Waveform className="h-5 w-5 text-black animate-pulse" />
          <span className="ml-2 text-sm text-gray-600">Listening...</span>
        </div>
      ) : (
        <div className="flex justify-center items-center h-8 mb-4">
          <span className="text-sm text-gray-400">
            Click the mic to start speaking
          </span>
        </div>
      )}
    </>
  );
}
