import { GetStaticProps, NextPage } from "next";
import { prisma } from "@/server/db/client";
import Image from "next/image";
import Link from "next/link";

interface PokemonListingProps {
  _count: {
    VoteFor: number;
    VoteAgainst: number;
  };
  id: number;
  name: string;
  spriteUrl: string;
}
const Results: NextPage<{ pokemons: PokemonListingProps[] }> = (props) => {
  return (
    <div className="flex flex-col min-h-full w-full items-center relative">
      <div className="p-8" />
      <h2 className="text-3xl">Results</h2>
      <div className="p-8" />
      <h3 className="text-xs">Results update every 60 seconds</h3>
      <div className="p-2" />
      {props.pokemons.map((p) => (
        <PokemonListing pokemon={p} key={p.id} />
      ))}

      <div className="absolute top-5 flex gap-x-10 underline">
        <Link href="/">Home</Link>
      </div>
    </div>
  );
};

const getVotePercentage = (voteFor: number, VoteAgainst: number): string => {
  if (voteFor === 0 && VoteAgainst === 0) {
    const no_value = 0;
    return `${no_value.toFixed(2)}%`;
  }
  const total = voteFor + VoteAgainst;
  const percentage = (voteFor / total) * 100;
  return `${percentage.toFixed(2)}%`;
};

const PokemonListing: React.FC<{
  pokemon: PokemonListingProps;
}> = ({ pokemon }) => {
  return (
    <div className="capitalize border-b max-w-2xl w-full mx-4 flex items-center justify-center border px-4 py-2 flex-wrap gap-x-10">
      <Image
        src={pokemon.spriteUrl ? pokemon.spriteUrl : ""}
        width={100}
        height={100}
        alt={pokemon.name}
      />
      <h2>{pokemon.name}</h2>

      <p className="text-sm">Votes For: {pokemon._count.VoteFor}</p>
      <p className="text-sm">Votes Against: {pokemon._count.VoteAgainst}</p>
      <p className="text-sm">
        {getVotePercentage(pokemon._count.VoteFor, pokemon._count.VoteAgainst)}
      </p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
  return {
    props: { pokemons: pokemonOrdered },
    revalidate: 60,
  };
};

export default Results;
