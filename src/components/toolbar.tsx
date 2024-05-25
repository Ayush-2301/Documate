"use client";

import { Document } from "@/lib/supabase/supabase.types";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState, useEffect } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import { supabaseBrowser } from "@/lib/supabase/browser";
import debouncedUpdate from "@/lib/debounceUpdateTitle";
import { removeIcon, update } from "@/lib/supabase/queries";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolabarProps {
  initalData: Document;
  preview?: boolean;
}
export const Toolbar = ({ initalData, preview }: ToolabarProps) => {
  const supabase = supabaseBrowser();

  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initalData.title);
  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initalData.title);
      inputRef.current?.focus();
    }, 0);
  };
  const disableInput = () => {
    setIsEditing(false);
    initalData.title = value;
  };
  const onInput = (value: string) => {
    setValue(value);
    debouncedUpdate({ id: initalData.id, title: value });
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    async function updateIcon(icon: string) {
      const res = await update({ id: initalData.id, icon: icon });
    }
    updateIcon(icon);
  };

  const onRemoveIcon = () => {
    async function remove() {
      const res = await removeIcon({ id: initalData.id });
      console.log(res);
    }
    remove();
  };

  useEffect(() => {
    if (!isEditing) {
      const channel = supabase
        .channel("realtime-documents")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "documents",
          },
          (payload) => {
            console.log("page", payload);
            setValue(payload.new.title);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, isEditing]);
  return (
    <div className="md:pl-0 pl-[54px] group relative">
      {!!initalData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initalData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!!initalData.icon && preview && (
        <p className="text-6xl pt-6"> {initalData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4 ">
        {!initalData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="w-4 h-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initalData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Add cover image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextAreaAutoSize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initalData.title}
        </div>
      )}
    </div>
  );
};
