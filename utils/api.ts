import { CardType } from "../types/Card";

const API_URL = "https://api.pokemontcg.io/v2/cards";

type PokemonApiCard = {
  id: string;
  name: string;
  rarity?: string;
  images: {
    small: string;
    large: string;
  };
};

function mapRarity(rarity?: string): CardType["rarity"] {
  if (!rarity) return "common";

  const value = rarity.toLowerCase();

  if (value.includes("hyper rare")) return "hyperRare";
  if (value.includes("special illustration rare")) return "specialIllustrationRare";
  if (value.includes("illustration rare")) return "illustrationRare";
  if (value.includes("ultra rare")) return "ultraRare";
  if (value.includes("rare")) return "rare";
  if (value.includes("uncommon")) return "uncommon";

  return "common";
}

export async function fetchCardsBySet(setId: string): Promise<CardType[]> {
  const query = encodeURIComponent(`set.id:${setId}`);

  const response = await fetch(`${API_URL}?q=${query}&pageSize=250`);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon TCG cards");
  }

  const json = await response.json();

  return json.data.map((card: PokemonApiCard) => ({
    id: card.id,
    name: card.name,
    image: card.images.large || card.images.small,
    rarity: mapRarity(card.rarity),
  }));
}