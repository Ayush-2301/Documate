// utils/debouncedUpdate.ts
import { debounce } from "lodash";
import { update } from "@/lib/supabase/queries";

const debouncedUpdate = debounce(
  async ({ id, title }) => {
    const { data, error } = await update({ id: id, title: title });
    if (error) {
      console.error("Error updating document:", error);
    }
  },
  200, // Debounce delay in milliseconds
  { leading: true, trailing: true }
);

export default debouncedUpdate;
