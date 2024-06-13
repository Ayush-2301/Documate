"use client";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { archive, createDocuments } from "@/lib/supabase/queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";
interface ItemProps {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}
const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) => {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [user, setUser] = useState<string | null>();

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user?.user_metadata.full_name);
    }
    getUser();
  }, [supabase.auth]);
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    async function createDocument() {
      try {
        await createDocuments({ title: "Untitled", parentDocument: id }).then(
          ({ data }) => {
            if (!expanded) {
              onExpand?.();
            }
            // if (data) router.push(`/documents/${data[0].insertedId}`);
          }
        );

        toast.success("Document created successfully");
      } catch (error) {
        toast.error("Error creating document");
      }
    }
    createDocument();
  };

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    async function archiveDocument(documentId: string) {
      try {
        await archive(documentId);
        toast.success("Note moved to trash!");
        router.push("/documents");
      } catch (error) {
        console.log(error);
        toast.error("Failed to archive note.");
      }
    }
    archiveDocument(id);
  };
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-foreground/5 flex items-center text-muted-foreground font-medum",
        active && "  bg-muted-foreground/10 text-foreground"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 
          dark:hover:bg-neutral-700 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground/50",
              active && "text-foreground"
            )}
          />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon
          className={cn(
            "shrink-0 h-[18px] mr-2 text-muted-foreground",
            active && "text-foreground"
          )}
        />
      )}

      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm  hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by : {user}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};
Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex flex-col gap-y-2"
    >
      <Skeleton className="h-4 w-6" />
      <Skeleton className="h-4 w-[50%]" />
    </div>
  );
};
export default Item;
