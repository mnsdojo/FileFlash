"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";

// Define the type for the socket context
interface SocketContextType {
  socket: Socket | null;
  peerId: string;
  setPeerId: React.Dispatch<React.SetStateAction<string>>;

  userId: string;
  socketId: string | undefined;
  peerState: any; // Adjust type if needed
  setPeerState: React.Dispatch<any>; // Adjust type if needed
  setSocketId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create context with a default value of undefined
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// SocketProvider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [peerState, setPeerState] = useState<any>(); // Adjust type if needed

  useEffect(() => {
    const socketIo = io(String(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL));

    setSocket(socketIo);

    socketIo.on("connect", () => {
      const newId = nanoid(10);
      setUserId(newId);
      setSocketId(socketIo.id);
    });

    socketIo.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        userId,
        peerId,
        setPeerId,
        socketId,
        peerState,
        setPeerState,
        setSocketId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
