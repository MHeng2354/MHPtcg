import { createContext, ReactNode, useEffect, useState } from "react";
import { CardType } from "../types/Card";
import { loadCollection, saveCollection } from "../utils/storage";

type GameContextType = {
  coins: number;
  setCoins: (coins: number) => void;
  collection: CardType[];
  addCards: (cards: CardType[]) => void;
};

export const GameContext = createContext({} as GameContextType);

export function GameProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(100);
  const [collection, setCollection] = useState<CardType[]>([]);

  useEffect(() => {
    loadCollection().then(setCollection);
  }, []);

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  const addCards = (cards: CardType[]) => {
    setCollection((prev) => [...prev, ...cards]);
  };

  return (
    <GameContext.Provider value={{ coins, setCoins, collection, addCards }}>
      {children}
    </GameContext.Provider>
  );
}