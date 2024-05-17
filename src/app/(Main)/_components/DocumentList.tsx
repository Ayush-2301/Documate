"use client";
import { getSidebar } from "@/lib/supabase/queries";
import { Document } from "@/lib/supabase/supabase.types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Spinner } from "@/components/spinner";

interface DocumentListProps {
  parentDocument?: string;
  level?: number;
  data?: Document[];
}

const DocumentList = ({
  parentDocument,
  level = 0,
  data,
}: DocumentListProps) => {
  const supabase = supabaseBrowser();
  const params = useParams();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[] | null>();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };
  async function queryDocument(parentDocument: string | undefined) {
    const data = await getSidebar({ parentDocument });

    if (data.data) setDocuments(data.data);
  }
  useEffect(() => {
    queryDocument(parentDocument);
  }, [parentDocument]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime documents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
        },
        (payload) => {
          console.log(payload);
          queryDocument(parentDocument);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, parentDocument]);
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  if (documents === undefined)
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="default" />
      </div>
    );
  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium  text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documents !== undefined &&
        documents?.map((document) => {
          return (
            <div key={document.id}>
              <Item
                id={document.id}
                onClick={() => onRedirect(document.id)}
                label={document.title}
                icon={FileIcon}
                documentIcon={document.icon!}
                active={params.documentId === document.id}
                level={level}
                onExpand={() => onExpand(document.id)}
                expanded={expanded[document.id]}
              />
              {expanded[document.id] && (
                <DocumentList parentDocument={document.id} level={level + 1} />
              )}
            </div>
          );
        })}
    </>
  );
};

export default DocumentList;
