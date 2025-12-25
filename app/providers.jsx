"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

import { LoadingProvider } from "@/context/loading-context";
import { NotificationProvider } from "@/context/notification-context";

export function Providers({ children, themeProps }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NotificationProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </NotificationProvider>
    </HeroUIProvider>
  );
}
