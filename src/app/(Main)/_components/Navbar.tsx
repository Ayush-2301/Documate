"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getById } from "@/lib/supabase/queries";
import { Document } from "@/lib/supabase/supabase.types";
import { MenuIcon } from "lucide-react";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { cn } from "@/lib/utils";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Avatars } from "@/components/Avatars";
import { Menu } from "./Menu";

interface NavbarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onResetWidth: () => void;
}
export const Navbar = ({
  isCollapsed,
  onResetWidth,
  isMobile,
}: NavbarProps) => {
  const supabase = supabaseBrowser();
  const params = useParams();
  const [document, setDocument] = useState<Document | null>();
  async function getDocument(id: string) {
    const data = await getById(id);
    if (data.data) setDocument(data.data);
    return data;
  }
  useEffect(() => {
    getDocument(params.documentId as string);
  }, [params.documentId]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime documents navbar`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
        },
        (payload) => {
          setDocument(payload.new as Document);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (document === undefined)
    return (
      <nav className="bg-primary dark:bg-[#1f1f1f] px-3 py-2  w-full flex items-center  justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Sketeton />
        </div>
      </nav>
    );
  if (document === null) return null;

  return (
    <div
      className={cn(
        " w-full transition-all ease-in-out border-t  border-neutral-100  dark:border-none ",
        isMobile && "w-full"
      )}
    >
      <nav className="dark:bg-primary bg-background  px-3 py-2 w-full  flex items-center gap-x-4   ">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Menu documentId={document.id} />
            <Avatars />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document.id} />}
    </div>
  );
};
