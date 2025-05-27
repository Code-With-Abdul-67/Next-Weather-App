// import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";
// import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";


import { Hero } from "@/components/hero";

export default function Home() {
  return (
        <main className="flex flex-col items-center justify-start min-h-screen pt-16">
      <Hero />
    </main>
  );
}
