"use client";

import { useState, createContext } from "react";

interface IntputContextValue {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const defualtValue: IntputContextValue = {
  title: "Untitled",
  setTitle: () => {},
};

export const InputContext = createContext<IntputContextValue>(defualtValue);

export default function InputProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState("Untitled");
  return (
    <InputContext.Provider value={{ title, setTitle }}>
      {children}
    </InputContext.Provider>
  );
}
