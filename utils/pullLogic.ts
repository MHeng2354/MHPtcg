import { CardType } from "../types/Card";

export function getRandomCard(cards: CardType[]): CardType {
	const rand = Math.random();

	let rarity: CardType["rarity"];
	if (rand < 0.6) rarity = "common";
	else if (rand < 0.85) rarity = "rare";
	else rarity = "ultra";

	const pool = cards.filter((c) => c.rarity === rarity);
	return pool[Math.floor(Math.random() * pool.length)];
}

export function openPack(cards: CardType[]): CardType[] {
	let results: CardType[] = [];

	for (let i = 0; i < 4; i++) {
		results.push(getRandomCard(cards));
	}

	const rarePool = cards.filter((c) => c.rarity !== "common");
	results.push(rarePool[Math.floor(Math.random() * rarePool.length)]);

	return results;
}
