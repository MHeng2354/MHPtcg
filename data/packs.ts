import { PackType } from "../types/Card";

export const packs: PackType[] = [
  {
    id: "classic",
    name: "Classic Pack",
    price: 10,
    image: "https://images.pokemontcg.io/base1/4.png",
    theme: "classic",
  },
  {
    id: "rare",
    name: "Rare Pack",
    price: 15,
    image: "https://images.pokemontcg.io/base1/2.png",
    theme: "rare",
  },
  {
    id: "legendary",
    name: "Legendary Pack",
    price: 25,
    image: "https://images.pokemontcg.io/base1/15.png",
    theme: "legendary",
  },
];