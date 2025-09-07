"use client"
import Navbar from "@/components/builtin/Nav";
import Wel from "@/components/builtin/wel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions"; // adjust path to your authOptions
import { useSession } from "next-auth/react";
import HomePage from "@/components/builtin/HomePage";

export default function Home() {
  const { data: session } = useSession()

  return (
    <div>
      {!session ? <Wel /> : <div><Navbar /><HomePage /></div>}
    </div>
  );
}
