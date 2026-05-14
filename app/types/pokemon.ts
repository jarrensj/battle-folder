export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

export type StatSpread = {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
};

export type PokemonSpecies = {
  dex: number;
  name: string;
  types: [PokemonType] | [PokemonType, PokemonType];
  baseStats: StatSpread;
  weight: number;
  abilities: string[];
  spriteUrl: string;
};
