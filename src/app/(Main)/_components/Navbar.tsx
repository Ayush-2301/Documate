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
      .channel("realtime documents navbar")
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
      <nav className="bg-primary dark:bg-[#1f1f1f] px-3 py-2 max-w-[calc(100%-32px)] w-full flex items-center   rounded-t-lg justify-between">
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
        "max-w-[calc(100%-32px)] w-full rounded-t-lg transition-all ease-in-out  ",
        isMobile && "max-w-[calc(100%-16px)] w-full"
      )}
    >
      <nav className="bg-primary dark:bg-[#1f1f1f] px-3 py-2 w-full rounded-t-lg flex items-center gap-x-4   ">
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
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document.id} />}
    </div>
  );
};
