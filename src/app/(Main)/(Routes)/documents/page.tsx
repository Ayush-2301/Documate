"use client";
import { Button } from "@/components/ui/button";
import { createDocuments } from "@/lib/supabase/queries";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";

const DocumentsPage = () => {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState<string | undefined>();
  const [isLoading, setLoading] = useState<boolean>(true);
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
      await createDocuments({ title: "Untitled" });
      toast.success("Document created successfully");
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
          {" "}
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
