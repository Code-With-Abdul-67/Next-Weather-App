import { Hero } from "@/components/hero";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { city: rawCity } = await searchParams;

  const city =
    typeof rawCity === "string"
      ? rawCity
      : Array.isArray(rawCity)
      ? rawCity[0] ?? "Karachi"
      : "Karachi";

  return (
    <div className="bg-black min-h-screen">
      <Hero city={city} />
    </div>
  );
}
