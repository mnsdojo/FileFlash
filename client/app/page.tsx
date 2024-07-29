import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="container mx-auto py-8 md:py-24 px-5 md:px-8">
      <h1 className="text-4xl font-bold text-pretty">Welcome to FileFlash</h1>
      <Button asChild>
        <Link href="/transfer">Start Transfer Files</Link>
      </Button>
    </div>
  );
}

export default Page;
