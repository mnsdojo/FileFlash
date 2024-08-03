import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Copy, Link2, Upload, RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useSocket } from "@/context/SocketContext";
import { PeerConnectionStatus, usePeer } from "@/hooks/usePeer";
import IncomingCallDialog from "./IncomingCallDialog";

function ShareCard() {
  const { socket, userId, setPeerId, peerId } = useSocket();
  const [file, setFile] = useState<File | null>(null);
  const {
    callUser,
    peerConnectionStatus,
    acceptedCall,
    setIncomingCall,
    incomingCall,
    terminateCall,
    handleAcceptCall,
    handleRejectCall,
  } = usePeer();

  const handleConnect = () => {
    if (peerId.trim() === "") {
      toast.error("Please enter a valid Peer ID");
      return;
    }
    callUser(peerId);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      toast.success("User ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy User ID");
    }
  };

  const handleRefresh = () => {
    // Implement refresh logic here
    toast.success("Refreshing connection...");
  };

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", userId);
    }
  }, [socket, userId]);

  return (
    <div>
      <Card className="bg-card/40 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            P2P Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* My ID section */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                My ID
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  className="flex-grow bg-background/50"
                  id="name"
                  defaultValue={userId ?? ""}
                  readOnly
                  placeholder="ID"
                />
                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  size="icon"
                  title="Copy ID"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" title="Share ID">
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Peer ID section */}
            <div className="space-y-2">
              <Label
                htmlFor="peerId"
                className="text-sm font-medium text-foreground"
              >
                Peer ID
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  className="flex-grow bg-background/50"
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  id="peerId"
                  placeholder="Enter Peer Id"
                />
                {peerConnectionStatus !== PeerConnectionStatus.CONNECTED ? (
                  <Button
                    disabled={
                      peerConnectionStatus === PeerConnectionStatus.CALLING
                    }
                    onClick={handleConnect}
                    variant="secondary"
                  >
                    Connect
                  </Button>
                ) : (
                  <Button onClick={terminateCall} variant="secondary">
                    Terminate Call
                  </Button>
                )}
              </div>
            </div>

            {/* Connection Status section */}
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-foreground"
              >
                Connection Status
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  className="flex-grow bg-background/50"
                  id="status"
                  value={peerConnectionStatus}
                  readOnly
                />
                <Button
                  onClick={handleRefresh}
                  variant="secondary"
                  size="icon"
                  title="Refresh connection"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File selection section */}
            <div className="flex justify-center mt-8 ">
              <div className="grid w-full max-w-sm items-center gap-1.5 space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                    }
                  }}
                  id="file"
                  type="file"
                />
                {file && (
                  <Button variant="secondary">
                    <Upload className="mr-2 w-4 h-4" />
                    Upload
                  </Button>
                )}
              </div>
            </div>

            {/* Terminate Call button */}
            {(acceptedCall ||
              peerConnectionStatus === PeerConnectionStatus.CONNECTED) && (
              <div className="flex justify-center mt-4">
                <Button variant="secondary" onClick={terminateCall}>
                  Terminate Call
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {incomingCall && (
        <IncomingCallDialog
          from={incomingCall.from}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          onClose={() => setIncomingCall(null)}
        />
      )}
    </div>
  );
}

export default ShareCard;
