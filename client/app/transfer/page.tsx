import Share from "@/components/Share";
import { SocketProvider } from "@/context/SocketContext";
import React from "react";
import { Toaster } from "react-hot-toast";

function Page() {
  return (
    <SocketProvider>
      <Share />
      <Toaster />
    </SocketProvider>
  );
}

export default Page;
