import { Hero } from "@/components/hero";

export default async function Home({ searchParams }) {
  // searchParams is expected to be a Promise resolving to an object
  const params = await searchParams;

  const rawCity = params.city;

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
