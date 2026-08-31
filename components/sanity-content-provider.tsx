"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type SanitySiteSettings = {
  title?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
} | null;

export type SanitySiteContent = {
  siteSettings: SanitySiteSettings;
};

type SanityContentContextValue = {
  content: SanitySiteContent;
  setContent: Dispatch<SetStateAction<SanitySiteContent>>;
};

const SanityContentContext = createContext<SanityContentContextValue | null>(
  null,
);

export function SanityContentProvider({
  initialContent,
  children,
}: {
  initialContent: SanitySiteContent;
  children: ReactNode;
}) {
  const [content, setContent] = useState(initialContent);

  return (
    <SanityContentContext.Provider value={{ content, setContent }}>
      {children}
    </SanityContentContext.Provider>
  );
}

export function useSanityContent() {
  const context = useContext(SanityContentContext);

  if (!context) {
    throw new Error(
      "useSanityContent must be used within a SanityContentProvider.",
    );
  }

  return context;
}