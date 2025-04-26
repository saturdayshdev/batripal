"use client";

import { AudioWaveformIcon as Waveform, Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function ChatVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleMicClick = async () => {
    if (!isRecording) {
      // Start recording
      if (!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_SOCKET_API_URL}`);
      }
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        if (socket) {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          console.log("Sending audio buffer to server", buffer);
          socket.emit("audio", buffer);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
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
