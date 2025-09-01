import type { PokemonData } from "src/types/pokemon";
import {type Pokemon, type Pokemons } from "src/types/pokemons";

const getPokemons = async (limit: number, offset: number) : Promise<Pokemons> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data : Pokemons = await res.json();
  return data;
};

const getPokemon = async (pokemonName : String) : Promise<PokemonData> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const data : PokemonData= await res.json();
  return data;
}
export { getPokemons,getPokemon };
