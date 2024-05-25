"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Spinner } from "@/components/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "@supabase/supabase-js";
import { ChevronsLeftRight } from "lucide-react";

export function UserItem() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const setUser = async () => {
      setIsLoading(true);
      setIsAuthenticated(false);
      const { data, error } = await supabase.auth.getSession();
      setIsLoading(false);
      if (data.session?.user) {
        setIsAuthenticated(true);
        setSession(data.session);
      }
    };
    setUser();
  }, [router, supabase.auth, setIsAuthenticated, setIsLoading, setSession]);
  const handleLogOut = () => {
    supabase.auth.signOut();
    setIsAuthenticated(false);
    setSession(null);
    router.refresh;
    router.push("/");
  };
  return (
    <div className="flex p-4 z-[99999]">
      {isLoading && <Spinner />}
      {isAuthenticated && !isLoading && session && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex text-sm justify-between items-center  space-x-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.user_metadata.avatar_url ?? ""}
                    alt={session.user.user_metadata.full_name ?? ""}
                  />
                  <AvatarFallback>
                    {session.user.user_metadata.full_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="hidden sm:flex text-start w-fit font-medium line-clamp-2">
                  {session.user.user_metadata.full_name}
                </h2>
                <ChevronsLeftRight className=" cursor-pointer rotate-90 ml-2 text-muted-foreground h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.user_metadata.full_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.user_metadata.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogOut}
              >
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
