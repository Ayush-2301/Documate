"use client";

import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

// import "./styles.css";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useRoom, useSelf } from "./../../liveblocks.config";
import { useEffect, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
// import styles from "./CollaborativeEditor.module.css";
// import { MoonIcon, SunIcon } from "@/icons";
import { useTheme } from "next-themes";

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor() {
  const room = useRoom();

  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  // Set up Liveblocks Yjs provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return <BlockNote doc={doc} provider={provider} />;
}

type EditorProps = {
  doc: Y.Doc;
  provider: any;
};

function BlockNote({ doc, provider }: EditorProps) {
  const { edgestore } = useEdgeStore();
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);
  let { theme } = useTheme();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,

      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),

      // Information for this user:
      user: {
        name: userInfo.name,
        color: userInfo.color,
      },
    },
    uploadFile: handleUpload,
  });

  return (
    <div className="h-full  mx-auto md:max-w-3xl lg:max-w-4xl ">
      <div className=" md:ml-[-54px] md:pl-10 pl-0 ml-0">
        <BlockNoteView editor={editor} className="" theme={theme as Theme} />
      </div>
    </div>
  );
}
