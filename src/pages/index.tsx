import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["pokemon.getRandomPokemon"]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cutest Mon</title>
        <meta name="description" content="Vote for the cutest Pokemon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-3xl font-medium">Which is cuter?</div>
        <div className="p-4" />
        <div className="min-w-[30%] mx-4 p-8 flex justify-center items-center bg-slate-300 rounded-lg shadow-lg">
          <div className="w-1/3 flex flex-col justify-center items-center text-center text-gray-900 font-medium capitalize">
            <img src={data?.firstPokemon.sprites.front_default} width="150" />
            <div className="p-2" />
            <h2>{data?.firstPokemon.name}</h2>
          </div>
          <div className="w-1/6 text-center font-bold text-3xl text-black">
            VS
          </div>
          <div className="w-1/3 flex flex-col justify-center items-center text-center text-gray-900 font-medium capitalize">
            <img src={data?.secondPokemon.sprites.front_default} width="150" />
            <div className="p-2" />
            <h2>{data?.secondPokemon.name}</h2>
          </div>
        </div>
        <div className="p-4" />
      </div>
    </>
  );
};

export default Home;
