export type Documents = {
  title: string;
  id: string;
  content: string | null;
  icon: string | null;
  parentDocument: string | null;
  userId: string;
  isArchived: boolean;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: string | null;
};
