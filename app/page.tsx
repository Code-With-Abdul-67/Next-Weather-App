import { Hero } from "@/components/hero";

export default async function Home({
  searchParams,
}: {
  searchParams: { city?: string };
}) {
  const city = searchParams?.city || "Karachi";

  return (
    <div className="bg-black min-h-screen">
      <Hero city={city} />
    </div>
  );
}