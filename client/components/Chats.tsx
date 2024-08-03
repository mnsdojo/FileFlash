"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "other" | "me";
  message: string;
}

function Chats() {
  const { peerState, socket, peerId, setPeerId, userId } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    if (!peerId || !userId) {
      toast.error("Peer Id and User Id can't be empty");
      return;
    }
    if (!message.trim().length) return;
    socket?.emit("send-message", {
      to: peerId,
      message,
    });
    setMessages((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        sender: "me",
        message,
      },
    ]);
    setMessage("");
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", (data: { from: string; message: string }) => {
      console.log(data);
      // recieved data is in object :{from:"",message:""}
      setMessages((prev) => [
        ...prev,
        {
          id: data.from,
          sender: "other",
          message: data.message,
        },
      ]);
    });
  }, [socket]);
  return (
    <div className="flex-grow flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Chat</h2>
      <ScrollArea className="flex-grow mb-4 pr-4">
        {messages.length > 0
          ? messages.map((msg) => (
              <div key={msg.id} className="mb-4 ">
                <span className="font-semibold text-primary">
                  {msg.sender === "me" ? "You" : "Other"}:
                </span>
                <span className="text-foreground">{msg.message}</span>
              </div>
            ))
          : "No Messages YET"}
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow bg-background/50"
        />
        <Button onClick={sendMessage} variant="secondary" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Chats;
