import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "example.hello",
    { text: "from tRPC" },
  ]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-3xl font-medium">Which is cuter?</div>
        <div className="p-4" />
        <div className="min-w-[40%] mx-4 p-8 flex justify-center items-center bg-slate-200 rounded-lg shadow-lg">
          <div className="w-1/3 text-center font-bold text-3xl text-black">
            {data?.greeting}
          </div>
          <div className="w-1/3 text-center font-bold text-3xl text-black">
            VS
          </div>
          <div className="w-1/3 text-center font-bold text-3xl text-black">
            Hello
          </div>
        </div>
        <div className="p-4" />
      </div>
    </>
  );
};

export default Home;
