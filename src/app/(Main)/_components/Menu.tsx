"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { archive } from "@/lib/supabase/queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
interface MenuProps {
  documentId: string;
}
export const Menu = ({ documentId }: MenuProps) => {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  const onArchive = () => {
    if (!documentId) return;
    async function archiveDocument(documentId: string) {
      try {
        await archive(documentId);
        toast.success("Note moved to trash!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to archive note.");
      }
    }
    archiveDocument(documentId).then(() => router.push("/documents"));
  };

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, [supabase.auth]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by : {user?.user_metadata.full_name}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Sketeton = function MenuSketeton() {
  return <Skeleton className="h-8 w-10" />;
};
