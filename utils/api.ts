import { CardType } from "../types/Card";

function mapRarity(rarity?: string): CardType["rarity"] {
	if (!rarity) return "common";

	if (rarity.toLowerCase().includes("ultra")) return "ultra";
	if (rarity.toLowerCase().includes("rare")) return "rare";

	return "common";
}

export async function fetchCards(): Promise<CardType[]> {
	const res = await fetch("https://api.pokemontcg.io/v2/cards?pageSize=50");
	const json = await res.json();

	return json.data.map((card: any) => ({
		id: card.id,
		name: card.name,
		image: card.images.small,
		rarity: mapRarity(card.rarity),
	}));
}
