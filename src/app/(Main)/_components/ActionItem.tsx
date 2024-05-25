"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
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

export function ActionItem() {
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
  const displayAvatar = () => {
    if (session)
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user.user_metadata.avatar_url ?? ""}
                  alt={session.user.user_metadata.full_name ?? ""}
                />
                <AvatarFallback>
                  {session.user.user_metadata.full_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
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
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    else return;
  };
  return (
    <div className="flex justify-center items-center">
      {isLoading && <Spinner />}
      {/* {!isAuthenticated && !isLoading && (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="main">Log In</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Log In using your Google Account
                </DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <div className="w-full flex justify-center items-center">
                  <Button onClick={() => handleLoginOAuth("google")}>
                    <Image
                      src={googleIcon}
                      alt="google-icon"
                      className="w-5 h-5 mr-2"
                    />
                    <span>
                      {isLoading && <Spinner />}
                      {!isLoading && "Continue with Google"}
                    </span>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )} */}
      {isAuthenticated && !isLoading && (
        <>
          <Button
            className="mr-1 hidden sm:flex"
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href="/documents">Enter Documate</Link>
          </Button>
          {displayAvatar()}
        </>
      )}
    </div>
  );
}
