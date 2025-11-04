"use client";

import { useEffect } from "react";
import { useSynergiesStore } from "@/stores/synergies-store";

export function SynergiesStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useSynergiesStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
