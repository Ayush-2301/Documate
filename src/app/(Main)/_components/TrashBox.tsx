"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document } from "@/lib/supabase/supabase.types";
import { getTrash, remove, restore } from "@/lib/supabase/queries";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ConfirmModal } from "@/components/modals/confirm-modal";
const TrashBox = () => {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const params = useParams();
  const [documents, setDocuments] = useState<Document[] | null>();
  const [search, setSearch] = useState("");

  async function queryArchivedDocuments() {
    const data = await getTrash();
    if (data.data) setDocuments(data.data);
  }

  async function restoreDocument(documentId: string) {
    const data = await restore(documentId);
  }

  async function removeDocument(documentId: string) {
    const data = await remove(documentId);
  }

  const filterDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();
    async function callFunctions() {
      try {
        await restoreDocument(documentId);
        toast.success("Document restored");
      } catch (error) {
        toast.error("Failed to restore document");
      }
    }
    callFunctions();
  };

  const onRemove = (documentId: string) => {
    async function callFunctions() {
      try {
        await removeDocument(documentId);
        toast.success("Document deleted");
      } catch (error) {
        toast.error("Failed to delete document");
      }
    }
    callFunctions();
    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  useEffect(() => {
    queryArchivedDocuments();
  }, []);
  useEffect(() => {
    const channel = supabase
      .channel("realtime documents trashbox")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
        },
        (payload) => {
          console.log(payload);
          queryArchivedDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No document found
        </p>
        {filterDocuments?.map((document) => {
          return (
            <div
              key={document.id}
              role="button"
              onClick={() => onClick(document.id)}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-muted-foreground justify-between"
            >
              <span className="truncate pl-2">{document.title}</span>
              <div className="flex items-center ">
                <div
                  onClick={(e) => onRestore(e, document.id)}
                  role="button"
                  className="rounded-sm p-2
                  hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal onConfirm={() => onRemove(document.id)}>
                  <div
                    role="button"
                    className="rounded-sm p-2
                 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrashBox;
