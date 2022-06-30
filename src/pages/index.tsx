import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";

const Home: NextPage = () => {
  const pokemonQuery = trpc.useQuery(["pokemon.getRandomPokemon"]);
  const { data, isLoading } = pokemonQuery;

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

  if (isLoading || !data) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="text-center">Error</div>
        )}
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
        <div className="min-w-[30%] mx-4 py-6 px-8 flex justify-center items-center bg-slate-300 rounded-lg shadow-lg">
          <PokemonListing pokemon={data.firstPokemon} vote={voteCutest} />
          <div className="w-1/3 text-center font-bold text-3xl text-black">
            VS
          </div>
          <PokemonListing pokemon={data.secondPokemon} vote={voteCutest} />
        </div>
        <div className="p-4" />
      </div>
    </>
  );
};

export default Home;

interface PokemonListingProps {
  sprite: string | null;
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
      <img src={props.pokemon.sprite} width="200" />
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
