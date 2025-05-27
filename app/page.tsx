import { NextPage } from "next";
import { Hero } from "@/components/hero";

// Use Next.js's built-in PageProps type directly if needed
const Home: NextPage<{
  searchParams: { [key: string]: string | string[] | undefined };
}> = async ({ searchParams }) => {
  const city =
    typeof searchParams?.city === "string"
      ? searchParams.city
      : Array.isArray(searchParams?.city)
      ? searchParams.city[0] || "Karachi"
      : "Karachi";

  return (
    <div className="bg-black min-h-screen">
      <Hero city={city} />
    </div>
  );
};

export default Home;