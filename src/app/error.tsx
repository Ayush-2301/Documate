"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const errorPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center  space-y-4">
      <h2>Something went wrong</h2>
      <Button asChild>
        <Link href={"/documents"}>Go back</Link>
      </Button>
    </div>
  );
};
export default errorPage;
