"use server";
import { documents } from "../../../migrations/schema";
import db from "./db";
import { Document } from "./supabase.types";
import { supabaseServer } from "./server";
import { eq, and, or, desc, asc, isNull } from "drizzle-orm";

export const createDocuments = async ({
  title,
  parentDocument,
}: {
  title: string;
  parentDocument?: string;
}) => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");
    setTimeout(()=>{
      console.log("Delay");
    },62000)
    const response = await db
      .insert(documents)
      .values({
        title: title,
        parentDocument: parentDocument,
        userId: data.user.id,
        isArchived: false,
        isPublished: false,
      })
      .returning({ insertedId: documents.id });

    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: error };
  }
};

export const getSearch = async (): Promise<{
  data: Document[] | null;
  error: null | string;
}> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");
    const response = await db
      .select()
      .from(documents)
      .where(
        and(eq(documents.userId, data.user.id), eq(documents.isArchived, false))
      )
      .orderBy(asc(documents.createdAt));
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const getSidebar = async ({
  parentDocument,
}: {
  parentDocument?: string;
}): Promise<{
  data: Document[] | null;
  error: null | string;
}> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");
    let response;
    if (parentDocument)
      response = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.userId, data.user.id),
            eq(documents.parentDocument, parentDocument),
            eq(documents.isArchived, false)
          )
        )
        .orderBy(asc(documents.createdAt));
    else {
      response = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.userId, data.user.id),
            isNull(documents.parentDocument),
            eq(documents.isArchived, false)
          )
        )
        .orderBy(asc(documents.createdAt));
    }
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const archive = async (
  id: string
): Promise<{
  data: Document | null;
  error: null | string;
}> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");

    const existingDocument = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    if (!existingDocument) {
      throw new Error("Not Found");
    }
    if (existingDocument[0].userId !== data.user.id) {
      throw new Error("Unauthorized");
    }
    const recursiveArchive = async (documentId: string) => {
      const children = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.userId, data.user.id),
            eq(documents.parentDocument, documentId)
          )
        );

      for (const child of children) {
        await db
          .update(documents)
          .set({ isArchived: true })
          .where(eq(documents.id, child.id));
        await recursiveArchive(child.id);
      }
    };
    const document = await db
      .update(documents)
      .set({ isArchived: true })
      .where(eq(documents.id, id))
      .returning();
    await recursiveArchive(id);
    return { data: document[0], error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const getTrash = async (): Promise<{
  data: Document[] | null;
  error: string | null;
}> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");

    const archiveDocuments = await db
      .select()
      .from(documents)
      .where(
        and(eq(documents.userId, data.user.id), eq(documents.isArchived, true))
      )
      .orderBy(asc(documents.createdAt));
    return { data: archiveDocuments, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const restore = async (
  id: string
): Promise<{ data: Document[] | null; error: string | null }> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");

    const existingDocument = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    if (!existingDocument[0]) throw new Error("Not Found");

    if (existingDocument[0].userId !== data.user.id)
      throw new Error("Unauthorized");
    const recursiveRestore = async (documentId: string) => {
      const children = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.userId, data.user.id),
            eq(documents.parentDocument, documentId)
          )
        );

      for (const child of children) {
        await db
          .update(documents)
          .set({ isArchived: false })
          .where(eq(documents.id, child.id));
        await recursiveRestore(child.id);
      }
    };

    const options: Partial<Document> = {
      isArchived: false,
    };
    if (existingDocument[0].parentDocument) {
      const parent = await db
        .select()
        .from(documents)
        .where(
          eq(documents.parentDocument, existingDocument[0].parentDocument)
        );
      if (parent[0].isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await db
      .update(documents)
      .set(options)
      .where(eq(documents.id, id));
    await recursiveRestore(id);
    return { data: document, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const remove = async (
  id: string
): Promise<{ data: Document | null; error: string | null }> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");
    const existingDocument = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    if (!existingDocument) throw new Error("Not Found");

    if (existingDocument[0].userId !== data.user.id)
      throw new Error("Unauthorized");

    const document = await db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();
    return { data: document[0], error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const getById = async (
  id: string
): Promise<{ data: Document | null; error: string | null }> => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));

    if (!document[0]) throw new Error(`Not found`);

    if (document[0].isPublished && !document[0].isArchived)
      return { data: document[0], error: null };
    if (!data.user) throw new Error(`Not Authenticated`);

    if (document[0].userId !== data.user.id) throw new Error("Unauthorized");
    return { data: document[0], error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const update = async ({
  id,
  title,
  content,
  coverImage,
  icon,
  isPublished,
}: {
  id: string;
  title?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished?: boolean;
}): Promise<{ data: Document | null; error: string | null }> => {
  try {
    const supabase = supabaseServer();
    const updatedData = { id, title, content, coverImage, icon, isPublished };
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");
    const existingDocument = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    if (!existingDocument[0]) throw new Error("Not found");

    if (existingDocument[0].userId !== data.user.id)
      throw new Error("Unauthorized");

    const document = await db
      .update(documents)
      .set(updatedData)
      .where(eq(documents.id, id))
      .returning();
    return { data: document[0], error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const removeIcon = async ({ id }: { id: string }) => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");

    const existingDocument = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    if (!existingDocument[0]) throw new Error("Not Found");

    if (existingDocument[0].userId !== data.user.id)
      throw new Error("Unauthorized");

    const document = await db
      .update(documents)
      .set({ icon: null })
      .where(eq(documents.id, id))
      .returning();
    return { data: document, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};

export const removeCover = async ({ id }: { id: string }) => {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not Authenticated");

    const existingDocument = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    if (!existingDocument[0]) throw new Error("Not Found");

    if (existingDocument[0].userId !== data.user.id)
      throw new Error("Unauthorized");

    const document = await db
      .update(documents)
      .set({ coverImage: null })
      .where(eq(documents.id, id))
      .returning();
    return { data: document, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Something went wrong" };
  }
};
