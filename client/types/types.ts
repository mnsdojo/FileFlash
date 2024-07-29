// types.ts

// types.ts

import { Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket | null;
  userId: string;
  socketId?: string;
  peerState: any; // Replace `any` with a more specific type if possible
  setSocketId: (id: string | undefined) => void;
  setPeerState: (state: any) => void; // Replace `any` with a more specific type if possible
}

export interface SocketProviderProps {
  children: React.ReactNode;
}
