import * as z from "zod";


export const PokemonSchema = z.object({
    "name": z.string(),
    "url": z.string(),
});
export type Pokemon = z.infer<typeof PokemonSchema>;

export const PokemonsSchema = z.object({
    "count": z.number(),
    "next": z.string(),
    "previous": z.null(),
    "results": z.array(PokemonSchema),
});
export type Pokemons = z.infer<typeof PokemonsSchema>;
