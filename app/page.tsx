import { Hero } from "@/components/hero";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Home = async ({ searchParams }: Props) => {
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
