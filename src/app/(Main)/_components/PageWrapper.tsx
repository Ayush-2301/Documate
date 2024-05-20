"use client";
import { SearchCommand } from "@/components/search-command";
import React from "react";
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SearchCommand />
      {children}
    </>
  );
};

export default PageWrapper;
