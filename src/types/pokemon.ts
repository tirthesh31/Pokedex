import * as z from "zod";


export const SpeciesSchema = z.object({
    "name": z.string(),
    "url": z.string(),
});
export type Species = z.infer<typeof SpeciesSchema>;

export const CriesSchema = z.object({
    "latest": z.string(),
    "legacy": z.string(),
});
export type Cries = z.infer<typeof CriesSchema>;

export const GameIndexSchema = z.object({
    "game_index": z.number(),
    "version": SpeciesSchema,
});
export type GameIndex = z.infer<typeof GameIndexSchema>;

export const VersionGroupDetailSchema = z.object({
    "level_learned_at": z.number(),
    "move_learn_method": SpeciesSchema,
    "order": z.union([z.number(), z.null()]),
    "version_group": SpeciesSchema,
});
export type VersionGroupDetail = z.infer<typeof VersionGroupDetailSchema>;

export const RedBlueSchema = z.object({
    "back_default": z.string(),
    "back_gray": z.string(),
    "back_transparent": z.string(),
    "front_default": z.string(),
    "front_gray": z.string(),
    "front_transparent": z.string(),
});
export type RedBlue = z.infer<typeof RedBlueSchema>;

export const CrystalSchema = z.object({
    "back_default": z.string(),
    "back_shiny": z.string(),
    "back_shiny_transparent": z.string(),
    "back_transparent": z.string(),
    "front_default": z.string(),
    "front_shiny": z.string(),
    "front_shiny_transparent": z.string(),
    "front_transparent": z.string(),
});
export type Crystal = z.infer<typeof CrystalSchema>;

export const GoldSchema = z.object({
    "back_default": z.string(),
    "back_shiny": z.string(),
    "front_default": z.string(),
    "front_shiny": z.string(),
    "front_transparent": z.string().optional(),
});
export type Gold = z.infer<typeof GoldSchema>;

export const OfficialArtworkSchema = z.object({
    "front_default": z.string(),
    "front_shiny": z.string(),
});
export type OfficialArtwork = z.infer<typeof OfficialArtworkSchema>;

export const HomeSchema = z.object({
    "front_default": z.string(),
    "front_female": z.null(),
    "front_shiny": z.string(),
    "front_shiny_female": z.null(),
});
export type Home = z.infer<typeof HomeSchema>;

export const DreamWorldSchema = z.object({
    "front_default": z.string(),
    "front_female": z.null(),
});
export type DreamWorld = z.infer<typeof DreamWorldSchema>;

export const GenerationViiiSchema = z.object({
    "icons": DreamWorldSchema,
});
export type GenerationViii = z.infer<typeof GenerationViiiSchema>;

export const StatSchema = z.object({
    "base_stat": z.number(),
    "effort": z.number(),
    "stat": SpeciesSchema,
});
export type Stat = z.infer<typeof StatSchema>;

export const TypeSchema = z.object({
    "slot": z.number(),
    "type": SpeciesSchema,
});
export type Type = z.infer<typeof TypeSchema>;

export const AbilitySchema = z.object({
    "ability": z.union([SpeciesSchema, z.null()]),
    "is_hidden": z.boolean(),
    "slot": z.number(),
});
export type Ability = z.infer<typeof AbilitySchema>;

export const MoveSchema = z.object({
    "move": SpeciesSchema,
    "version_group_details": z.array(VersionGroupDetailSchema),
});
export type Move = z.infer<typeof MoveSchema>;

export const PastAbilitySchema = z.object({
    "abilities": z.array(AbilitySchema),
    "generation": SpeciesSchema,
});
export type PastAbility = z.infer<typeof PastAbilitySchema>;

export const GenerationISchema = z.object({
    "red-blue": RedBlueSchema,
    "yellow": RedBlueSchema,
});
export type GenerationI = z.infer<typeof GenerationISchema>;

export const GenerationIiSchema = z.object({
    "crystal": CrystalSchema,
    "gold": GoldSchema,
    "silver": GoldSchema,
});
export type GenerationIi = z.infer<typeof GenerationIiSchema>;

export const GenerationIiiSchema = z.object({
    "emerald": OfficialArtworkSchema,
    "firered-leafgreen": GoldSchema,
    "ruby-sapphire": GoldSchema,
});
export type GenerationIii = z.infer<typeof GenerationIiiSchema>;

export const GenerationViiSchema = z.object({
    "icons": DreamWorldSchema,
    "ultra-sun-ultra-moon": HomeSchema,
});
export type GenerationVii = z.infer<typeof GenerationViiSchema>;

export type PokemonData = {
  species: Species;
  cries?: Cries;
  game_indices?: GameIndex[];
  version_group_details?: VersionGroupDetail[];
  red_blue?: RedBlue;
  crystal?: Crystal;
  gold?: Gold;
  official_artwork?: OfficialArtwork;
  home?: Home;
  dream_world?: DreamWorld;
  generation_viii?: GenerationViii;
  stats?: Stat[];
  types?: Type[];
  abilities?: Ability[];
  moves?: Move[];
  past_abilities?: PastAbility[];
  generation_i?: GenerationI;
  generation_ii?: GenerationIi;
  generation_iii?: GenerationIii;
  generation_vii?: GenerationVii;
};