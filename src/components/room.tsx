"use client";

import { ReactNode, useEffect, useState } from "react";
import { RoomProvider } from "./../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { Spinner } from "@/components/spinner";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";

function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <Spinner size="lg" />
    </div>
  );
}

export function Room({ children }: { children: ReactNode }) {
  const supabase = supabaseBrowser();
  const params = useParams();
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, [supabase.auth]);
  const roomId = `${user?.id}:${params.documentId}`;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
