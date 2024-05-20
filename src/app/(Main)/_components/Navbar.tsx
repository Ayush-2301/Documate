"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getById } from "@/lib/supabase/queries";
import { Document } from "@/lib/supabase/supabase.types";
import { MenuIcon } from "lucide-react";
import { Title } from "./Title";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
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

  if (document === undefined) return <p>Loading...</p>;
  if (document === null) return null;

  return (
    <>
      <nav className="bg-primary dark:bg-[#1f1f1f] px-3 py-2 w-[90%] flex items-center gap-x-4  md:ml-4  md:mt-4 m-2 rounded-t-lg">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
        </div>
      </nav>
    </>
  );
};
