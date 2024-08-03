import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh  bg-white dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to FlashFile
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Share Files Media in realtime with ease
                </p>
              </div>
              <div>
                <Button asChild>
                  <Link href="/transfer">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
