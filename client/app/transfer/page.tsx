import Share from "@/components/Share";
import { SocketProvider } from "@/context/SocketContext";
import React from "react";

function Page() {
  return (
    <SocketProvider>
      <Share />
      {/* <Toaster /> */}
    </SocketProvider>
  );
}

export default Page;
