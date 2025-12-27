
import { Hero } from "@/components/hero";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const cityCookie = cookieStore.get("city")?.value;
  let city = "Karachi";
  
  if (cityCookie) {
    try {
      // Try parsing as JSON (for lat/lon objects) or fallback to string
      city = cityCookie.startsWith("{") ? JSON.parse(cityCookie) : cityCookie;
    } catch {
      city = cityCookie;
    }
  }

  const units = cookieStore.get("units")?.value || "metric";

  return (
    <div>
      <Hero city={city} units={units} />
    </div>
  );
}
