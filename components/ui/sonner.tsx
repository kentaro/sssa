"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3200,
        className: "border border-border/70 bg-background text-foreground",
      }}
    />
  );
}

