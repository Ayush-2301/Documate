import { Navbar } from "./_components/Navbar";
import { Boxes } from "@/components/ui/background-boxes";
import AuthProvider from "@/components/providers/auth-provider";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <AuthProvider>
        {
          <div className="h-full relative w-full overflow-hidden bg-background flex flex-col items-center justify-center ">
            <Navbar />
            <div className="absolute inset-0 w-full h-full bg-background z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <main className="mt-36 z-30">{children}</main>
          </div>
        }
      </AuthProvider>
    </div>
  );
};
export default LandingPageLayout;
