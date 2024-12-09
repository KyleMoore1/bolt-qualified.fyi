import React from "react";
import { Briefcase } from "lucide-react";
import { AuthButton } from "./AuthButton";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">qualified.fyi</h1>
          </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
