"use client";
import { useState, useEffect } from "react";
import { getById } from "@/lib/supabase/queries";
import { Document } from "@/lib/supabase/supabase.types";
import { Toolbar } from "@/components/toolbar";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
interface DocumentIdProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdProps) => {
  const supabase = supabaseBrowser();
  const [document, setDocument] = useState<Document | null>();
  async function getDocument(id: string) {
    const data = await getById(id);
    if (data.data) setDocument(data.data);
    return data;
  }
  useEffect(() => {
    getDocument(params.documentId);
  }, [params.documentId]);
  useEffect(() => {
    const channel = supabase
      .channel("realtime documents page")
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
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 lp-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  if (document === null) {
    return <div>Not Found</div>;
  }
  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initalData={document} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
