"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/components/providers/auth-provider";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/spinner";
import googleIcon from "../../../../public/google.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
export const Heading = () => {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") || "";
  const supabase = supabaseBrowser();
  const { isLoading, setIsLoading, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLoginOAuth = (provider: "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin + "/auth/callback?next=" + next,
      },
    });
  };
  useEffect(() => {
    const setUser = async () => {
      setIsLoading(true);
      setIsAuthenticated(false);
      const { data, error } = await supabase.auth.getSession();
      setIsLoading(false);
      if (data.session?.user) {
        setIsAuthenticated(true);
      }
    };
    setUser();
  }, [router, supabase.auth, setIsLoading, setIsAuthenticated]);
  return (
    <Suspense>
      <div className="max-w-3xl space-y-4 relative z-10 cursor-default">
        <h1 className=" text-3xl md:text-7xl sm:text-5xl bg-clip-text text-transparent dark:bg-gradient-to-b  dark:from-neutral-200 dark:to-neutral-400 bg-gradient-to-b from-neutral-900 to bg-neutral-600  text-center font-sans font-bold flex flex-col justify-center items-center">
          Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
          <span className="w-fit flex flex-col">
            <p>Documate</p>
            <div
              className="h-1 md:h-2   bg-gradient-to-r
    from-pink-500
    via-red-500
    to-yellow-500
    background-animate"
            ></div>
          </span>
        </h1>
        <h3 className="dark:text-neutral-400 text-neutral-600 max-w-lg mx-auto my-2 text-base sm:text-xl md:text-2xl font-medium text-center ">
          Documate is the connected workspace where better, faster work happens.
        </h3>
        {isLoading && (
          <div className="w-full flex justify-center items-center">
            <Spinner size={"lg"} />
          </div>
        )}
        {isAuthenticated && !isLoading && (
          <Button variant={"main"}>
            <Link href="/documents">Enter Documate</Link>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"main"}>
                  Get Documate
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
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
        )}
      </div>
    </Suspense>
  );
};
