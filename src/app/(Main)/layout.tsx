import { Spinner } from "@/components/spinner";
import { supabaseServer } from "@/lib/supabase/server";
import InputProvider from "@/components/providers/input-provider";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import PageWrapper from "./_components/PageWrapper";
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
      <InputProvider>
        <Navigation />
        <main className="m-2 md:m-4 flex-1 h-full dark:bg-neutral-950 bg-neutral-300 ">
          <PageWrapper>
            <section className="flex-1 h-full border  bg-primary overflow-y-auto shadow-md rounded-lg">
              {children}
            </section>
          </PageWrapper>
        </main>
      </InputProvider>
    </div>
  );
};

export default MainLayout;
