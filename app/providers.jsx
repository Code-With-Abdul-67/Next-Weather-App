"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LoadingProvider } from "@/context/loading-context";
import { NotificationProvider } from "@/context/notification-context";

export function Providers({ children, themeProps }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <NotificationProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </NotificationProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
