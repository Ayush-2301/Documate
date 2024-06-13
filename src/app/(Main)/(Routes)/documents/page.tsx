"use client";
import { Button } from "@/components/ui/button";
import { createDocuments, getDocumentStatus  } from "@/lib/supabase/queries";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [user, setUser] = useState<string | undefined>();
  const [isLoading, setLoading] = useState<boolean>(true);
   const [creationStatus, setCreationStatus] = useState<string | null>(null);
  useEffect(() => {
    async function getUser() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      setLoading(false);
      setUser(data.user?.user_metadata.full_name);
    }
    getUser();
  }, [supabase.auth]);
  const onCreate = async () => {
    try {
      const { data, error } = await createDocuments({ title: "Untitled" });
      if (error) {
        toast.error("Error starting document creation");
        return;
      }
      const { requestId } = data!;

      setCreationStatus("Processing...");
      console.log(creationStatus);

      const interval = setInterval(async () => {
        const status = await getDocumentStatus(requestId);
        if (status === "Completed") {
          setCreationStatus(null);
          toast.success("Document created successfully");
          clearInterval(interval);
        } else if (status === "Failed") {
          setCreationStatus(null);
          toast.error("Error creating document");
          clearInterval(interval);
        }
      }, 5000); 
    } catch (error) {
      toast.error("Error creating document");
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-4">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h2 className="text-lg font-medium">
            Welcome to {user?.split(" ")[0]}&apos;s documate
          </h2>
          <Button variant={"main"} onClick={onCreate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create a note
          </Button>
        </>
      )}
    </div>
  );
};

export default DocumentsPage;
