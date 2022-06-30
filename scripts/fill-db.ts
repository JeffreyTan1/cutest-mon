import { PokemonClient } from "pokenode-ts";
import { prisma } from "../src/server/db/client";
import data from './data.json';

const MAX_DEX_ID = 898;

const doBackfill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, MAX_DEX_ID);
  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: p.name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
  }));

  const creation = await prisma.pokemon.createMany({data: formattedPokemon});
  console.log('creation?', creation);
} 

doBackfill();