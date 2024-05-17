"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";

// import { }
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { Document } from "@/lib/supabase/supabase.types";
import { getSearch } from "@/lib/supabase/queries";
import { User } from "@supabase/supabase-js";

export const SearchCommand = () => {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [documents, setDocuments] = useState<Document[] | null>();
  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);
  const [isMounted, setIsMounted] = useState(false);

  async function getSearchDocument() {
    const data = await getSearch();
    if (data.data) setDocuments(data.data);
  }
  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    setUser(data.user);
  }
  useEffect(() => {
    getUser();
    getSearchDocument();
  }, []);
  useEffect(() => {
    setIsMounted(true);
  }, []);
};
