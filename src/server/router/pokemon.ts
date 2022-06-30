import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "@/server/utils/prisma";

const MAX_DEX_ID = 898;

const getRandomPokemon = (notThisOne?:number): number => {
  const pokedex_number = Math.floor(Math.random() * MAX_DEX_ID) + 1;
  if (pokedex_number !== notThisOne) {
    return pokedex_number
  }
  return getRandomPokemon(notThisOne);
}

const getOptionsForVote = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);
  return {firstId, secondId};
}

export const pokemonRouter = createRouter()
  .query("getRandomPokemon",{
    async resolve() {
      const {firstId, secondId} = getOptionsForVote();

      const db_result = await prisma.pokemon.findMany({where: {id: {in: [firstId, secondId]}}});
      if (!db_result) throw new Error(`No pokemon(s) found with id ${firstId} or ${secondId}`);

      const [firstPokemonRes, secondPokemonRes] = db_result;
      if(!firstPokemonRes || !secondPokemonRes) throw new Error(`No pokemon(s) found with id ${firstId} or ${secondId}`);

      const firstPokemon = {
        name: firstPokemonRes.name,
        id: firstPokemonRes.id,
        spriteUrl: firstPokemonRes.spriteUrl
      }

      const secondPokemon = {
        name: secondPokemonRes.name,
        id: secondPokemonRes.id,
        spriteUrl: secondPokemonRes.spriteUrl
      }

      return {
        firstPokemon,
        secondPokemon
      }
    }
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({input}) {
      const voteInDb = await prisma.vote.create({
        data: {
          ...input
        }
      })
      return {success: true, vote: voteInDb};
    }
  })
  
  ;