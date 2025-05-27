import { NextPage } from "next";
import { Navbar } from "../components/navbar";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page: NextPage<PageProps> = async ({ searchParams }) => {
  const city = searchParams.city || "default-city";

  return (
    <div>
      <Navbar />
      <main>
        <h1>Weather for {city}</h1>
        {/* Rest of your page content */}
      </main>
    </div>
  );
};

export default Page;
