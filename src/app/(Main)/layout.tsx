import { Spinner } from "@/components/spinner";
import { supabaseServer } from "@/lib/supabase/server";
import InputProvider from "@/components/providers/input-provider";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import PageWrapper from "./_components/PageWrapper";
import { Room } from "@/components/room";

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
      <Room>
        <InputProvider>
          <Navigation />
          <PageWrapper>
            <section className="flex-1 h-full   dark:bg-primary bg-background overflow-y-auto ">
              {children}
            </section>
          </PageWrapper>
        </InputProvider>
      </Room>
    </div>
  );
};

export default MainLayout;
