import "@/styles/globals.css";
import clsx from "clsx";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import { NotificationToast } from "@/components/NotificationToast";

import { cookies } from "next/headers";


import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Disables zoom for native app feel
};

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: "/manifest.webmanifest", // Next.js auto-generates this route from manifest.js
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg", // Fallback for Apple touch icon
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NextWeather",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const city = cookieStore.get("city")?.value || "Karachi";

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          <ServiceWorkerRegistration />
          <div className="relative flex flex-col min-h-screen">
            <LoadingOverlay initialCity={city} />
            <NotificationToast />
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}