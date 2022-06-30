import { createRouter } from "./context";
import { z } from "zod";
import { PokemonClient } from 'pokenode-ts';

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
      const api = new PokemonClient();
      const [firstPokemonRes, secondPokemonRes] = await Promise.all([
        api.getPokemonById(firstId),
        api.getPokemonById(secondId)
      ]);

      const firstPokemon = {
        name: firstPokemonRes.name,
        id: firstPokemonRes.id,
        sprite: firstPokemonRes.sprites.front_default
      }

      const secondPokemon = {
        name: secondPokemonRes.name,
        id: secondPokemonRes.id,
        sprite: secondPokemonRes.sprites.front_default
      }

      return {
        firstPokemon,
        secondPokemon
      }
    }
  }
  );