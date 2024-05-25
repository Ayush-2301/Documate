"use client";

import { useRouter } from "next/navigation";
import { restore, remove } from "@/lib/supabase/queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
  documentId: string;
}
export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  async function restoreDocument(documentId: string) {
    const data = await restore(documentId);
  }

  async function removeDocument(documentId: string) {
    const data = await remove(documentId);
  }

  const onRemove = () => {
    async function callFunctions() {
      try {
        await removeDocument(documentId);
        toast.success("Document deleted");
      } catch (error) {
        toast.error("Failed to delete document");
      }
    }
    callFunctions().then(() => router.push("/documents"));
    // if (router.asPath === `/documents/${documentId}`) {
    //   router.push("/documents");
    // }
  };
  const onRestore = () => {
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

  return (
    <div className=" w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center  gap-x-2 justify-center">
      <p>This document is in the trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete Forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
