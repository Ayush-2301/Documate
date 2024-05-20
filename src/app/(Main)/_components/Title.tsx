"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/lib/supabase/supabase.types";
import { useState, useRef, useEffect } from "react";
import { update } from "@/lib/supabase/queries";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface TitleProps {
  initialData: Document;
}
export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const enabelInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    update({ id: initialData.id, title: title });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") disableInput();
  };
  //   useEffect(() => {
  //     const channel = supabase
  //       .channel("realtime-documents")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "UPDATE",
  //           schema: "public",
  //           table: "documents",
  //         },
  //         (payload) => {
  //           console.log(payload);
  //         }
  //       )
  //       .subscribe();

  //     return () => {
  //       supabase.removeChannel(channel);
  //     };
  //   }, [supabase]);
  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enabelInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          onBlur={disableInput}
          className="h-7 px-2 focus-visible:ring-transparent bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-none "
        />
      ) : (
        <Button
          onClick={enabelInput}
          variant="ghost"
          className="font-normal h-auto p-1 "
          size="sm"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};
