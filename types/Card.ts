export type CardRarity = "common" | "rare" | "ultra";

export type CardType = {
  id: string;
  name: string;
  image: string;
  rarity: CardRarity;
};

export type PackType = {
  id: string;
  name: string;
  price: number;
  image: string;
  theme: "classic" | "rare" | "legendary";
};