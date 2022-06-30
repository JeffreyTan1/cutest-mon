import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  // TODO: Fetch 1 or 2 ahead of time to avoid latency
  // TODO: Add debounce to avoid too many requests

  const pokemonQuery = trpc.useQuery(["pokemon.getRandomPokemon"], {
    refetchOnWindowFocus: false,
  });
  const { data, isFetching } = pokemonQuery;
  const voteMutation = trpc.useMutation(["pokemon.cast-vote"]);

  const voteCutest = (selected_id: number) => {
    const firstPokemonId = data?.firstPokemon?.id;
    const secondPokemonId = data?.secondPokemon?.id;
    if (!firstPokemonId || !secondPokemonId) return;

    if (selected_id === firstPokemonId) {
      voteMutation.mutate({
        votedFor: firstPokemonId,
        votedAgainst: secondPokemonId,
      });
    } else {
      voteMutation.mutate({
        votedFor: secondPokemonId,
        votedAgainst: firstPokemonId,
      });
    }

    pokemonQuery.refetch();
  };

  if (isFetching || !data) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center text-center text-xl">
        {isFetching ? <div>Loading...</div> : <div>Error</div>}
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
      <div className="h-screen w-screen flex flex-col justify-center items-center relative">
        <div className="text-3xl font-medium">Which is cuter?</div>
        <div className="p-4" />
        <div className="min-w-[30%] mx-4 py-6 px-8 flex justify-center items-center bg-slate-300 rounded-lg shadow-lg">
          <PokemonListing pokemon={data.firstPokemon} vote={voteCutest} />
          <div className="w-1/3 text-center font-bold text-3xl text-black">
            VS
          </div>
          <PokemonListing pokemon={data.secondPokemon} vote={voteCutest} />
        </div>
        <div className="p-4" />

        <div className="absolute bottom-5 flex gap-x-10 underline">
          <a
            href="https://github.com/JeffreyTan1/cutest-mon"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          <Link href="/results">Results</Link>
        </div>
      </div>
    </>
  );
};

export default Home;

interface PokemonListingProps {
  spriteUrl: string | null;
  name: string;
  id: number;
}

const PokemonListing: React.FC<{
  pokemon: PokemonListingProps;
  vote: (selected: number) => void;
}> = (props) => {
  return (
    <div className="w-1/3 flex flex-col justify-center items-center text-center text-gray-900 font-medium capitalize">
      <h2 className="text-xl">{props.pokemon.name}</h2>
      <div className="p-2" />
      <Image
        src={props.pokemon.spriteUrl ? props.pokemon.spriteUrl : ""}
        width={200}
        height={200}
        alt={props.pokemon.name}
      />
      <div className="p-2" />
      <button
        className="bg-pink-500 hover:bg-pink-400 text-white text-sm font-bold py-1.5 px-2 rounded w-full"
        onClick={() => props.vote(props.pokemon.id)}
      >
        Cuter
      </button>
    </div>
  );
};
