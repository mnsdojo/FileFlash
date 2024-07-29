// SocketProvider.tsx
"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";

import { SocketContextType, SocketProviderProps } from "@/types/types";

// Create context with a default value of undefined
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerState, setPeerState] = useState<any>(null); // Replace `any` with a more specific type if possible
  const [socketId, setSocketId] = useState<string | undefined>(undefined);
  const userId = useMemo(() => nanoid(10), []);

  // Initialize socket connection and cleanup on unmount
  useEffect(() => {
    const socketIo = io(String(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL));
    setSocket(socketIo);
    setSocketId(socketIo.id);

    // Cleanup function to disconnect the socket
    return () => {
      socketIo.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  // Functions to connect and disconnect
  const connect = useCallback(() => {
    socket?.connect();
  }, [socket]);

  const disconnect = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      socket,
      userId,
      socketId,
      peerState,
      setSocketId,
      setPeerState,
      connect,
      disconnect,
    }),
    [socket, userId, socketId, peerState, connect, disconnect]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
