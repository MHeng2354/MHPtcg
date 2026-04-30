import { CardType, PackType } from "../types/Card";

function randomFromPool(pool: CardType[], fallback: CardType[]) {
  const source = pool.length > 0 ? pool : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

function getRandomCard(cards: CardType[], pack: PackType): CardType {
  const rand = Math.random();

  let rarity: CardType["rarity"];

  if (pack.theme === "legendary") {
    if (rand < 0.25) rarity = "common";
    else if (rand < 0.65) rarity = "rare";
    else rarity = "ultra";
  } else if (pack.theme === "rare") {
    if (rand < 0.45) rarity = "common";
    else if (rand < 0.8) rarity = "rare";
    else rarity = "ultra";
  } else {
    if (rand < 0.6) rarity = "common";
    else if (rand < 0.85) rarity = "rare";
    else rarity = "ultra";
  }

  const pool = cards.filter((card) => card.rarity === rarity);
  return randomFromPool(pool, cards);
}

export function openPack(cards: CardType[], pack: PackType): CardType[] {
  const results: CardType[] = [];

  for (let i = 0; i < 4; i++) {
    results.push(getRandomCard(cards, pack));
  }

  const rarePool = cards.filter((card) => card.rarity !== "common");
  results.push(randomFromPool(rarePool, cards));

  return results;
}