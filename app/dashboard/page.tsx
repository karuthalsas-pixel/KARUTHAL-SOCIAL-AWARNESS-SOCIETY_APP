"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#001f22] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
          <Button onClick={handleLogout} variant="secondary" className="gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>
        
        <div className="bg-[#02393e]/50 border border-[#0FA4AF]/30 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-[#00F0FF] mb-4">Welcome to your dashboard!</h2>
          <p className="text-[#AFDDE5]">
            This is the restricted area for normal users and organizations. 
            Since you do not have the Admin role, you cannot access the main system settings.
          </p>
        </div>
      </div>
    </div>
  );
}
