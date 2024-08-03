import React from "react";
import { Github, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <nav className="flex items-center space-x-2 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-lg">
        <ModeToggle />
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>

        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
      </nav>
    </div>
  );
};

export default Navbar;
