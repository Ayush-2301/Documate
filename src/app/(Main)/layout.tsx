import { Spinner } from "@/components/spinner";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = supabaseServer();
  let isLoading = true;
  let isAuthenticated = false;
  const { data, error } = await supabase.auth.getUser();
  isLoading = false;
  if (data.user) isAuthenticated = true;
  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (!isAuthenticated) return redirect("/");
  return (
    <div className="h-full flex">
      <Navigation />
      <main className="p-4 flex-1 h-full dark:bg-neutral-950 bg-neutral-300">
        <section className=" flex-1 h-full  bg-primary overflow-y-auto shadow-md  rounded-lg">
          {children}
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
