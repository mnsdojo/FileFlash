import Peer from "simple-peer";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useSocket } from "@/context/SocketContext";

export enum PeerConnectionStatus {
  INITIAL = "Initial",
  CALLING = "Calling",
  RINGING = "Ringing",
  CONNECTING = "Connecting",
  CONNECTED = "Connected",
  NONE = "None",
  DISCONNECTED = "Disconnected",
  REJECTED = "Rejected",
  ERROR = "Error",
}

export const usePeer = () => {
  const [receivingFile, setReceivingFile] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [acceptedCall, setAcceptedCall] = useState<boolean>(false);
  const [rejectedCall, setRejectedCall] = useState<boolean>(false);
  const { socket, userId, peerState, setPeerState } = useSocket();
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    signal: any;
  } | null>(null);
  const [peerConnectionStatus, setPeerConnectionStatus] =
    useState<PeerConnectionStatus>(PeerConnectionStatus.NONE);

  const handlePeerError = useCallback((err: Error) => {
    toast.error(`Peer connection error: ${err.message}`);
    setPeerConnectionStatus(PeerConnectionStatus.ERROR);
  }, []);

  const handlePeerClose = useCallback(() => {
    console.log("Connection closed");
    setPeerState(null);
    setPeerConnectionStatus(PeerConnectionStatus.DISCONNECTED);
    setAcceptedCall(false);
    toast.error("Connection closed");
  }, [setPeerState]);

  const callUser = useCallback(
    (userToCall: string) => {
      if (!socket || !userToCall) return;

      const peer = new Peer({ initiator: true, trickle: false });

      peer.on("signal", (data) => {
        socket.emit("call-user", {
          userToCall,
          signalData: data,
          from: userId,
        });
      });

      peer.on("connect", () => {
        setPeerConnectionStatus(PeerConnectionStatus.CONNECTED);
        setAcceptedCall(true);
      });

      peer.on("error", handlePeerError);
      peer.on("close", handlePeerClose);

      setPeerState(peer);
      setPeerConnectionStatus(PeerConnectionStatus.CALLING);
    },
    [socket, userId, handlePeerError, handlePeerClose, setPeerState]
  );

  const answerCall = useCallback(
    (signalData: any, peerId: string) => {
      if (!socket || !peerId) return;

      setPeerConnectionStatus(PeerConnectionStatus.RINGING);

      const peer = new Peer({ initiator: false, trickle: false });

      peer.on("signal", (data) => {
        socket.emit("answer-call", { signalData: data, to: peerId });
      });

      peer.on("connect", () => {
        setPeerConnectionStatus(PeerConnectionStatus.CONNECTED);
        setAcceptedCall(true);
      });

      peer.on("error", handlePeerError);
      peer.on("close", handlePeerClose);

      peer.signal(signalData);
      setPeerState(peer);
      setIncomingCall(null);
    },
    [socket, handlePeerError, handlePeerClose, setPeerState]
  );

  const rejectCall = useCallback(
    (peerId: string) => {
      if (!socket || !peerId) return;

      socket.emit("reject-call", { to: peerId });
      setPeerConnectionStatus(PeerConnectionStatus.REJECTED);
      setRejectedCall(true);
      setIncomingCall(null);
      toast.error("Call rejected");
      if (peerState) {
        peerState.destroy();
        setPeerState(null);
      }
    },
    [socket, peerState, setPeerState]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("call-made", ({ signal, from }) => {
      setIncomingCall({ from, signal });
    });
    socket.on("call-rejected", () => {
      setPeerConnectionStatus(PeerConnectionStatus.REJECTED);
      setRejectedCall(true);
      toast.error("Call rejected");
      if (peerState) {
        peerState.destroy();
        setPeerState(null);
      }
    });
    return () => {
      socket.off("call-made");
      socket.off("call-rejected");
    };
  }, [socket, peerState, setPeerState]);

  const handleAcceptCall = useCallback(() => {
    if (incomingCall) {
      const { signal, from } = incomingCall;
      answerCall(signal, from);
      setAcceptedCall(true);
    }
  }, [incomingCall, answerCall]);

  const terminateCall = useCallback(() => {
    if (!socket || !peerState) return;

    peerState.destroy();
    setPeerState(null);
    setPeerConnectionStatus(PeerConnectionStatus.DISCONNECTED);
    socket.emit("terminate-call", { to: incomingCall?.from });
    setAcceptedCall(false);
    toast.error("Call terminated");
  }, [socket, peerState, setPeerState, incomingCall]);

  const handleRejectCall = useCallback(() => {
    if (incomingCall) {
      rejectCall(incomingCall.from);
    }
  }, [incomingCall, rejectCall]);

  return {
    peerState,
    peerConnectionStatus,
    receivingFile,
    fileName,
    terminateCall,
    callUser,
    incomingCall,
    answerCall,
    rejectCall,
    handleAcceptCall,
    setIncomingCall,
    handleRejectCall,
    acceptedCall,
    rejectedCall,
  };
};
