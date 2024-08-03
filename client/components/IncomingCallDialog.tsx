// components/IncomingCallDialog.tsx
import React from "react";
import { Button } from "./ui/button";

interface IncomingCallDialogProps {
  from: string;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
  from,
  onAccept,
  onReject,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="
        p-6 rounded-lg shadow-xl
        backdrop-blur-md
        bg-white dark:bg-gray-800
        bg-opacity-80 dark:bg-opacity-80
        text-gray-800 dark:text-white
        border border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
      "
      >
        <h3 className="text-xl font-semibold mb-4">Incoming Call</h3>
        <p className="mb-6">
          You have an incoming call from{" "}
          <span className="font-bold">{from}</span>.
        </p>
        <div className="flex gap-4 justify-end">
          <Button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              onReject();
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
