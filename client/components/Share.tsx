"use client";
import ShareCard from "./ShareCard";
import Chats from "./Chats";

export default function Share() {
  return (
    <div className="min-h-screen w-full p-4 bg-background flex items-center justify-center overflow-auto">
      <div className="w-full max-w-4xl bg-card/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-border my-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border p-4">
            <div className="flex-grow">
              <ShareCard />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Chats />
          </div>
        </div>
      </div>
    </div>
  );
}
