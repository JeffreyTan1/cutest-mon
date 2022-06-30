import { GetStaticProps, NextPage } from "next";
import { prisma } from "@/server/db/client";
import Image from "next/image";

interface PokemonListingProps {
  count: {
    VoteFor: number;
    VoteAgainst: number;
  };
  id: number;
  name: string;
  spriteUrl: string;
}
const Results: NextPage<{ pokemons: PokemonListingProps[] }> = (props) => {
  return (
    <div className="flex flex-col min-h-full w-full items-center">
      <div className="p-8" />
      <h2 className="text-3xl">Results</h2>
      <div className="p-8" />
      {props.pokemons.map((p) => (
        <PokemonListing pokemon={p} key={p.id} />
      ))}
    </div>
  );
};

const PokemonListing: React.FC<{
  pokemon: PokemonListingProps;
}> = (props) => {
  return (
    <div className="capitalize border-b max-w-2xl w-full mx-4 flex items-center border p-2">
      <Image
        src={props.pokemon.spriteUrl ? props.pokemon.spriteUrl : ""}
        width={50}
        height={50}
        alt={props.pokemon.name}
      />
      <h2>{props.pokemon.name}</h2>
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
    revalidate: 600,
  };
};

export default Results;
