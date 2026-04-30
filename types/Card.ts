import { ImageSourcePropType } from "react-native";

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ultraRare"
  | "illustrationRare"
  | "specialIllustrationRare"
  | "hyperRare";

export type CardType = {
  id: string;
  name: string;
  image: string;
  rarity: CardRarity;
};

export type PackType = {
  id: string;
  name: string;
  setId: string;
  price: number;
  image: ImageSourcePropType;
};