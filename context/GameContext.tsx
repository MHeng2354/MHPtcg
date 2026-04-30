import { createContext, ReactNode, useEffect, useState } from "react";
import { CardType } from "../types/Card";
import { loadCollection, saveCollection } from "../utils/storage";

type GameContextType = {
  coins: number;
  unlimitedCoins: boolean;
  spendCoins: (amount: number) => boolean;
  collection: CardType[];
  addCards: (cards: CardType[]) => void;
};

export const GameContext = createContext({} as GameContextType);

export function GameProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(999999);
  const [collection, setCollection] = useState<CardType[]>([]);
  const unlimitedCoins = true;

  useEffect(() => {
    loadCollection().then(setCollection);
  }, []);

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  const spendCoins = (amount: number) => {
    if (unlimitedCoins) return true;
    if (coins < amount) return false;
    setCoins((prev) => prev - amount);
    return true;
  };

  const addCards = (cards: CardType[]) => {
    setCollection((prev) => [...prev, ...cards]);
  };

  return (
    <GameContext.Provider
      value={{ coins, unlimitedCoins, spendCoins, collection, addCards }}
    >
      {children}
    </GameContext.Provider>
  );
}